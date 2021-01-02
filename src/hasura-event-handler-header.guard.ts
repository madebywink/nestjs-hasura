import { CanActivate, ExecutionContext } from "@nestjs/common";
import { HasuraModuleOptions } from "./hasura-module-options.interface";
import { InjectHasuraModuleOptions } from "./hasura.decorators";
import { Request } from "express";

export class HasuraEventHandlerHeaderGuard implements CanActivate {
  private readonly secrets: Record<string, string> = {};

  constructor(
    @InjectHasuraModuleOptions()
    hasuraOptions: HasuraModuleOptions
  ) {
    if ("instances" in hasuraOptions) {
      for (const instance of hasuraOptions.instances) {
        const secret = instance.eventsSecret;

        if (!!secret) {
          this.secrets[instance.name] = secret;
        }
      }
    } else {
      if (hasuraOptions.eventsSecret) {
        this.secrets = {
          [HasuraEventHandlerHeaderGuard.DEFAULT_INSTANCE_NAME]:
            hasuraOptions.eventsSecret,
        };
      }
    }
  }

  canActivate(ctx: ExecutionContext): boolean {
    const req = ctx.switchToHttp().getRequest<Request>();
  }

  private static readonly DEFAULT_INSTANCE_NAME = "default";
}
