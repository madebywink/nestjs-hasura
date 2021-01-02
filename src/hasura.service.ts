import { Injectable } from "@nestjs/common";
import {
  HasuraInstanceOptions,
  HasuraModuleOptions,
  isMultiInstanceOptions,
} from "./hasura-module-options.interface";
import {
  DEFAULT_EVENTS_HANDLER_PATH,
  DEFAULT_HASURA_PATH,
} from "./hasura.constants";
import { InjectHasuraModuleOptions } from "./hasura.decorators";
import { WebhookType } from "./hasura.types";
import * as url from "url";
import {
  INSTANCE_NOT_FOUND,
  NAMED_INSTANCES_MISMATCH,
  PATH_NOT_WEBHOOK,
} from "./hasura.error-messages";

@Injectable()
export class HasuraService {
  constructor(
    @InjectHasuraModuleOptions()
    private readonly hasuraOptions: HasuraModuleOptions
  ) {}

  hasuraGraphqlUrl(name?: string);

  hasuraBaseUrl(name?: string): string {
    function buildUrl(scheme: "http" | "https", hostname: string): string {
      return new url.URL(`${scheme}://${hostname}`).toString();
    }

    if (!isMultiInstanceOptions(this.hasuraOptions)) {
      if (name) {
        throw new Error(NAMED_INSTANCES_MISMATCH);
      }
    } else {
      const instance = this.namedHasuraInstance(name);
    }

    if ("instances" in this.hasuraOptions) {
      if (!name) {
        throw new Error(NAMED_INSTANCES_MISMATCH);
      }

      const instance = this.hasuraOptions.instances.find(
        (instance) => instance.name === name
      );

      return buildUrl(instance.scheme ?? "https", instance.hostname);
    } else {
      return buildUrl(
        this.hasuraOptions.scheme ?? "https",
        this.hasuraOptions.hostname
      );
    }
  }

  namedHasuraInstance(name: string): HasuraInstanceOptions {
    if (!isMultiInstanceOptions(this.hasuraOptions)) {
      throw new Error(NAMED_INSTANCES_MISMATCH);
    }

    const instance = this.hasuraOptions.instances.find(
      (instance) => instance.name === name
    );

    if (!instance) {
      throw new Error(INSTANCE_NOT_FOUND(name));
    }

    return instance;
  }

  webhookTypeFromPath(path: string): WebhookType {
    if (this.isActionsPath(path)) {
      return WebhookType.Action;
    } else if (this.isEventsPath(path)) {
      return WebhookType.Event;
    } else {
      throw new Error(PATH_NOT_WEBHOOK(path));
    }
  }

  hasuraPath(): string {
    return DEFAULT_HASURA_PATH;
  }

  eventsPath(): string {
    return DEFAULT_EVENTS_HANDLER_PATH;
  }

  actionsPath(): string {
    return DEFAULT_EVENTS_HANDLER_PATH;
  }

  isActionsPath(path: string): boolean {
    const split = HasuraService.splitPath(path);
    return this.isHasuraPath(split) && split[1] === this.actionsPath();
  }

  isEventsPath(path: string): boolean {
    const split = HasuraService.splitPath(path);
    return this.isHasuraPath(split) && split[1] === this.eventsPath();
  }

  isHasuraPath(splitPath: string[]): boolean {
    return splitPath[0] === this.hasuraPath();
  }

  static splitPath(path: string): string[] {
    const [x, ...rest] = path.split("/");

    return rest;
  }
}
