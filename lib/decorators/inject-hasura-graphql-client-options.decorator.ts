import { Inject } from "@nestjs/common";
import { HASURA_GRAPHQL_CLIENT_OPTIONS_INJECT } from "../hasura.tokens";

/**
 * Inject the GraphQL Request Client instance options.
 */
export function InjectHasuraGraphQLClientOptions(): ParameterDecorator {
  return Inject(HASURA_GRAPHQL_CLIENT_OPTIONS_INJECT);
}
