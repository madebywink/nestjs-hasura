import { BadRequestException, Logger } from "@nestjs/common";
import {
  HasuraScheduledEventPayload,
  isHasuraScheduledEventTriggerPayload,
} from "../dto/hasura-scheduled-event-payload.interface";
import { HasuraModuleOptions } from "../hasura.module-options";
import { HasuraHandlerDefinitions } from "../interfaces/hasura-handler-definition.interface";

export function scheduledEventHandlerFactory(
  options: Pick<HasuraModuleOptions, "logging">,
  handlerDefinitions: HasuraHandlerDefinitions,
  logger: Logger
) {
  return async function <T>(evt: HasuraScheduledEventPayload<T>) {
    if (!isHasuraScheduledEventTriggerPayload(evt)) {
      throw new Error("Not a scheduled event");
    }

    const handlers = handlerDefinitions[evt.name];

    if (
      typeof options.logging.handlers === undefined
        ? process.env.NODE_ENV === "development"
        : !!options.logging.handlers
    ) {
      logger.log(`Received scheduled event: ${evt.name}`);
    }

    if (handlers.length === 0) {
      const msg = `No scheduled event handlers found for: ${evt.name}`;
      logger.error(msg);
      throw new BadRequestException(msg);
    } else {
      await Promise.all(handlers.map((h) => h(evt)));
    }
  };
}
