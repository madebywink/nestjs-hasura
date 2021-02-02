import { BadRequestException, Logger } from "@nestjs/common";
import {
  HasuraEventTriggerPayload,
  isHasuraEventTriggerPayload,
} from "../dto/hasura-event-trigger-payload.interface";
import { HasuraModuleOptions } from "../hasura.module-options";
import { OpName } from "../hasura.types";
import { HasuraHandlerDefinitions } from "../interfaces/hasura-handler-definition.interface";

export function eventHandlerFactory(
  options: Pick<HasuraModuleOptions, "logging">,
  handlerDefinitions: HasuraHandlerDefinitions,
  logger: Logger
) {
  return async function <T, U extends OpName>(
    evt: HasuraEventTriggerPayload<T, U>
  ) {
    if (!isHasuraEventTriggerPayload(evt)) {
      throw new Error("Not an event");
    }

    const handlers = handlerDefinitions[evt.trigger.name];

    if (
      typeof options.logging.handlers === undefined
        ? process.env.NODE_ENV === "development"
        : !!options.logging.handlers
    ) {
      logger.log(`Received event for trigger: ${evt.trigger.name}`);
    }

    if (handlers.length === 0) {
      const msg = `No event handlers found for trigger: ${evt.trigger.name}`;
      logger.error(msg);
      throw new BadRequestException(msg);
    } else {
      await Promise.all(handlers.map((h) => h(evt)));
    }
  };
}
