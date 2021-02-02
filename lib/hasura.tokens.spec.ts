import { buildInjectToken } from "./hasura.tokens";

describe("Tokens", () => {
  describe("buildInjectToken", () => {
    it("returns the base string when no suffixes are given", () => {
      const token = buildInjectToken("test");

      expect(token).toBe("test");
    });

    it("returns a joined token when suffixes are provided", () => {
      const token = buildInjectToken("test", "a", "b", "c");

      expect(token).toBe("test:A_B_C");
    });
  });
});
