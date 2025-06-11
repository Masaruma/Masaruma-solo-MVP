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
  it("タイトル", () => {
    const headerText = screen.getByText("神経衰弱");

    expect(headerText).toBeInTheDocument();
  });

  it("GameMode⇨ゲームレベル⇨カードの枚数選択画面⇨スタートとランキングが出現する", async () => {
    await userEvent.click(screen.getByRole("button", { name: "シングル" }));
    await userEvent.click(screen.getByRole("button", { name: "irasutoya" }));
    await userEvent.click(screen.getByRole("button", { name: "優しい" }));
    await userEvent.click(screen.getByRole("button", { name: "6" }));

    expect(
      screen.getByRole("button", { name: "ゲームスタート" })
    ).toBeInTheDocument();
  });

  it("tabListをクリックするとタブを行き来でき、全ての項目を選択しないと確認タブへ到達できない。", async () => {
    const tablist = screen.getByRole("tablist");
    const tabChildren = Array.from(tablist.children);

    await userEvent.click(tabChildren[0]);
    expect(tabChildren[0]).toHaveAttribute("aria-selected", "true");

    await userEvent.click(tabChildren[1]);
    expect(tabChildren[1]).toHaveAttribute("aria-selected", "true");

    await userEvent.click(tabChildren[2]);
    expect(tabChildren[2]).toHaveAttribute("aria-selected", "true");

    expect(tabChildren[3]).toHaveAttribute("aria-selected", "false");
    await userEvent.click(screen.getByRole("button", { name: "シングル" }));
    await userEvent.click(screen.getByRole("button", { name: "6" }));
    await userEvent.click(tabChildren[3]);

    expect(tabChildren[3]).toHaveAttribute("aria-selected", "true");
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

    await userEvent.click(screen.getByRole("button", { name: "シングル" }));
    await userEvent.click(screen.getByRole("button", { name: "irasutoya" }));
    await userEvent.click(screen.getByRole("button", { name: "優しい" }));
    await userEvent.click(screen.getByRole("button", { name: "12" }));
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
