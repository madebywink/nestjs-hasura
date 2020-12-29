import { Inject, SetMetadata } from "@nestjs/common";
import {
  HASURA_ACTION_HANDLER,
  HASURA_EVENT_HANDLER,
  HASURA_SDK_CONFIG_INJECT,
  HASURA_SDK_INJECT,
  NAMED_HASURA_SDK_CONFIG_INJECT,
} from "./hasura.constants";

interface HasuraEventHandlerOpts {
  instance?: string;
  trigger: string;
}

interface HasuraActionHandlerOpts {
  instance?: string;
  action: string;
  method: "GET" | "POST";
}

/**
 * Inject the GraphQL Request Client instance. If multiple instances are being used,
 * the `name` parameter is used to distinguish between them
 *
 * @param name optional name of Hasura instance, if using multiple
 */
export function InjectHasuraSdk(name?: string): () => ParameterDecorator {
  if (!name) {
    return () => Inject(HASURA_SDK_INJECT);
  }

  return () => Inject(NAMED_HASURA_SDK_CONFIG_INJECT(name));
}

/**
 * Inject the GraphQL Request Client instance options. If multiple instances are being used,
 * the `name` parameter is used to distinguish between them
 *
 * @param name optional name of Hasura instance, if using multiple
 */
export function InjectHasuraSdkConfig(name?: string): () => ParameterDecorator {
  if (!name) {
    return () => Inject(HASURA_SDK_CONFIG_INJECT);
  }

  return () => Inject(NAMED_HASURA_SDK_CONFIG_INJECT(name));
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
