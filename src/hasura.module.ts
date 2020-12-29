import { DynamicModule, Module, Provider } from "@nestjs/common";
import { GraphQLClient } from "graphql-request";
import {
  HasuraInstanceOptions,
  HasuraModuleAsyncOptions,
  HasuraModuleAsyncOptionsClass,
  HasuraModuleOptions,
  HasuraOptionsFactory,
  NamedHasuraInstanceOptions,
} from "./hasura-module-options.interface";
import {
  HASURA_MODULE_OPTIONS_INJECT,
  HASURA_SDK_INJECT,
  HASURA_SDK_OPTIONS_INJECT,
  NAMED_HASURA_SDK_INJECT,
  NAMED_HASURA_SDK_OPTIONS_INJECT,
} from "./hasura.constants";

@Module({})
export class HasuraModule {
  static register(options: HasuraModuleOptions): DynamicModule {
    return {
      module: HasuraModule,
      providers: [
        ...this.createSdkProviders(options),
        {
          provide: HASURA_MODULE_OPTIONS_INJECT,
          useValue: options,
        },
      ],
    };
  }

  static registerAsync(options: HasuraModuleAsyncOptions): DynamicModule {
    const providers: Provider[] = [];

    let optionsProvider: Provider;

    if ("useFactory" in options) {
      optionsProvider = {
        provide: HASURA_MODULE_OPTIONS_INJECT,
        useFactory: options.useFactory,
        inject: options.inject ?? [],
      };
    } else {
      const inject =
        "useExisting" in options ? options.useExisting : options.useClass;

      optionsProvider = {
        provide: HASURA_MODULE_OPTIONS_INJECT,
        useFactory: async (optionsFactory: HasuraOptionsFactory) =>
          await optionsFactory.createHausraOptions(),
        inject: [inject],
      };
    }

    if ("useExisting" in options || "useFactory" in options) {
      providers.push(optionsProvider);
    } else {
      providers.push(optionsProvider);
      providers.push({
        provide: (options as HasuraModuleAsyncOptionsClass).useClass,
        useClass: options.useClass,
      });
    }

    return {
      module: HasuraModule,
      imports: options.imports ?? [],
      providers: [],
    };
  }

  private static createSdkProviders(options: HasuraModuleOptions): Provider[] {
    if ("instances" in options) {
      return options.instances
        .map((i): Provider[] => [
          {
            provide: NAMED_HASURA_SDK_OPTIONS_INJECT(i.instanceName),
            useValue: i,
          },
          {
            provide: NAMED_HASURA_SDK_INJECT(i.instanceName),
            useFactory: (opts: NamedHasuraInstanceOptions) => {
              return new GraphQLClient(
                opts.hasuraUrl,
                opts.graphQLClientOptions
              );
            },
            inject: [NAMED_HASURA_SDK_OPTIONS_INJECT(i.instanceName)],
          },
        ])
        .reduce((acc, curr) => acc.concat(curr));
    } else {
      return [
        {
          provide: HASURA_SDK_OPTIONS_INJECT,
          useValue: options,
        },
        {
          provide: HASURA_SDK_INJECT,
          useFactory: (opts: HasuraInstanceOptions) => {
            return new GraphQLClient(opts.hasuraUrl, opts.graphQLClientOptions);
          },
        },
      ];
    }
  }
}
