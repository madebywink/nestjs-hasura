import { mergeGraphqlClientOptions } from "./hasura.module-options";

describe("HasuraModuleOptions", () => {
  describe("mergeGraphqlClientOptions", () => {
    it("constructs base graphql client options from module options", () => {
      const moduleOptions = {
        adminSecret: "test",
      };

      const graphQLOptions = mergeGraphqlClientOptions(moduleOptions);

      expect(graphQLOptions).toEqual({
        headers: {
          "x-hasura-admin-secret": "test",
        },
      });
    });
  });
});
