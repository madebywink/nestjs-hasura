import { Inject } from "@nestjs/common";
import { HasuraInjectionToken } from "../hasura.tokens";

/**
 * Inject the GraphQL Request Client instance
 */
export function InjectHasuraGraphQLClient(): ParameterDecorator {
  return Inject(HasuraInjectionToken.GraphQLClient);
}
