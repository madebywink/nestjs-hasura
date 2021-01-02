const HASURA_SDK_TOKEN = "HASURA_SDK";
const HASURA_SDK_OPTIONS_INJECT_SUFFIX = "OPTIONS";

function sdkInjectToken(...suffixes: string[]): string {
  if (!suffixes) {
    return HASURA_SDK_TOKEN;
  }

  return `${HASURA_SDK_TOKEN}:${suffixes.map((s) => s.toUpperCase).join("_")}`;
}

export const HASURA_SDK_INJECT = Symbol(sdkInjectToken());
export const NAMED_HASURA_SDK_INJECT = (name: string) =>
  Symbol(sdkInjectToken(name));

export const HASURA_SDK_OPTIONS_INJECT = Symbol(
  sdkInjectToken(HASURA_SDK_OPTIONS_INJECT_SUFFIX)
);
export const NAMED_HASURA_SDK_OPTIONS_INJECT = (name: string) =>
  Symbol(sdkInjectToken(HASURA_SDK_OPTIONS_INJECT_SUFFIX, name));

export const HASURA_EVENT_HANDLER = Symbol("HASUSRA_EVENT_HANDLER");
export const HASURA_ACTION_HANDLER = Symbol("HASURA_ACTION_HANDLER");

export const HASURA_MODULE_OPTIONS_INJECT = Symbol("HASURA_MODULE_OPTIONS");

export const DEFAULT_HASURA_PATH = "/hasura";
export const DEFAULT_ACTIONS_HANDLER_PATH = "/actions";
export const DEFAULT_EVENTS_HANDLER_PATH = "/events";

export const DEFAULT_EVENTS_SECRET_HEADER = "x-hasura-events-secret";
export const DEFAULT_ACTIONS_SECRET_HEADER = "x-hasura-actions-secret";
export const DEFAULT_INSTANCE_NAME = "default";
