import { initializeChain, randomIntInRange } from "./utils";
import { MAX_LINKS, MAX_LINK_VAL, MIN_LINKS, MIN_LINK_VAL } from "./constants";

afterEach(() => {
  jest.restoreAllMocks();
});

describe("randomIntInRange", () => {
  it("hits both inclusive bounds", () => {
    jest.spyOn(Math, "random").mockReturnValue(0);
    expect(randomIntInRange(-3, 3)).toBe(-3);
    (Math.random as jest.Mock).mockReturnValue(0.999999);
    expect(randomIntInRange(-3, 3)).toBe(3);
  });

  it("always returns an integer inside the range", () => {
    for (let i = 0; i < 1000; i++) {
      const n = randomIntInRange(5, 9);
      expect(Number.isInteger(n)).toBe(true);
      expect(n).toBeGreaterThanOrEqual(5);
      expect(n).toBeLessThanOrEqual(9);
    }
  });
});

describe("initializeChain", () => {
  it("builds a chain within the configured length and value limits", () => {
    for (let i = 0; i < 50; i++) {
      const chain = initializeChain();
      expect(chain.length).toBeGreaterThanOrEqual(MIN_LINKS);
      expect(chain.length).toBeLessThanOrEqual(MAX_LINKS);
      for (const v of chain) {
        expect(Number.isInteger(v)).toBe(true);
        expect(v).toBeGreaterThanOrEqual(MIN_LINK_VAL);
        expect(v).toBeLessThanOrEqual(MAX_LINK_VAL);
      }
    }
  });

  it("uses the minimum length when random is 0", () => {
    jest.spyOn(Math, "random").mockReturnValue(0);
    expect(initializeChain()).toEqual(Array(MIN_LINKS).fill(MIN_LINK_VAL));
  });
});
