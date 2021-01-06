import { SetMetadata } from "@nestjs/common";
import { HASURA_ACTION_HANDLER } from "../hasura.tokens";

interface HasuraActionHandlerOpts {
  instance?: string;
  action: string;
  method: "GET" | "POST";
}

/**
 * Decorates a service method as a handler for incoming Hasura actions.
 * Actions will be automatically routed here based on their name
 * @param opts The configuration options for this handler
 * @param opts.instance optional name of the instance the action is coming from
 * @param opts.trigger the name of the action
 * @param opts.method the HTTP method to respond with (either GET or POST)
 */
export function HasuraActionHandler(opts: HasuraActionHandlerOpts) {
  return SetMetadata(HASURA_ACTION_HANDLER, opts);
}
