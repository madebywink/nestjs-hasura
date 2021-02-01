import { Inject } from "@nestjs/common";
import { HASURA_GRAPHQL_CLIENT_INJECT } from "../hasura.tokens";

/**
 * Inject the GraphQL Request Client instance
 */
export function InjectHasuraGraphQLClient(): ParameterDecorator {
  return Inject(HASURA_GRAPHQL_CLIENT_INJECT);
}
