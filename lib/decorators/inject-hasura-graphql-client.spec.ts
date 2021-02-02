import "reflect-metadata";
import { Test } from "./__fixtures__/inject-hasura-graphql-client.fixtures";
import { SELF_DECLARED_DEPS_METADATA } from "@nestjs/common/constants";
import { HasuraInjectionToken } from "../hasura.tokens";

describe("@InjectHasuraGraphQLClient", () => {
  it("should enhance class with expected constructor params metadata", () => {
    const metadata = Reflect.getMetadata(SELF_DECLARED_DEPS_METADATA, Test);

    expect(metadata).toEqual([
      { index: 0, param: HasuraInjectionToken.GraphQLClient },
    ]);
  });
});
