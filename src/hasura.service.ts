import { Injectable } from "@nestjs/common";
import {
  HasuraInstanceOptions,
  HasuraModuleOptions,
  isMultiInstanceOptions,
  NamedHasuraInstanceOptions,
} from "./hasura.module-options";
import { HasuraApi, WebhookType } from "./hasura.types";
import * as url from "url";
import {
  INSTANCE_NOT_FOUND,
  NAMED_INSTANCES_MISMATCH,
  PATH_NOT_WEBHOOK,
} from "./hasura.error-messages";
import { DEFAULT_HASURA_ADMIN_SECRET_HEADER } from "./defaults/hasura.module-options.defaults";
import * as fs from "fs/promises";
import * as path from "path";
import {
  DEFAULT_EVENTS_HANDLER_PATH,
  DEFAULT_HASURA_PATH,
} from "./hasura.constants";

@Injectable()
export class HasuraService {
  /**
   * Get the Hasura Admin Secret header for a given Hasura instance
   * @param instanceOptions
   */
  static hasuraAdminSecretHeader(
    instanceOptions: HasuraInstanceOptions
  ): string {
    return (
      instanceOptions.adminSecretHeader ?? DEFAULT_HASURA_ADMIN_SECRET_HEADER
    );
  }

  /**
   * Get the Hasura GraphQL url for a given Hasura instance
   * @param instanceOptions
   */
  static hasuraGraphqlUrl(instanceOptions: HasuraInstanceOptions): string {
    return new url.URL(
      HasuraApi.GraphQL,
      HasuraService.hasuraBaseUrl(instanceOptions)
    ).toString();
  }

  /**
   * Get the Hasura GraphQL Engine base url for a given Hasura instance
   * @param instanceOptions
   */
  static hasuraBaseUrl(instanceOptions: HasuraInstanceOptions): string {
    function buildUrl(scheme: "http" | "https", hostname: string): string {
      return new url.URL(`${scheme}://${hostname}`).toString();
    }

    return buildUrl(
      instanceOptions.scheme ?? "https",
      instanceOptions.hostname
    );
  }

  /**
   * Find the instances options for a named Hasura instance in a multi instance configuration
   * @param name
   * @param options
   * @throws if the module configuration is not a multi intsance configuration, or if no instance configuration is found for the given name
   */
  static namedHasuraInstance(
    name: string,
    options: HasuraModuleOptions
  ): NamedHasuraInstanceOptions {
    if (!isMultiInstanceOptions(options)) {
      throw new Error(NAMED_INSTANCES_MISMATCH);
    }

    const instance = options.instances.find(
      (instance) => instance.name === name
    );

    if (!instance) {
      throw new Error(INSTANCE_NOT_FOUND(name));
    }

    return instance;
  }

  /**
   * Determin the type of Hasura webhook from the request path
   * @param path
   */
  static webhookTypeFromPath(path: string): WebhookType {
    if (this.isActionsPath(path)) {
      return WebhookType.Action;
    } else if (this.isEventsPath(path)) {
      return WebhookType.Event;
    } else {
      throw new Error(PATH_NOT_WEBHOOK(path));
    }
  }

  /**
   * Get the Hasura controller path for the given module configuration
   */
  static hasuraPath(): string {
    return DEFAULT_HASURA_PATH;
  }

  /**
   * Get the Hasura event webhook path for the given module configuration
   */
  static eventsPath(): string {
    return DEFAULT_EVENTS_HANDLER_PATH;
  }

  /**
   * Get the Hasura action webhook path for the given module configuration
   */
  static actionsPath(): string {
    return DEFAULT_EVENTS_HANDLER_PATH;
  }

  /**
   * Test if a request path corresponds to a Hasura action webhook path
   * @param path
   */
  static isActionsPath(path: string): boolean {
    const split = HasuraService.splitPath(path);
    return this.isHasuraPath(split) && split[1] === this.actionsPath();
  }

  /**
   * Test if a request path corresponds to a Hasura event webhook path
   * @param path
   */
  static isEventsPath(path: string): boolean {
    const split = HasuraService.splitPath(path);
    return this.isHasuraPath(split) && split[1] === this.eventsPath();
  }

  /**
   * Test if a request path is a Hasura path
   * @param path
   */
  static isHasuraPath(splitPath: string[]): boolean {
    return splitPath[0] === this.hasuraPath();
  }

  static splitPath(path: string): string[] {
    const [x, ...rest] = path.split("/");

    return rest;
  }

  /**
   * Test if a given instance configuration is valid for registration by `HasuraModule#register`.
   * HasuraModule can only be registered synchronously codegen is provided
   * @param instanceOptions
   * @throws if no valid codegen file is provided to instance configuration
   */
  static async hasuraInstanceOptionsValidForRootRegistration(
    instanceOptions: HasuraInstanceOptions
  ): Promise<boolean> {
    const pathStr = instanceOptions.sdkOptions?.codegen?.sdkPath;
    if (typeof pathStr !== "string") return false;
    const fPath = path.resolve(pathStr);
    try {
      await fs.access(fPath);
      return true;
    } catch (e) {
      return false;
    }
  }
}
