import { HasuraService } from "./hasura.service";
import { Test } from "@nestjs/testing";
import { DEFAULT_HASURA_ADMIN_SECRET_HEADER } from "./defaults/hasura.module-options.defaults";
import { HasuraApi } from "./hasura.types";
import {
  DEFAULT_ACTIONS_HANDLER_PATH,
  DEFAULT_EVENTS_HANDLER_PATH,
  DEFAULT_HASURA_PATH,
} from "./hasura.constants";
import { HasuraModuleOptions } from "./hasura.module-options";
import * as path from "path";

describe("HasuraService", () => {
  let hasuraService: HasuraService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [HasuraService],
    }).compile();

    hasuraService = module.get<HasuraService>(HasuraService);
  });

  describe("hasuraAdminSecretHeader", () => {
    it("should return provided admin secret header when given in module config", () => {
      const testHeader = "x";

      expect(
        HasuraService.hasuraAdminSecretHeader({ adminSecretHeader: testHeader })
      ).toBe(testHeader);
    });

    it("should return the default admin secret header when none is provided in module config", () => {
      expect(HasuraService.hasuraAdminSecretHeader({})).toBe(
        DEFAULT_HASURA_ADMIN_SECRET_HEADER
      );
    });
  });

  describe("hasuraBaseUrl", () => {
    it("should return a url string for the Hasura base url, given module configuration values", () => {
      const hostname = "test.hasura.app";

      expect(HasuraService.hasuraBaseUrl({ scheme: "https", hostname })).toBe(
        "https://test.hasura.app/"
      );
      expect(HasuraService.hasuraBaseUrl({ scheme: "http", hostname })).toBe(
        "http://test.hasura.app/"
      );
    });
  });

  describe("hasuraGraphqlUrl", () => {
    it("should return a url string for the hasura graphql endpoint", () => {
      const hostname = "test.hasura.app";

      expect(
        HasuraService.hasuraGraphqlUrl({ hostname, scheme: "https" })
      ).toBe(`https://${hostname}${HasuraApi.GraphQL}`);

      expect(HasuraService.hasuraGraphqlUrl({ hostname, scheme: "http" })).toBe(
        `http://${hostname}${HasuraApi.GraphQL}`
      );

      expect(
        HasuraService.hasuraGraphqlUrl({
          hostname: "localhost",
          scheme: "http",
          port: 8000,
        })
      ).toBe("http://localhost:8000/v1/graphql");
    });

    it("should throw if localhost is provided as hostname without a port", () => {
      expect(() =>
        HasuraService.hasuraGraphqlUrl({ hostname: "localhost" })
      ).toThrow();
    });
  });

  describe("actionsPath", () => {
    it("should return the action handler path based on module configuration", () => {
      expect(HasuraService.actionsPath()).toBe(DEFAULT_ACTIONS_HANDLER_PATH);
    });
  });

  describe("hasuraPath", () => {
    it("should return the action handler path based on module configuration", () => {
      expect(HasuraService.hasuraPath()).toBe(DEFAULT_HASURA_PATH);
    });
  });

  describe("splitPath", () => {
    it("returns relevant parts of request path as array", () => {
      expect(HasuraService.splitPath(DEFAULT_HASURA_PATH)).toEqual(["hasura"]);
    });
  });

  describe("isHasuraPath", () => {
    it("returns true for split hasura request paths", () => {
      expect(HasuraService.isHasuraPath(["hasura", "events"])).toBe(true);
      expect(HasuraService.isHasuraPath(["hasura", "actions"])).toBe(true);
      expect(HasuraService.isHasuraPath(["hasura"])).toBe(true);
    });

    it("returns false for non hasura paths", () => {
      expect(HasuraService.isHasuraPath([`${"hasura"}x`])).toBe(false);
    });
  });

  describe("eventsPath", () => {
    it("returns the configured hasura events request path", () => {
      expect(HasuraService.eventsPath()).toBe(DEFAULT_EVENTS_HANDLER_PATH);
    });
  });

  describe("isActionsPath", () => {
    it("returns true for hasura actions paths", () => {
      expect(HasuraService.isActionsPath("/hasura/actions")).toBe(true);
      expect(HasuraService.isActionsPath("/hasura/actions/example")).toBe(true);
      expect(HasuraService.isActionsPath("/hasura/actions/")).toBe(true);
    });

    it("returns false for non hasura actions paths", () => {
      expect(HasuraService.isActionsPath("/hasura/events")).toBe(false);
    });
  });

  describe("isEventsPath", () => {
    it("returns true for hasura events paths", () => {
      expect(HasuraService.isEventsPath("/hasura/events")).toBe(true);
      expect(HasuraService.isEventsPath("/hasura/events/example")).toBe(true);
      expect(HasuraService.isEventsPath("/hasura/events/")).toBe(true);
    });

    it("returns false for non hasura actions paths", () => {
      expect(HasuraService.isEventsPath("/hasura/actions")).toBe(false);
    });
  });

  describe("hasuraInstanceOptionsValidForRootRegistration", () => {
    it("returns false if module configuration does not specify sdk file path", () => {
      const noSdkOptions: Partial<HasuraModuleOptions> = {};
      const noCodgenOptions: Partial<HasuraModuleOptions> = { sdkOptions: {} };
      const noPathOptions: Partial<HasuraModuleOptions> = {
        sdkOptions: { codegen: {} },
      };

      expect(
        HasuraService.hasuraInstanceOptionsValidForRootRegistration(
          noSdkOptions
        )
      ).resolves.toBe(false);
      expect(
        HasuraService.hasuraInstanceOptionsValidForRootRegistration(
          noCodgenOptions
        )
      ).resolves.toBe(false);
      expect(
        HasuraService.hasuraInstanceOptionsValidForRootRegistration(
          noPathOptions
        )
      ).resolves.toBe(false);
    });

    it("returns false when a sdk path is provided but cannot be accessed", () => {
      expect(
        HasuraService.hasuraInstanceOptionsValidForRootRegistration({
          sdkOptions: {
            codegen: {
              sdkPath: path.resolve(__dirname, "test", "nofile.ts"),
            },
          },
        })
      ).resolves.toBe(false);
    });

    it("returns true when a sdk path is provided and can be accessed", () => {
      expect(
        HasuraService.hasuraInstanceOptionsValidForRootRegistration({
          sdkOptions: {
            codegen: {
              sdkPath: path.resolve(__dirname, "test", "sdk.ts"),
            },
          },
        })
      ).resolves.toBe(false);
    });
  });
});
