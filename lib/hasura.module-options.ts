import { Abstract, ModuleMetadata, Type } from "@nestjs/common";
import { GraphQLClient } from "graphql-request";
import { HasuraSdkRequestMiddleware } from "./hasura-sdk.types";
import { HasuraService } from "./hasura.service";
import { SchemaMetadataReportingLevel } from "./hasura.types";

type GraphQLClientConstructorParams = ConstructorParameters<
  typeof GraphQLClient
>;

export type GrapQLClientOptions = GraphQLClientConstructorParams[1];

interface ReportingOptionsBase {
  level: SchemaMetadataReportingLevel;
}

type EventsReportingOptions = ReportingOptionsBase & {
  included_events?: string[];
  excluded_events?: string[];
};

type ActionsReportingOptions = ReportingOptionsBase & {
  included_actions?: string[];
  excluded_actions?: string[];
};

export interface HasuraSdkOptions {
  codegen?: {
    outputDir?: string;
    sdkPath?: string;
    requestMiddleware?: HasuraSdkRequestMiddleware;
  };
}

export interface HasuraModuleOptions {
  scheme?: "http" | "https";
  hostname: string;
  port?: number;
  adminSecret: string;
  adminSecretHeader?: string;
  eventsReporting?: EventsReportingOptions;
  actionsReporting?: ActionsReportingOptions;
  graphQLClientOptions?: GrapQLClientOptions;
  eventsSecret?: string;
  eventsSecretHeader?: string;
  actionsSecret?: string;
  actionsSecretHeader?: string;
  sdkOptions?: HasuraSdkOptions;
  logging?: HasuraLoggingOptions;
}

interface HasuraLoggingOptions {
  handlers?: {
    events?: boolean;
    scheduledEvents?: boolean;
    actions?: boolean;
  };
}

export interface HasuraOptionsFactory {
  createHausraOptions(): Promise<HasuraModuleOptions> | HasuraModuleOptions;
}

interface HasuraModuleAsyncOptionsBase extends Pick<ModuleMetadata, "imports"> {
  inject?: (string | symbol | Function | Type<any> | Abstract<any>)[];
}

export interface HasuraModuleAsyncOptionsExisting
  extends HasuraModuleAsyncOptionsBase {
  useExisting: Type<HasuraOptionsFactory> | string | symbol;
}

export interface HasuraModuleAsyncOptionsFactory
  extends HasuraModuleAsyncOptionsBase {
  useFactory: (
    ...args: unknown[]
  ) => Promise<HasuraModuleOptions> | HasuraModuleOptions;
}

export interface HasuraModuleAsyncOptionsClass
  extends HasuraModuleAsyncOptionsBase {
  useClass: Type<HasuraOptionsFactory>;
}

export type HasuraModuleAsyncOptions =
  | HasuraModuleAsyncOptionsFactory
  | HasuraModuleAsyncOptionsClass
  | HasuraModuleAsyncOptionsExisting;

export function mergeGraphqlClientOptions(
  moduleOptions: Pick<
    HasuraModuleOptions,
    "graphQLClientOptions" | "adminSecret" | "adminSecretHeader"
  >
): GrapQLClientOptions {
  return {
    ...moduleOptions.graphQLClientOptions,
    headers: {
      ...moduleOptions.graphQLClientOptions?.headers,
      [HasuraService.hasuraAdminSecretHeader(
        moduleOptions
      )]: moduleOptions.adminSecret,
    },
  };
}
