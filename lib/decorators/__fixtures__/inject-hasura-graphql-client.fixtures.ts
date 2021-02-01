import { GraphQLClient } from "graphql-request";
import { InjectHasuraGraphQLClient } from "../inject-hasura-graphql-client.decorator";

export class Test {
  constructor(@InjectHasuraGraphQLClient() client: GraphQLClient) {}
}
