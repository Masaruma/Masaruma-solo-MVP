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

  it("GameMode⇨ゲームレベル⇨カードの枚数選択画面⇨スタートとランキングが出現する", async () => {
    const gameModeButton = screen.getByRole("button", { name: "irasutoya" });
    await userEvent.click(gameModeButton);

    const selectGameLevel = screen.getByLabelText("ゲームの難易度を選択");
    expect(selectGameLevel).toBeInTheDocument();
    await userEvent.click(screen.getByRole("button", { name: "優しい" }));

    const selectNumberOfCards = screen.getByLabelText("カードの枚数を選択");

    expect(selectNumberOfCards).toBeInTheDocument();

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
    await userEvent.click(screen.getByRole("button", { name: "優しい" }));

    await userEvent.click(screen.getByRole("button", { name: "12枚" }));

    await userEvent.click(
      screen.getByRole("button", { name: "ゲームスタート" })
    );

    expect(history.location.pathname).toBe("/nervousbreakdown");
    expect(history.location.state).toEqual({
      gameLevel: 1,
      gameMode: "irasutoya",
      selectedNumberOfCard: 12,
    });
  });
});
