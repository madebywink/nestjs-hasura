import "reflect-metadata";
import { Test } from "./__fixtures__/hasura-action-handler.fixtures";
import { HASURA_ACTION_HANDLER } from "../hasura.tokens";

describe("@HasuraActionHandler", () => {
  it("decorates class methods as action handlers", () => {
    const metadata = Reflect.getMetadata(
      HASURA_ACTION_HANDLER,
      Test.handleAction
    );

    expect(metadata).toEqual({ action: "action", method: "GET" });
  });
});
