import { HasuraService } from "./hasura.service";
import { Test } from "@nestjs/testing";
import { DEFAULT_HASURA_ADMIN_SECRET_HEADER } from "./defaults/hasura.module-options.defaults";
import { HasuraApi } from "./hasura.types";
import {
  DEFAULT_ACTIONS_HANDLER_PATH,
  DEFAULT_EVENTS_HANDLER_PATH,
  DEFAULT_HASURA_PATH,
} from "./hasura.constants";

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
});
