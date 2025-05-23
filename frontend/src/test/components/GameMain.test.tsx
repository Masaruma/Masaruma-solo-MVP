import { useState } from "react";

import { act, render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { afterEach, beforeEach, expect } from "vitest";

import { GameMain, GameMainProps } from "@/components/GameMain.tsx";
import { ProtectedRoute } from "@/Layout/ProtectedRoute.tsx";

vi.mock("@/hooks/useInitializeGame", () => {
  return {
    useInitializeGame: () => {
      const defaultCards = [
        { id: 1, img: null, idx: 0, isMatched: false },
        { id: 2, img: null, idx: 1, isMatched: false },
        { id: 1, img: null, idx: 2, isMatched: false },
        { id: 2, img: null, idx: 3, isMatched: false },
      ];
      const [cards, setCards] = useState(defaultCards);
      const initializeGame = async () => {};
      return { cards, initializeGame, setCards };
    },
  };
});

const GameMain__test = ({
  state = { cardRowsCols: [3, 4], gameMode: "irasutoya" },
}: {
  state?: GameMainProps;
}) => {
  return (
    <MemoryRouter initialEntries={[{ pathname: "/nervousbreakdown", state }]}>
      <GameMain />
    </MemoryRouter>
  );
};

describe(`${GameMain.name}`, () => {
  beforeEach(() => {
    vi.useFakeTimers({
      shouldAdvanceTime: true,
    });
  });
  afterEach(() => {
    vi.useRealTimers();
  });
  it("stateがない場合何も表示されない", () => {
    render(
      <MemoryRouter initialEntries={[{ pathname: "/nervousbreakdown" }]}>
        <ProtectedRoute>
          <GameMain />
        </ProtectedRoute>
      </MemoryRouter>
    );

    expect(
      screen.queryByLabelText("神経衰弱のカードエリア")
    ).not.toBeInTheDocument();
  });

  it("カードが表になると表のクラスを持つ", async () => {
    render(<GameMain__test />);
    const cardArea = screen.getByLabelText("神経衰弱のカードエリア");
    const firstCardComponet = cardArea.children[0];

    await userEvent.click(cardArea.children[0]);

    expect(firstCardComponet.children[0]).toHaveClass("front");
  });
  it("カードが裏になると裏のクラスを持つ", () => {
    render(<GameMain__test />);
    const cardArea = screen.getByLabelText("神経衰弱のカードエリア");

    const firstCardComponet = cardArea.children[0];
    expect(firstCardComponet.children[0]).toHaveClass("back");
  });
  it("2枚表にし、失敗した場合カードは表から裏になる。", async () => {
    render(<GameMain__test />);
    const cardArea = screen.getByLabelText("神経衰弱のカードエリア");

    const firstCardComponet = cardArea.children[0];
    const secondCardComponet = cardArea.children[1];
    await userEvent.click(firstCardComponet);
    await userEvent.click(secondCardComponet);
    expect(firstCardComponet.children[0]).toHaveClass("front");
    expect(secondCardComponet.children[0]).toHaveClass("front");

    act(() => {
      vi.advanceTimersByTime(800);
    });

    expect(firstCardComponet.children[0]).toHaveClass("back");
    expect(secondCardComponet.children[0]).toHaveClass("back");
  });

  it("2枚表にし、成功した場合カードは表のままになる。", async () => {
    render(<GameMain__test />);
    const cardArea = screen.getByLabelText("神経衰弱のカードエリア");

    const firstCardComponent = cardArea.children[0];
    const thirdCardComponent = cardArea.children[2];

    await userEvent.click(firstCardComponent);
    await userEvent.click(thirdCardComponent);

    act(() => {
      vi.advanceTimersByTime(800);
    });

    expect(firstCardComponent.children[0]).toHaveClass("front");
    expect(thirdCardComponent.children[0]).toHaveClass("front");
  });
  describe("バグ挙動予防", () => {
    it("クリックして表になっているカードをクリックしても何も起きない", async () => {
      render(<GameMain__test />);
      const cardArea = screen.getByLabelText("神経衰弱のカードエリア");
      const firstCardComponent = cardArea.children[0];
      const thirdCardComponent = cardArea.children[2];

      await userEvent.click(firstCardComponent);
      await userEvent.click(firstCardComponent);
      act(() => {
        vi.advanceTimersByTime(800);
      });
      // アンチパターン 1枚目クリック1枚目クリック すると1枚目も3枚目も表に
      // 良いパターン 1枚目クリック1枚目クリック すると1枚目だけ表
      expect(firstCardComponent.children[0]).toHaveClass("front");
      expect(thirdCardComponent.children[0]).toHaveClass("back");
    });

    it("マッチして表になっているカードをクリックしても何も起きない", async () => {
      render(<GameMain__test />);
      const cardArea = screen.getByLabelText("神経衰弱のカードエリア");
      const firstCardComponent = cardArea.children[0];
      const secondCardComponent = cardArea.children[1];
      const thirdCardComponent = cardArea.children[2];

      await userEvent.click(firstCardComponent);
      await userEvent.click(thirdCardComponent);
      act(() => {
        vi.advanceTimersByTime(800);
      });

      await userEvent.click(firstCardComponent);
      await userEvent.click(secondCardComponent);
      act(() => {
        vi.advanceTimersByTime(800);
      });
      expect(secondCardComponent.children[0]).toHaveClass("front");
    });
  });

  it("全て表にするとゲームクリアになる", async () => {
    const alertSpy = vi.spyOn(window, "alert").mockImplementation(() => {});
    render(<GameMain__test />);
    const cardArea = screen.getByLabelText("神経衰弱のカードエリア");

    const firstCardComponet = cardArea.children[0];
    const secondCardComponet = cardArea.children[1];
    const thirdCardComponet = cardArea.children[2];
    const fourthCardComponet = cardArea.children[3];

    await userEvent.click(firstCardComponet);
    await userEvent.click(thirdCardComponet);

    act(() => {
      vi.advanceTimersByTime(800);
    });

    await userEvent.click(secondCardComponet);
    await userEvent.click(fourthCardComponet);

    act(() => {
      vi.advanceTimersByTime(800);
    });
    expect(alertSpy).toHaveBeenCalledWith("ゲームクリア");
  });
});
