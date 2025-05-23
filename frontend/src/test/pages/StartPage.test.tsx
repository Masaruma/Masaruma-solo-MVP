import { act, render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
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
      render(<StartPage />);
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
