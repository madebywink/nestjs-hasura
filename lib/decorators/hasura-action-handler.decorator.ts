import { HASURA_ACTION_HANDLER } from "../hasura.tokens";

interface HasuraActionHandlerOpts {
  action: string;
  method: "GET" | "POST";
}

/**
 * Decorates a service method as a handler for incoming Hasura actions.
 * Actions will be automatically routed here based on their name
 * @param opts The configuration options for this handler
 * @param opts.action the name of the action
 * @param opts.method the HTTP method to respond with (either GET or POST)
 */
export function HasuraActionHandler(
  opts: HasuraActionHandlerOpts
): MethodDecorator {
  return function (
    target: object,
    key: string | symbol,
    descriptor: TypedPropertyDescriptor<any>
  ) {
    Reflect.defineMetadata(HASURA_ACTION_HANDLER, opts, descriptor.value);
    return descriptor;
  };
}
