import { act, render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { createMemoryHistory } from "history";
import { MemoryRouter, Router } from "react-router-dom";
import { beforeEach, expect } from "vitest";

import { StartPage } from "@/pages/StartPage.tsx";

vi.mock("@/repository/GameScoreRepository.ts");

vi.mock("@/components/Ranking.tsx", () => {
  return {
    Ranking: vi.fn(() => <div data-testid={"mock-ranking"} />),
  };
});
describe("NervousBreakdownのテスト", () => {
  beforeEach(async () => {
    await act(async () => {
      render(
        <MemoryRouter initialEntries={[{ pathname: "/" }]}>
          <StartPage />
        </MemoryRouter>
      );
    });
  });
  it("vitestが動いてるかテスト", () => {
    const headerText = screen.getByText("モードを選択してください");

    expect(headerText).toBeInTheDocument();
  });

  it("GameModeを選択するとカードの枚数選択画面が出現する", async () => {
    const gameModeButton = screen.getByRole("button", { name: "irasutoya" });

    await userEvent.click(gameModeButton);
    const selectNumberOfCards = screen.getByLabelText("カードの枚数を選択");

    expect(selectNumberOfCards).toBeInTheDocument();
  });

  it("ゲーム開始前はゲームスタートボタンとランキングが表示されない", () => {
    const startButton = screen.queryByRole("button", {
      name: "ゲームスタート",
    });
    const ranking = screen.queryByTestId("mock-ranking");
    expect(startButton).not.toBeInTheDocument();
    expect(ranking).not.toBeInTheDocument();
  });

  it("カードの枚数を選択するとゲームスタートボタンとランキングが出現する", async () => {
    const gameModeButton = screen.getByRole("button", { name: "irasutoya" });
    await userEvent.click(gameModeButton);
    const cardSixButton = screen.getByRole("button", { name: "6枚" });

    await userEvent.click(cardSixButton);
    const startButton = screen.getByRole("button", { name: "ゲームスタート" });

    expect(startButton).toBeInTheDocument();
  });
});

describe("ルーティング関連", () => {
  it("ゲームスタートボタンを押すと必要な'state'をもちゲームページへのnavigationが行われる", async () => {
    const history = createMemoryHistory({ initialEntries: ["/"] });

    render(
      <Router location={history.location} navigator={history}>
        <StartPage />
      </Router>
    );
    const modeButton = screen.getByRole("button", { name: "irasutoya" });
    await userEvent.click(modeButton);

    await userEvent.click(screen.getByRole("button", { name: "12枚" }));

    await userEvent.click(
      screen.getByRole("button", { name: "ゲームスタート" })
    );

    expect(history.location.pathname).toBe("/nervousbreakdown");
    // toBeはstrictEqual
    expect(history.location.state).toEqual({
      gameMode: "irasutoya",
      selectedNumberOfCard: 12,
    });
  });
});
