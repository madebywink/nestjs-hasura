import { HasuraInjectionToken } from "../hasura.tokens";
import { HasuraActionHandlerOptions } from "../interfaces/hasura-action-handler-options.interface";

/**
 * Decorates a service method as a handler for incoming Hasura actions.
 * Actions will be automatically routed here based on their name
 * @param opts The configuration options for this handler
 * @param opts.action the name of the action
 * @param opts.method the HTTP method to respond with (either GET or POST)
 */
export function HasuraActionHandler(
  opts: HasuraActionHandlerOptions
): MethodDecorator {
  return function (
    target: object,
    key: string | symbol,
    descriptor: TypedPropertyDescriptor<any>
  ) {
    Reflect.defineMetadata(
      HasuraInjectionToken.ActionHandler,
      opts,
      descriptor.value
    );
    return descriptor;
  };
}
