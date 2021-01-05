import { GraphQLClient } from "graphql-request";

export type HasuraSdkRequestMiddleware = <T>(
  action: () => Promise<T>
) => Promise<T>;

export type GetSdk = (client: GraphQLClient) => unknown;
