import "reflect-metadata";
import { Test } from "./__fixtures__/hasura-action-handler.fixtures";
import { HasuraInjectionToken } from "../hasura.tokens";

describe("@HasuraActionHandler", () => {
  it("decorates class methods as action handlers", () => {
    const metadata = Reflect.getMetadata(
      HasuraInjectionToken.ActionHandler,
      Test.handleAction
    );

    expect(metadata).toEqual({ action: "action", method: "GET" });
  });
});
