import { HASURA_EVENT_HANDLER } from "../hasura.tokens";

interface HasuraEventHandlerOpts {
  trigger: string;
}

/**
 * Decorates a service method as a handler for incoming Hasura events.
 * Events will be automatically routed here based on their event type property
 * @param opts The configuration options for this handler
 * @param opts.trigger the name of the event trigger
 */
export function HasuraEventHandler(
  opts: HasuraEventHandlerOpts
): MethodDecorator {
  return function (
    target: object,
    key: string | symbol,
    descriptor: TypedPropertyDescriptor<any>
  ) {
    Reflect.defineMetadata(HASURA_EVENT_HANDLER, opts, descriptor.value);
    return descriptor;
  };
}
