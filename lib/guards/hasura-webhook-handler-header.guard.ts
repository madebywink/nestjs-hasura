import { CanActivate, ExecutionContext } from "@nestjs/common";
import { HasuraModuleOptions } from "../hasura.module-options";
import { Request } from "express";
import { WebhookType } from "../hasura.types";
import { HasuraService } from "../hasura.service";
import {
  INVALID_WEBHOOK_TYPE,
  WEBHOOK_HEADER_SECRET_MISMATCH,
} from "../hasura.error-messages";
import { InjectHasuraModuleOptions } from "../decorators/inject-hasura-module-options.decorator";

export class HasuraWebhookHandlerHeaderGuard implements CanActivate {
  private readonly eventsSecret: string | undefined;
  private readonly actionsSecret: string | undefined;

  constructor(
    @InjectHasuraModuleOptions()
    private readonly hasuraOptions: HasuraModuleOptions
  ) {
    this.eventsSecret = hasuraOptions.eventsSecret;
    this.actionsSecret = hasuraOptions.actionsSecret;
  }

  /**
   *
   * @param ctx
   * @throws if computed webhook type is invalid or if a secret is provided with an undefined (overridden by user) header
   */
  canActivate(ctx: ExecutionContext): boolean {
    const req = ctx.switchToHttp().getRequest<Request>();
    const type = HasuraService.webhookTypeFromPath(req.path);

    let header: string | undefined;
    let secret: string | undefined;

    switch (type) {
      case WebhookType.Action:
        header = this.hasuraOptions.actionsSecretHeader;
        secret = this.hasuraOptions.actionsSecret;
        break;
      case WebhookType.Event:
        header = this.hasuraOptions.eventsSecretHeader;
        secret = this.hasuraOptions.eventsSecret;
        break;
      default:
        throw new Error(INVALID_WEBHOOK_TYPE(type));
    }

    if (typeof secret === "string" && typeof header === undefined) {
      throw new Error(WEBHOOK_HEADER_SECRET_MISMATCH(type));
    } else if (typeof secret === "string" && typeof header === "string") {
      const secret = req.get(header);

      switch (type) {
        case WebhookType.Action:
          return secret === this.actionsSecret;
        case WebhookType.Event:
          return secret === this.eventsSecret;
      }
    }

    return true;
  }
}
