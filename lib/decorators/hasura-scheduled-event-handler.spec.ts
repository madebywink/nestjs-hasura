import "reflect-metadata";
import { Test } from "./__fixtures__/hasura-scheduled-event-handler.fixtures";
import { HasuraInjectionToken } from "../hasura.tokens";

describe("@HasuraScheduledEventHandler", () => {
  it("decorates class methods as scheduled event handlers", () => {
    const metadata = Reflect.getMetadata(
      HasuraInjectionToken.ScheduledEventHandler,
      Test.handleEvent
    );

    expect(metadata).toEqual({ trigger: "s" });
  });
});
