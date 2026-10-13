import React from "react";
import ReactDOM from "react-dom";
import { act } from "react-dom/test-utils";
import App from "./App";
import { initializeChain } from "./common/utils";

jest.mock("./common/utils", () => ({
  ...jest.requireActual("./common/utils"),
  initializeChain: jest.fn(),
}));

const mockedChain = initializeChain as jest.MockedFunction<typeof initializeChain>;

let container: HTMLDivElement;

beforeEach(() => {
  container = document.createElement("div");
  document.body.appendChild(container);
});

afterEach(() => {
  ReactDOM.unmountComponentAtNode(container);
  container.remove();
  mockedChain.mockReset();
});

function start(chain: number[]) {
  mockedChain.mockReturnValue(chain);
  act(() => {
    ReactDOM.render(<App />, container);
  });
}

const links = () => Array.from(container.querySelectorAll<HTMLButtonElement>(".btn-dark"));
const chainValues = () => links().map((b) => Number(b.textContent));
const scores = () =>
  Array.from(container.querySelectorAll(".btn-primary")).map((b) =>
    Number(/Player \d: (-?\d+)/.exec(b.textContent ?? "")![1]),
  );
const click = (el: Element) =>
  act(() => {
    el.dispatchEvent(new MouseEvent("click", { bubbles: true }));
  });
const takeFirst = () => click(links()[0]);
const takeLast = () => click(links()[links().length - 1]);

describe("Links game", () => {
  it("renders the starting chain with zero scores", () => {
    start([3, 10, -2, 7]);
    expect(chainValues()).toEqual([3, 10, -2, 7]);
    expect(scores()).toEqual([0, 0]);
  });

  it("alternates turns and credits the taken end link", () => {
    start([3, 10, -2, 7]);
    takeFirst(); // P1 +3
    expect(scores()).toEqual([3, 0]);
    expect(chainValues()).toEqual([10, -2, 7]);
    takeLast(); // P2 +7
    expect(scores()).toEqual([3, 7]);
    expect(chainValues()).toEqual([10, -2]);
  });

  it("ignores clicks on links in the middle of the chain", () => {
    start([3, 10, -2, 7]);
    click(links()[1]);
    click(links()[2]);
    expect(scores()).toEqual([0, 0]);
    expect(chainValues()).toEqual([3, 10, -2, 7]);
    takeFirst(); // still player 1's turn
    expect(scores()).toEqual([3, 0]);
  });

  it("declares Player 1 the winner and restarts on Play Again", () => {
    start([3, 10, -2, 7]);
    takeFirst(); // P1 3
    takeLast(); // P2 7
    takeFirst(); // P1 13
    takeFirst(); // P2 5
    expect(links()).toHaveLength(0);
    expect(container.textContent).toContain("Player 1 Wins!");

    mockedChain.mockReturnValue([1, 2, 3, 4, 5]);
    const again = Array.from(container.querySelectorAll("button")).find((b) => b.textContent === "Play Again?")!;
    click(again);
    expect(scores()).toEqual([0, 0]);
    expect(chainValues()).toEqual([1, 2, 3, 4, 5]);
    takeLast(); // turn order resets to player 1
    expect(scores()).toEqual([5, 0]);
  });

  it("declares Player 2 the winner, including with negative links", () => {
    start([-5, 1]);
    takeFirst(); // P1 -5
    takeFirst(); // P2 1
    expect(scores()).toEqual([-5, 1]);
    expect(container.textContent).toContain("Player 2 Wins!");
  });

  it("reports a tie", () => {
    start([4, 4]);
    takeLast();
    takeLast();
    expect(container.textContent).toContain("It's a tie!");
  });
});
