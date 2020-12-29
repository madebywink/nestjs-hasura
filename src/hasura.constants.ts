const HASURA_SDK_TOKEN = "HASURA_SDK";
const HASURA_SDK_OPTIONS_INJECT_SUFFIX = "OPTIONS";

function sdkIjectToken(...suffixes: string[]): string {
  if (!suffixes) {
    return HASURA_SDK_TOKEN;
  }

  return `${HASURA_SDK_TOKEN}:${suffixes.map((s) => s.toUpperCase).join("_")}`;
}

export const HASURA_SDK_INJECT = Symbol(sdkIjectToken());
export const NAMED_HASURA_SDK_INJECT = (name: string) =>
  Symbol(sdkIjectToken(name));

export const HASURA_SDK_OPTIONS_INJECT = Symbol(
  sdkIjectToken(HASURA_SDK_OPTIONS_INJECT_SUFFIX)
);
export const NAMED_HASURA_SDK_OPTIONS_INJECT = (name: string) =>
  Symbol(sdkIjectToken(HASURA_SDK_OPTIONS_INJECT_SUFFIX, name));

export const HASURA_EVENT_HANDLER = Symbol("HASUSRA_EVENT_HANDLER");
export const HASURA_ACTION_HANDLER = Symbol("HASURA_ACTION_HANDLER");

export const HASURA_MODULE_OPTIONS_INJECT = Symbol("HASURA_MODULE_OPTIONS");
