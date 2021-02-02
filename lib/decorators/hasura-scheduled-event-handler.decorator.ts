import { HasuraInjectionToken } from "../hasura.tokens";
import { HasuraEventHandlerOptions } from "../interfaces/hasura-event-handler-options.interface";

/**
 * Decorates a service method as a handler for incoming Hasura events.
 * Events will be automatically routed here based on their event type property
 * @param opts The configuration options for this handler
 * @param opts.trigger the name of the event trigger
 */
export function HasuraScheduledEventHandler(
  opts: HasuraEventHandlerOptions
): MethodDecorator {
  return function (
    target: object,
    key: string | symbol,
    descriptor: TypedPropertyDescriptor<any>
  ) {
    Reflect.defineMetadata(
      HasuraInjectionToken.ScheduledEventHandler,
      opts,
      descriptor.value
    );
    return descriptor;
  };
}
