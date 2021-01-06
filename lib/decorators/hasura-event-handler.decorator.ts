import { SetMetadata } from "@nestjs/common";
import { HASURA_EVENT_HANDLER } from "../hasura.tokens";

interface HasuraEventHandlerOpts {
  instance?: string;
  trigger: string;
}

/**
 * Decorates a service method as a handler for incoming Hasura events.
 * Events will be automatically routed here based on their event type property
 * @param opts The configuration options for this handler
 * @param opts.instance optional name of the instance the event is coming from
 * @param opts.trigger the name of the event trigger
 */
export function HasuraEventHandler(opts: HasuraEventHandlerOpts) {
  return SetMetadata(HASURA_EVENT_HANDLER, opts);
}
