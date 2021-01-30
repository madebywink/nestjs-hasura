import { Test, TestingModule } from "@nestjs/testing";
import { HasuraCodegenService } from "./hasura-codegen.service";
import { HasuraModuleOptions } from "./hasura.module-options";
import { HASURA_MODULE_OPTIONS_INJECT } from "./hasura.tokens";
import * as path from "path";
import nock from "nock";
import { mockIntrospectionQuery } from "./__fixtures__/mock-server";
import * as fs from "fs/promises";
import rimraf from "rimraf";

describe("HasuraCodegenService", () => {
  let hasuraCodegenService: HasuraCodegenService;

  const baseModuleOptions: HasuraModuleOptions = {
    hostname: "localhost",
    adminSecret: "",
    port: 8080,
    scheme: "http",
  };

  async function setupTestingModule(
    moduleOptions: Partial<HasuraModuleOptions> = baseModuleOptions
  ): Promise<TestingModule> {
    return Test.createTestingModule({
      providers: [
        {
          provide: HASURA_MODULE_OPTIONS_INJECT,
          useValue: moduleOptions,
        },
        HasuraCodegenService,
      ],
    }).compile();
  }

  beforeAll(async () => {
    const module = await setupTestingModule();

    hasuraCodegenService = module.get<HasuraCodegenService>(
      HasuraCodegenService
    );
  });

  it("should be defined", () => {
    expect(hasuraCodegenService).toBeDefined();
  });

  describe("generatedFile", () => {
    it("returns a filename based on the default output when none is provided in module config", async () => {
      const module = await setupTestingModule();
      const service = module.get<HasuraCodegenService>(HasuraCodegenService);

      expect(service.generatedFile()).toBe(
        path.join(__dirname, "hasura-codegen/graphql.ts")
      );
    });

    it("returns a filename based on module configuration when given", async () => {
      const module = await setupTestingModule({
        ...baseModuleOptions,
        sdkOptions: { codegen: { outputDir: "alternative-output" } },
      });
      const service = module.get<HasuraCodegenService>(HasuraCodegenService);

      expect(service.generatedFile()).toBe(
        path.join(__dirname, "alternative-output/graphql.ts")
      );
    });
  });

  describe("buildDocumentsGlob", () => {
    it("returns a default glob when none is provided", async () => {
      const module = await setupTestingModule();
      const service = module.get<HasuraCodegenService>(HasuraCodegenService);

      expect(service.buildDocumentsGlob()).toBe(`${__dirname}/**/*.graphql`);
    });
  });

  describe("graphqlCodegen", () => {
    const outputDir = "codegen-tmp";

    afterAll(() => {
      rimraf.sync(path.resolve(__dirname, outputDir));
    });

    it("generates a graphql-codegen file given a module configuration", async () => {
      let module: TestingModule;
      let service: HasuraCodegenService;

      module = await setupTestingModule({
        ...baseModuleOptions,
        sdkOptions: { codegen: { outputDir } },
      });
      service = module.get<HasuraCodegenService>(HasuraCodegenService);

      const mockIntrospection = await mockIntrospectionQuery();

      nock("http://localhost:8080").post("/v1/graphql").reply(200, {
        data: mockIntrospection,
      });

      try {
        await service.graphqlCodegen();

        const test = fs.access(
          path.resolve(__dirname, outputDir, "graphql.ts")
        );

        await expect(test).resolves.not.toThrow();
      } catch (e) {
        console.error(e);
        throw e;
      }
    });
  });
});
