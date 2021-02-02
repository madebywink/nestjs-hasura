import { Inject } from "@nestjs/common";
import { HasuraInjectionToken } from "../hasura.tokens";

/**
 * Inject the GraphQL Request Client instance options.
 */
export function InjectHasuraGraphQLClientOptions(): ParameterDecorator {
  return Inject(HasuraInjectionToken.GraphQLClientOptions);
}
