import { HasuraService } from "./hasura.service";
import { HasuraModule } from "./hasura.module";
import nock from "nock";
import {
  HasuraModuleOptions,
  mergeGraphqlClientOptions,
} from "./hasura.module-options";
import { GraphQLClient } from "graphql-request";
import { getSdk } from "./__fixtures__/sdk";
import { HasuraCodegenService } from "./hasura-codegen.service";
import { mockIntrospectionQuery } from "./__fixtures__/mock-server";
import rimraf from "rimraf";
import * as path from "path";

describe("HasuraModule", () => {
  describe("getHasuraSdk", () => {
    let baseOptions: HasuraModuleOptions = {
      hostname: "localhost",
      adminSecret: "adminsecret",
      port: 8080,
      scheme: "http",
    };

    const graphQLClient = new GraphQLClient(
      HasuraService.hasuraGraphqlUrl(baseOptions),
      mergeGraphqlClientOptions(baseOptions)
    );

    const codegen = new HasuraCodegenService(baseOptions);

    afterAll(() => {
      rimraf.sync(path.resolve(__dirname, "hasura-codegen"));
    });

    it("uses the provided sdk funciton, if given", async () => {
      const sdk = await HasuraModule.getHasuraSdk(
        baseOptions,
        graphQLClient,
        codegen,
        getSdk
      );

      expect(sdk).toEqual(getSdk(graphQLClient));
    });

    it("uses a generated sdk function when one is not provided", async () => {
      const mockIntrospection = await mockIntrospectionQuery();

      nock("http://localhost:8080").post("/v1/graphql").reply(200, {
        data: mockIntrospection,
      });

      const sdk = await HasuraModule.getHasuraSdk(
        baseOptions,
        graphQLClient,
        codegen
      );

      expect(sdk).toHaveProperty("ListFoos");
    });
  });
});
