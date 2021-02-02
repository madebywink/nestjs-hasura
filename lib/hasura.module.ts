import {
  DynamicModule,
  Logger,
  Module,
  OnModuleInit,
  Provider,
} from "@nestjs/common";
import { GraphQLClient } from "graphql-request";
import {
  HasuraModuleAsyncOptions,
  HasuraModuleOptions,
  HasuraOptionsFactory,
  mergeGraphqlClientOptions,
} from "./hasura.module-options";
import { HasuraService } from "./hasura.service";
import { SYNC_REGISTER_CODEGEN_ENBALED } from "./hasura.error-messages";
import { HasuraCodegenService } from "./hasura-codegen.service";
import { GetSdk } from "./hasura-sdk.types";
import { HasuraDescriptorToken, HasuraInjectionToken } from "./hasura.tokens";
import { HasuraWebhookHandlerHeaderGuard } from "./guards/hasura-webhook-handler-header.guard";
import { InjectHasuraModuleOptions } from "./decorators/inject-hasura-module-options.decorator";
import {
  DiscoveryModule,
  DiscoveryService,
  DiscoveredMethodWithMeta,
} from "@golevelup/nestjs-discovery";
import { HasuraEventHandlerOptions } from "./interfaces/hasura-event-handler-options.interface";
import { HasuraActionHandlerOptions } from "./interfaces/hasura-action-handler-options.interface";
import { ExternalContextCreator } from "@nestjs/core/helpers/external-context-creator";
import * as _ from "lodash";
import { HasuraHandlerDefinitions } from "./interfaces/hasura-handler-definition.interface";
import { HasuraEventHandlerService } from "./hasura-event-handler.service";
import { eventHandlerFactory } from "./factories/event-handler.factory";

@Module({
  imports: [DiscoveryModule],
  providers: [HasuraWebhookHandlerHeaderGuard, HasuraCodegenService],
})
export class HasuraModule implements OnModuleInit {
  private readonly logger = new Logger(HasuraModule.name);
  private eventHandlerMethods: DiscoveredMethodWithMeta<HasuraEventHandlerOptions>[] = [];
  private actionHandlerMethods: DiscoveredMethodWithMeta<HasuraActionHandlerOptions>[] = [];
  private scheduledEventHandlerMethods: DiscoveredMethodWithMeta<HasuraEventHandlerOptions>[] = [];

  constructor(
    @InjectHasuraModuleOptions()
    private readonly moduleOptions: HasuraModuleOptions,
    private readonly discoveryService: DiscoveryService,
    private readonly externalContextCreator: ExternalContextCreator
  ) {}

  async onModuleInit() {
    this.logger.log("Initializing Hasura Module");

    await this.discoverHandlerMethods();
  }

  /**
   * Synchronously register the module. Not compatible with managed code generation
   * @param options
   * @param getSdk
   */
  static register(options: HasuraModuleOptions, getSdk: GetSdk): DynamicModule {
    // Test if provided instances are correctly configured for manual codegen.
    // Synchronous module registration does not support managed codegen
    if (!HasuraService.hasuraInstanceOptionsValidForRootRegistration(options)) {
      throw new Error(SYNC_REGISTER_CODEGEN_ENBALED);
    }

    return {
      module: HasuraModule,
      providers: [
        {
          provide: HasuraInjectionToken.ModuleOptions,
          useValue: options,
        },
        {
          provide: HasuraInjectionToken.GraphQLClientOptions,
          useValue: mergeGraphqlClientOptions(options),
        },
        {
          provide: HasuraInjectionToken.GraphQLClient,
          useValue: new GraphQLClient(
            HasuraService.hasuraGraphqlUrl(options),
            mergeGraphqlClientOptions(options)
          ),
        },
        {
          provide: HasuraInjectionToken.SdkOptions,
          useValue: options.sdkOptions ?? HasuraDescriptorToken.Empty,
        },
        {
          provide: HasuraInjectionToken.Sdk,
          useFactory(graphQLClient: GraphQLClient) {
            return getSdk(graphQLClient);
          },
          inject: [HasuraInjectionToken.GraphQLClient],
        },
      ],
    };
  }

  static registerAsync(
    options: HasuraModuleAsyncOptions,
    getSdk?: GetSdk
  ): DynamicModule {
    let providers: Provider[] = [];
    let moduleOptionsProvider: Provider;

    if ("useClass" in options) {
      moduleOptionsProvider = {
        provide: HasuraInjectionToken.ModuleOptions,
        async useFactory(optionsFactory: HasuraOptionsFactory) {
          return optionsFactory.createHausraOptions();
        },
        inject: [options.useClass],
      };
    }

    if ("useExisting" in options) {
      moduleOptionsProvider = {
        provide: HasuraInjectionToken.ModuleOptions,
        useExisting: options.useExisting,
      };
    }

    if ("useFactory" in options) {
      moduleOptionsProvider = {
        provide: HasuraInjectionToken.ModuleOptions,
        useFactory: options.useFactory,
        inject: options.inject ?? [],
      };
    }

    providers.push(moduleOptionsProvider);

    if ("useClass" in options) {
      providers.push({
        provide: options.useClass,
        useClass: options.useClass,
      });
    }

    return {
      module: HasuraModule,
      imports: options.imports,
      providers: [
        ...providers,
        {
          provide: HasuraInjectionToken.GraphQLClientOptions,
          useFactory(options: HasuraModuleOptions) {
            return mergeGraphqlClientOptions(options);
          },
          inject: [HasuraInjectionToken.ModuleOptions],
        },
        {
          provide: HasuraInjectionToken.GraphQLClient,
          useFactory(options: HasuraModuleOptions) {
            return new GraphQLClient(
              HasuraService.hasuraGraphqlUrl(options),
              mergeGraphqlClientOptions(options)
            );
          },
          inject: [HasuraInjectionToken.ModuleOptions],
        },
        {
          provide: HasuraInjectionToken.SdkOptions,
          useFactory(options: HasuraModuleOptions) {
            return options.sdkOptions ?? HasuraDescriptorToken.Empty;
          },
          inject: [HasuraInjectionToken.ModuleOptions],
        },
        {
          provide: HasuraInjectionToken.Sdk,
          useFactory(graphQLClient: GraphQLClient) {
            if (typeof getSdk === "function") {
              return getSdk(graphQLClient);
            }

            return HasuraDescriptorToken.Empty;
          },
          inject: [HasuraInjectionToken.GraphQLClient],
        },
      ],
    };
  }

  /**
   * Gets the generated GraphQL Sdk either from a manually generated getSdk function (as in the case of sync registration)
   * or by dynamically importing the Sdk generated by HasuraCodgenService
   *
   * @param moduleOptions HasuraModuleOptions instance
   * @param client GraphQL Client instance
   * @param codegen HasuraCodegenService instance
   * @param getSdk optional getSdk function in the case of sync registration
   */
  static async getHasuraSdk(
    moduleOptions: HasuraModuleOptions,
    client: GraphQLClient,
    codegen: HasuraCodegenService,
    getSdk?: GetSdk
  ) {
    if (!!getSdk) {
      return getSdk(client);
    }

    try {
      await codegen.graphqlCodegen();
    } catch (e) {
      console.log("Failed to generate Hasura Sdk during module registration");
      console.error(e);
      throw e;
    }
    const generated = await import(codegen.generatedFile());

    if (!("getSdk" in generated)) {
      throw new Error("Generated file missing getSdk");
    }

    return generated.getSdk(
      client,
      moduleOptions.sdkOptions?.codegen?.requestMiddleware ??
        ((x: unknown) => x)
    );
  }

  private async discoverHandlerMethods() {
    this.eventHandlerMethods = await this.discoveryService.providerMethodsWithMetaAtKey<HasuraEventHandlerOptions>(
      HasuraInjectionToken.EventHandler
    );

    if (this.eventHandlerMethods.length === 0) {
      this.logger.log("No event handlers found");
    } else {
      this.logger.log(
        `Discovered ${this.eventHandlerMethods.length} event handlers for Hasura`
      );
    }

    this.scheduledEventHandlerMethods = await this.discoveryService.providerMethodsWithMetaAtKey<HasuraEventHandlerOptions>(
      HasuraInjectionToken.ScheduledEventHandler
    );

    if (this.scheduledEventHandlerMethods.length === 0) {
      this.logger.log("No event handlers found");
    } else {
      this.logger.log(
        `Discovered ${this.scheduledEventHandlerMethods.length} event handlers for Hasura`
      );
    }

    this.actionHandlerMethods = await this.discoveryService.providerMethodsWithMetaAtKey<HasuraActionHandlerOptions>(
      HasuraInjectionToken.ActionHandler
    );

    if (this.actionHandlerMethods.length === 0) {
      this.logger.log("No action handlers found");
    } else {
      this.logger.log(
        `Discovered ${this.actionHandlerMethods.length} action handlers for Hasura`
      );
    }
  }

  private async setupEventHandlers() {
    const groupedByProvider = _.groupBy(
      this.eventHandlerMethods,
      (m) => m.discoveredMethod.parentClass.name
    );

    const handlerDefinitions: HasuraHandlerDefinitions = {};

    for (const group of Object.keys(groupedByProvider)) {
      this.logger.log(`Registering Hasura event handlers from ${group}`);
      for (const handler of groupedByProvider[group]) {
        const key = handler.meta.trigger;
        const externalContext = this.externalContextCreator.create(
          handler.discoveredMethod.parentClass.instance,
          handler.discoveredMethod.handler,
          handler.discoveredMethod.methodName
        );

        if (!handlerDefinitions[key]) {
          handlerDefinitions[key] = [externalContext];
        } else {
          handlerDefinitions[key].push(externalContext);
        }
      }
    }

    const eventHandlerServiceInstance = (
      await this.discoveryService.providers(
        (p) => p.name === HasuraEventHandlerService.name
      )
    )[0].instance as HasuraEventHandlerService;

    eventHandlerServiceInstance.handleEvent = eventHandlerFactory(
      this.moduleOptions,
      handlerDefinitions,
      this.logger
    );
  }
}
