import { GraphQLClient } from "graphql-request";

/**
 * Mock the typing of middleware function passted to the getSdk function generated by `@graphql-codegen/cli`
 */
export type HasuraSdkRequestMiddleware = <T>(
  action: () => Promise<T>
) => Promise<T>;

/**
 * Mock the typing of the getSdk function generated by `@graphql-codegen/cli`
 */
export type GetSdk = (client: GraphQLClient) => unknown;
