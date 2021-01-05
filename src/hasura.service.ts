import { Injectable } from "@nestjs/common";
import {
  HasuraInstanceOptions,
  HasuraModuleOptions,
  isMultiInstanceOptions,
  NamedHasuraInstanceOptions,
} from "./hasura.module-options";
import {
  DEFAULT_EVENTS_HANDLER_PATH,
  DEFAULT_HASURA_PATH,
} from "./hasura.constants";
import { HasuraApi, WebhookType } from "./hasura.types";
import * as url from "url";
import {
  INSTANCE_NOT_FOUND,
  NAMED_INSTANCES_MISMATCH,
  PATH_NOT_WEBHOOK,
} from "./hasura.error-messages";
import { DEFAULT_HASURA_ADMIN_SECRET_HEADER } from "./hasura.module-options.defaults";
import * as fs from "fs/promises";
import * as path from "path";

@Injectable()
export class HasuraService {
  static hasuraAdminSecretHeader(
    instanceOptions: HasuraInstanceOptions
  ): string {
    return (
      instanceOptions.adminSecretHeader ?? DEFAULT_HASURA_ADMIN_SECRET_HEADER
    );
  }

  static hasuraGraphqlUrl(instanceOptions: HasuraInstanceOptions): string {
    return new url.URL(
      HasuraApi.GraphQL,
      HasuraService.hasuraBaseUrl(instanceOptions)
    ).toString();
  }

  static hasuraBaseUrl(instanceOptions: HasuraInstanceOptions): string {
    function buildUrl(scheme: "http" | "https", hostname: string): string {
      return new url.URL(`${scheme}://${hostname}`).toString();
    }

    return buildUrl(
      instanceOptions.scheme ?? "https",
      instanceOptions.hostname
    );
  }

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

  static webhookTypeFromPath(path: string): WebhookType {
    if (this.isActionsPath(path)) {
      return WebhookType.Action;
    } else if (this.isEventsPath(path)) {
      return WebhookType.Event;
    } else {
      throw new Error(PATH_NOT_WEBHOOK(path));
    }
  }

  static hasuraPath(): string {
    return DEFAULT_HASURA_PATH;
  }

  static eventsPath(): string {
    return DEFAULT_EVENTS_HANDLER_PATH;
  }

  static actionsPath(): string {
    return DEFAULT_EVENTS_HANDLER_PATH;
  }

  static isActionsPath(path: string): boolean {
    const split = HasuraService.splitPath(path);
    return this.isHasuraPath(split) && split[1] === this.actionsPath();
  }

  static isEventsPath(path: string): boolean {
    const split = HasuraService.splitPath(path);
    return this.isHasuraPath(split) && split[1] === this.eventsPath();
  }

  static isHasuraPath(splitPath: string[]): boolean {
    return splitPath[0] === this.hasuraPath();
  }

  static splitPath(path: string): string[] {
    const [x, ...rest] = path.split("/");

    return rest;
  }

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
