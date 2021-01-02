import { CanActivate, ExecutionContext } from "@nestjs/common";
import {
  HasuraInstanceOptions,
  HasuraModuleOptions,
  NamedHasuraInstanceOptions,
} from "./hasura-module-options.interface";
import { InjectHasuraModuleOptions } from "./hasura.decorators";
import { Request } from "express";
import { WebhookType } from "./hasura.types";
import { HasuraService } from "./hasura.service";
import {
  DEFAULT_ACTIONS_SECRET_HEADER,
  DEFAULT_INSTANCE_NAME,
} from "./hasura.constants";
import { INVALID_WEBHOOK_TYPE } from "./hasura.error-messages";

export class HasuraEventHandlerHeaderGuard implements CanActivate {
  private readonly secrets: Record<string, string> = {};

  constructor(
    type: WebhookType,
    @InjectHasuraModuleOptions()
    private readonly hasuraOptions: HasuraModuleOptions,
    private readonly hasuraService: HasuraService
  ) {
    if ("instances" in hasuraOptions) {
      for (const instance of hasuraOptions.instances) {
        const secret = this.instanceSecretyByType(type, instance);

        if (!!secret) {
          this.secrets[instance.name] = secret;
        }
      }
    } else {
      if (hasuraOptions.eventsSecret) {
        this.secrets = {
          [DEFAULT_INSTANCE_NAME]: hasuraOptions.eventsSecret,
        };
      }
    }
  }

  canActivate(ctx: ExecutionContext): boolean {
    const req = ctx.switchToHttp().getRequest<Request>();
    const type = this.hasuraService.webhookTypeFromPath(req.path);

    if ("instances" in this.hasuraOptions) {
      const instance = this.hasuraOptions.instances.find(
        (i) => i.hostname === req.hostname
      );
      if (!instance) return false;

      return this.canActivateForInstance(type, req, instance);
    } else {
      return this.canActivateForInstance(type, req, this.hasuraOptions);
    }
  }

  private canActivateForInstance(
    type: WebhookType,
    req: Request,
    instance:
      | Pick<HasuraInstanceOptions, "eventsSecret" | "eventsSecretHeader">
      | Pick<
          NamedHasuraInstanceOptions,
          "eventsSecret" | "eventsSecretHeader" | "name"
        >
  ): boolean {
    const header = this.instanceSecretHeaderByType(type, instance);
    const secret = this.instanceSecretyByType(type, instance);

    if (secret) {
      const secret = req.get(header);
      const instanceName =
        "name" in instance ? instance.name : DEFAULT_INSTANCE_NAME;

      return secret === this.secrets[instanceName];
    }

    return true;
  }

  private instanceSecretyByType(
    type: WebhookType,
    instance: Pick<HasuraInstanceOptions, "actionsSecret" | "eventsSecret">
  ): string | undefined {
    switch (type) {
      case WebhookType.Action:
        return instance.actionsSecret;
      case WebhookType.Event:
        return instance.eventsSecret;
      default:
        throw new Error(INVALID_WEBHOOK_TYPE(type));
    }
  }

  private instanceSecretHeaderByType(
    type: WebhookType,
    instance: Pick<
      HasuraInstanceOptions,
      "actionsSecretHeader" | "eventsSecretHeader"
    >
  ): string {
    switch (type) {
      case WebhookType.Action:
        return instance.actionsSecretHeader ?? DEFAULT_ACTIONS_SECRET_HEADER;
      case WebhookType.Event:
        return instance.eventsSecretHeader ?? DEFAULT_ACTIONS_SECRET_HEADER;
      default:
        throw new Error(INVALID_WEBHOOK_TYPE(type));
    }
  }
}
