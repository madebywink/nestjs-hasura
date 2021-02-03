import { BadRequestException, Logger } from "@nestjs/common";
import {
  HasuraActionPayload,
  isHasuraActionPayload,
} from "../dto/hasura-action-payload.interface";
import {
  HasuraEventTriggerPayload,
  isHasuraEventTriggerPayload,
} from "../dto/hasura-event-trigger-payload.interface";
import { HasuraModuleOptions } from "../hasura.module-options";
import { OpName } from "../hasura.types";
import { HasuraHandlerDefinitions } from "../interfaces/hasura-handler-definition.interface";

export function actionHandlerFactory(
  options: Pick<HasuraModuleOptions, "logging">,
  handlerDefinitions: HasuraHandlerDefinitions,
  logger: Logger
) {
  return async function <T>(action: HasuraActionPayload<T>) {
    if (!isHasuraActionPayload<T>(action)) {
      throw new Error("Not an action");
    }

    const handlers = handlerDefinitions[action.action.name];

    if (
      typeof options.logging.handlers === undefined
        ? process.env.NODE_ENV === "development"
        : !!options.logging.handlers
    ) {
      logger.log(`Received action: ${action.action.name}`);
    }

    if (handlers.length === 0) {
      const msg = `No action handlers found for: ${action.action.name}`;
      logger.error(msg);
      throw new BadRequestException(msg);
    } else {
      await Promise.all(handlers.map((h) => h(action)));
    }
  };
}
