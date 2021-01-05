const HASURA_SDK_TOKEN = "HASURA_SDK";
const HASURA_SDK_OPTIONS_INJECT_SUFFIX = "OPTIONS";
const HASURA_GRAPHQL_CLIENT_TOKEN = "HASURA_GRAPHQL_CLIENT";
const HASURA_GRAPHQL_CLIENT_OPTIONS_INJECT_SUFFIX = "OPTIONS";
const HASURA_CODEGEN_TOKEN = "HASURA_CODEGEN";
const HASURA_INSTANCE_OPTIONS_TOKEN = "HASURA_INSTANCE_OPTIONS";

/**
 * Inject tokens for Hasura handler decorators
 */
export const HASURA_EVENT_HANDLER = Symbol("HASUSRA_EVENT_HANDLER");
export const HASURA_ACTION_HANDLER = Symbol("HASURA_ACTION_HANDLER");

export const HASURA_MODULE_OPTIONS_INJECT = Symbol("HASURA_MODULE_OPTIONS");

export const DEFAULT_HASURA_PATH = "/hasura";
export const DEFAULT_ACTIONS_HANDLER_PATH = "/actions";
export const DEFAULT_EVENTS_HANDLER_PATH = "/events";

export const DEFAULT_EVENTS_SECRET_HEADER = "x-hasura-events-secret";
export const DEFAULT_ACTIONS_SECRET_HEADER = "x-hasura-actions-secret";
export const DEFAULT_INSTANCE_NAME = "default";

function buildInjectToken(base: string, ...suffixes: string[]): string {
  if (!suffixes) {
    return base;
  }

  return `${base}:${suffixes.map((s) => s.toUpperCase).join("_")}`;
}

/**
 * Inject tokens for named or singular GraphQL Client and corresponding options
 */
export const HASURA_GRAPHQL_CLIENT_INJECT = Symbol(
  buildInjectToken(HASURA_GRAPHQL_CLIENT_TOKEN)
);
export const NAMED_HASURA_GRAPHQL_CLIENT_INJECT = (name: string) =>
  Symbol(buildInjectToken(HASURA_GRAPHQL_CLIENT_TOKEN, name));

export const HASURA_GRAPHQL_CLIENT_OPTIONS_INJECT = Symbol(
  buildInjectToken(
    HASURA_GRAPHQL_CLIENT_TOKEN,
    HASURA_GRAPHQL_CLIENT_OPTIONS_INJECT_SUFFIX
  )
);
export const NAMED_HASURA_GRAPHQL_CLIENT_OPTIONS_INJECT = (name: string) =>
  Symbol(
    buildInjectToken(
      HASURA_GRAPHQL_CLIENT_TOKEN,
      HASURA_GRAPHQL_CLIENT_OPTIONS_INJECT_SUFFIX,
      name
    )
  );

/**
 * Inject tokens for named or singular Sdks from codegen, and corresponding codegen options
 */
export const HASURA_SDK_INJECT = Symbol(buildInjectToken(HASURA_SDK_TOKEN));
export const NAMED_HASURA_SDK_INJECT = (name: string) =>
  Symbol(buildInjectToken(HASURA_SDK_TOKEN, name));

export const HASURA_SDK_OPTIONS_INJECT = Symbol(
  buildInjectToken(HASURA_SDK_TOKEN, HASURA_SDK_OPTIONS_INJECT_SUFFIX)
);
export const NAMED_HASURA_SDK_OPTIONS_INJECT = (name: string) =>
  Symbol(
    buildInjectToken(HASURA_SDK_TOKEN, HASURA_SDK_OPTIONS_INJECT_SUFFIX, name)
  );

/**
 * Inject tokens for instance specific codegen services
 */
export const HASURA_CODEGEN_INJECT = Symbol(
  buildInjectToken(HASURA_CODEGEN_TOKEN)
);
export const NAMED_HASURA_CODEGEN_INJECT = (name: string) =>
  Symbol(buildInjectToken(HASURA_CODEGEN_TOKEN, name));

/**
 * Inject tokens for Hasura instance options
 */
export const HASURA_INSTANCE_OPTIONS_INJECT = Symbol(
  buildInjectToken(HASURA_INSTANCE_OPTIONS_TOKEN)
);
export const NAMED_HASURA_INSTANCE_OPTIONS_INJECT = (name: string) =>
  Symbol(buildInjectToken(HASURA_INSTANCE_OPTIONS_TOKEN, name));
