import { HasuraService } from "./hasura.service";
import { Test, TestingModule } from "@nestjs/testing";
import { HasuraModule } from "./hasura.module";
import nock from "nock";
import {
  GrapQLClientOptions,
  HasuraModuleOptions,
  mergeGraphqlClientOptions,
} from "./hasura.module-options";
import { GraphQLClient } from "graphql-request";
import { getSdk } from "./__fixtures__/sdk";
import { HasuraCodegenService } from "./hasura-codegen.service";
import { mockIntrospectionQuery } from "./__fixtures__/mock-server";
import rimraf from "rimraf";
import * as path from "path";
import { getSdk as mockGetSdk } from "./__fixtures__/sdk";
import {
  HASURA_GRAPHQL_CLIENT_INJECT,
  HASURA_GRAPHQL_CLIENT_OPTIONS_INJECT,
  HASURA_MODULE_OPTIONS_INJECT,
  HASURA_SDK_INJECT,
} from "./hasura.tokens";

describe("HasuraModule", () => {
  function testModuleDependencies(testingModule: TestingModule) {
    expect(testingModule).toBeDefined();

    const moduleOptions = testingModule.get<HasuraModuleOptions>(
      HASURA_MODULE_OPTIONS_INJECT
    );
    expect(moduleOptions).toBeDefined();

    const grapQLClientOptions = testingModule.get<GrapQLClientOptions>(
      HASURA_GRAPHQL_CLIENT_OPTIONS_INJECT
    );
    expect(grapQLClientOptions).toBeDefined();

    const hasuraSdkOptions = testingModule.get<GraphQLClient>(
      HASURA_GRAPHQL_CLIENT_INJECT
    );
    expect(hasuraSdkOptions).toBeDefined();

    const hasuraSdk = testingModule.get<unknown>(HASURA_SDK_INJECT);
    expect(hasuraSdk).toBeDefined();
  }

  describe("register", () => {
    it("succesfully sync registers the module", async () => {
      const options: HasuraModuleOptions = {
        hostname: "localhost",
        scheme: "http",
        adminSecret: "secret",
        port: 8080,
      };

      const testingModule = await Test.createTestingModule({
        imports: [HasuraModule.register(options, mockGetSdk)],
      }).compile();

      testModuleDependencies(testingModule);
    });
  });

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
