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

function buildInjectToken(base: string, ...suffixes: string[]): string {
  if (!suffixes) {
    return base;
  }

  return `${base}:${suffixes.map((s) => s.toUpperCase).join("_")}`;
}

/**
 * Inject tokens for GraphQL Client and corresponding options
 */
export const HASURA_GRAPHQL_CLIENT_INJECT = Symbol(
  buildInjectToken(HASURA_GRAPHQL_CLIENT_TOKEN)
);

export const HASURA_GRAPHQL_CLIENT_OPTIONS_INJECT = Symbol(
  buildInjectToken(
    HASURA_GRAPHQL_CLIENT_TOKEN,
    HASURA_GRAPHQL_CLIENT_OPTIONS_INJECT_SUFFIX
  )
);

/**
 * Inject tokens for named or singular Sdks from codegen, and corresponding codegen options
 */
export const HASURA_SDK_INJECT = Symbol(buildInjectToken(HASURA_SDK_TOKEN));

export const HASURA_SDK_OPTIONS_INJECT = Symbol(
  buildInjectToken(HASURA_SDK_TOKEN, HASURA_SDK_OPTIONS_INJECT_SUFFIX)
);

/**
 * Inject tokens for instance specific codegen services
 */
export const HASURA_CODEGEN_INJECT = Symbol(
  buildInjectToken(HASURA_CODEGEN_TOKEN)
);

/**
 * Inject tokens for Hasura instance options
 */
export const HASURA_INSTANCE_OPTIONS_INJECT = Symbol(
  buildInjectToken(HASURA_INSTANCE_OPTIONS_TOKEN)
);
