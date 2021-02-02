import { HasuraService } from "./hasura.service";
import { Test, TestingModule } from "@nestjs/testing";
import { HasuraModule } from "./hasura.module";
import nock from "nock";
import {
  GrapQLClientOptions,
  HasuraModuleOptions,
  HasuraOptionsFactory,
  mergeGraphqlClientOptions,
} from "./hasura.module-options";
import { GraphQLClient } from "graphql-request";
import { getSdk } from "./__fixtures__/sdk";
import { HasuraCodegenService } from "./hasura-codegen.service";
import { mockIntrospectionQuery } from "./__fixtures__/mock-server";
import rimraf from "rimraf";
import * as path from "path";
import { getSdk as mockGetSdk } from "./__fixtures__/sdk";
import { HasuraInjectionToken } from "./hasura.tokens";

describe("HasuraModule", () => {
  function testModuleDependencies(testingModule: TestingModule) {
    expect(testingModule).toBeDefined();

    const moduleOptions = testingModule.get<HasuraModuleOptions>(
      HasuraInjectionToken.ModuleOptions
    );
    expect(moduleOptions).toBeDefined();

    const grapQLClientOptions = testingModule.get<GrapQLClientOptions>(
      HasuraInjectionToken.GraphQLClientOptions
    );
    expect(grapQLClientOptions).toBeDefined();

    const graphQLClient = testingModule.get<GraphQLClient>(
      HasuraInjectionToken.GraphQLClient
    );
    expect(graphQLClient).toBeDefined();

    const hasuraSdkOptions = testingModule.get<unknown>(
      HasuraInjectionToken.SdkOptions
    );
    expect(hasuraSdkOptions).toBeDefined();

    const hasuraSdk = testingModule.get<unknown>(HasuraInjectionToken.Sdk);
    expect(hasuraSdk).toBeDefined();

    const hasuraCodegenService = testingModule.get<HasuraCodegenService>(
      HasuraCodegenService
    );
    expect(hasuraCodegenService).toBeDefined();
  }

  describe("register", () => {
    it("registers the module synchronously", async () => {
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

  describe("registerAsync", () => {
    it("registers the module with a class provider", async () => {
      class OptionsFactory implements HasuraOptionsFactory {
        async createHausraOptions(): Promise<HasuraModuleOptions> {
          async function stub() {
            return new Promise<void>((resolve) => {
              process.nextTick(() => {
                resolve();
              });
            });
          }

          await stub();

          return {
            hostname: "localhost",
            port: 8080,
            scheme: "http",
            adminSecret: "test",
          };
        }
      }

      const testingModule = await Test.createTestingModule({
        imports: [HasuraModule.registerAsync({ useClass: OptionsFactory })],
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
