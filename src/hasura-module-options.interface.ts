import { Abstract, ModuleMetadata, Provider, Type } from "@nestjs/common";
import { GraphQLClient } from "graphql-request";
import { SchemaMetadataReportingLevel } from "./hasura.types";

type GraphQLClientConstructorParams = ConstructorParameters<
  typeof GraphQLClient
>;

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

export interface HasuraInstanceOptions {
  scheme?: "http" | "https";
  hostname: string;
  eventsReporting?: EventsReportingOptions;
  actionsReporting?: ActionsReportingOptions;
  graphQLClientOptions?: GraphQLClientConstructorParams[1];
  eventsSecret?: string;
  eventsSecretHeader?: string;
  actionsSecret?: string;
  actionsSecretHeader?: string;
}

export interface NamedHasuraInstanceOptions extends HasuraInstanceOptions {
  name: string;
}

export interface HasuraMultiInstanceModuleOptions {
  instances: NamedHasuraInstanceOptions[];
}

export type HasuraModuleOptions =
  | HasuraInstanceOptions
  | HasuraMultiInstanceModuleOptions;

export interface HasuraOptionsFactory {
  createHausraOptions(): Promise<HasuraModuleOptions> | HasuraModuleOptions;
}

interface HasuraModuleAsyncOptionsBase extends Pick<ModuleMetadata, "imports"> {
  inject?: (string | symbol | Function | Type<any> | Abstract<any>)[];
}

export interface HasuraModuleAsyncOptionsExisting
  extends HasuraModuleAsyncOptionsBase {
  useExisting: Type<HasuraOptionsFactory>;
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

export function isMultiInstanceOptions(
  options: HasuraModuleOptions
): options is HasuraMultiInstanceModuleOptions {
  return "instances" in options;
}
