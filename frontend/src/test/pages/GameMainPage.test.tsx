import { useState } from "react";

import { act, cleanup, render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { MemoryRouter } from "react-router-dom";
import { afterEach, beforeEach, expect, vi } from "vitest";

import { useGameTimer } from "@/hooks/useGameTimer.ts";
import { ProtectedRoute } from "@/Layout/ProtectedRoute.tsx";
import { GameMainPage, GameMainProps } from "@/pages/GameMainPage.tsx";
import { calcGameSeconds } from "@/utils/calcGameLevel.ts";

const spyInitializeGame = vi.fn();

vi.mock("@/hooks/useInitializeGame", async () => {
  const actual = await vi.importActual<
    typeof import("@/hooks/useInitializeGame")
  >("@/hooks/useInitializeGame");
  return {
    ...actual,
    useInitializeGame: () => {
      const defaultCards = [
        { id: 1, img: null, idx: 0, isMatched: false },
        { id: 2, img: null, idx: 1, isMatched: false },
        { id: 1, img: null, idx: 2, isMatched: false },
        { id: 2, img: null, idx: 3, isMatched: false },
      ];
      const [cards, setCards] = useState(defaultCards);
      const initializeGame = spyInitializeGame;
      return { cards, initializeGame, setCards };
    },
  };
});

const spyStart = vi.fn();
const spyPause = vi.fn();
// useGameTimerモックもdescribe外で
vi.mock("@/hooks/useGameTimer.ts", () => ({
  useGameTimer: vi.fn((...args: any[]) => ({
    milliseconds: 100,
    seconds: 100,
    minutes: 100,
    hours: 1,
    days: args,
    isRunning: false,
    start: spyStart,
    pause: spyPause,
    restart: () => {},
  })),
}));

const initialState: GameMainProps = {
  cardRowsCols: [3, 4],
  gameMode: "irasutoya",
};
const GameMain__test = ({
  state = initialState,
}: {
  state?: GameMainProps;
}) => {
  return (
    <MemoryRouter initialEntries={[{ pathname: "/nervousbreakdown", state }]}>
      <GameMainPage />
    </MemoryRouter>
  );
};

describe(`${GameMainPage.name}`, () => {
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
          <GameMainPage />
        </ProtectedRoute>
      </MemoryRouter>
    );

    expect(
      screen.queryByLabelText("神経衰弱のカードエリア")
    ).not.toBeInTheDocument();
  });

  it("初期レンダー時にinitializeGameが呼ばれている", () => {
    // モックでカードが作れられているからテストが必要
    render(<GameMain__test />);

    expect(spyInitializeGame).toHaveBeenCalledTimes(1);
  });

  it("カードが表になると表のクラスを持つ", async () => {
    render(<GameMain__test />);
    const cardArea = screen.getByLabelText("神経衰弱のカードエリア");
    const firstCardComponet = cardArea.children[0];

    await userEvent.click(cardArea.children[0]);

    expect(firstCardComponet.children[0]).toHaveAttribute(
      "aria-label",
      "表のカード"
    );
  });
  it("カードが裏になると裏のクラスを持つ", () => {
    render(<GameMain__test />);
    const cardArea = screen.getByLabelText("神経衰弱のカードエリア");

    const firstCardComponet = cardArea.children[0];
    expect(firstCardComponet.children[0]).toHaveAttribute(
      "aria-label",
      "裏のカード"
    );
  });
  it("2枚表にし、失敗した場合カードは表から裏になる。", async () => {
    render(<GameMain__test />);
    const cardArea = screen.getByLabelText("神経衰弱のカードエリア");

    const firstCardComponet = cardArea.children[0];
    const secondCardComponet = cardArea.children[1];
    await userEvent.click(firstCardComponet);
    await userEvent.click(secondCardComponet);
    expect(firstCardComponet.children[0]).toHaveAttribute(
      "aria-label",
      "表のカード"
    );
    expect(secondCardComponet.children[0]).toHaveAttribute(
      "aria-label",
      "表のカード"
    );

    act(() => {
      vi.advanceTimersByTime(800);
    });

    expect(firstCardComponet.children[0]).toHaveAttribute(
      "aria-label",
      "裏のカード"
    );
    expect(secondCardComponet.children[0]).toHaveAttribute(
      "aria-label",
      "裏のカード"
    );
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

    expect(firstCardComponent.children[0]).toHaveAttribute(
      "aria-label",
      "表のカード"
    );
    expect(thirdCardComponent.children[0]).toHaveAttribute(
      "aria-label",
      "表のカード"
    );
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
      expect(firstCardComponent.children[0]).toHaveAttribute(
        "aria-label",
        "表のカード"
      );
      expect(thirdCardComponent.children[0]).toHaveAttribute(
        "aria-label",
        "裏のカード"
      );
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
      expect(secondCardComponent.children[0]).toHaveAttribute(
        "aria-label",
        "表のカード"
      );
    });
  });

  it("失敗、成功どちらの場合も手数が増える", async () => {
    render(<GameMain__test />);
    const cardArea = screen.getByLabelText("神経衰弱のカードエリア");
    const scoreNow = screen.getByLabelText("現在の手数");
    expect(scoreNow).toHaveTextContent("0");

    const firstCardComponent = cardArea.children[0];
    const secondCardComponent = cardArea.children[1];
    const thirdCardComponent = cardArea.children[2];
    await userEvent.click(firstCardComponent);
    await userEvent.click(secondCardComponent);
    act(() => {
      vi.advanceTimersByTime(800);
    });
    expect(scoreNow).toHaveTextContent("1");

    await userEvent.click(firstCardComponent);
    await userEvent.click(thirdCardComponent);

    act(() => {
      vi.advanceTimersByTime(800);
    });
    expect(scoreNow).toHaveTextContent("2");
  });

  it("失敗するとミスカウントが増える", async () => {
    render(<GameMain__test />);
    const cardArea = screen.getByLabelText("神経衰弱のカードエリア");
    const missCount = screen.getByLabelText("ミス回数");
    expect(missCount).toHaveTextContent("0");

    const cards = Array.from(cardArea.children);
    await userEvent.click(cards[0]);
    await userEvent.click(cards[1]);
    act(() => {
      vi.advanceTimersByTime(800);
    });
    expect(missCount).toHaveTextContent("1");

    await userEvent.click(cards[0]);
    await userEvent.click(cards[2]);

    act(() => {
      vi.advanceTimersByTime(800);
    });
    expect(missCount).toHaveTextContent("1");
  });

  it("失敗の最大値は引数に依存する", () => {
    const state: GameMainProps = {
      cardRowsCols: [2, 2],
      gameMode: "irasutoya",
    };

    render(<GameMain__test state={state} />);
    const missCount = screen.getByLabelText("ミス回数");

    expect(missCount).toHaveTextContent("2");

    cleanup();
    const state2: GameMainProps = {
      cardRowsCols: [3, 2],
      gameMode: "irasutoya",
    };

    render(<GameMain__test state={state2} />);
    const missCount2 = screen.getByLabelText("ミス回数");

    expect(missCount2).toHaveTextContent("3");
  });

  it("失敗が規定数に達するとゲームオーバーになる", async () => {
    const state: GameMainProps = {
      cardRowsCols: [2, 2],
      gameMode: "irasutoya",
    };

    render(<GameMain__test state={state} />);
    const cardArea = screen.getByLabelText("神経衰弱のカードエリア");

    const cards = Array.from(cardArea.children);
    await userEvent.click(cards[0]);
    await userEvent.click(cards[1]);
    act(() => {
      vi.advanceTimersByTime(800);
    });

    await userEvent.click(cards[0]);
    await userEvent.click(cards[1]);

    act(() => {
      vi.advanceTimersByTime(800);
    });
    expect(screen.getByText("GAME OVER")).toBeInTheDocument();
  });

  it("全て表にするとゲームクリアになる", async () => {
    render(<GameMain__test />);
    const cardArea = screen.getByLabelText("神経衰弱のカードエリア");

    const cards = Array.from(cardArea.children);
    await userEvent.click(cards[0]);
    await userEvent.click(cards[2]);

    act(() => {
      vi.advanceTimersByTime(800);
    });

    await userEvent.click(cards[1]);
    await userEvent.click(cards[3]);

    act(() => {
      vi.advanceTimersByTime(800);
    });
    expect(screen.getByText("GAME CLEAR")).toBeInTheDocument();
  });

  describe("gameTimer", () => {
    it("カードを枚数によってuseGameTimerの引数が変わる", async () => {
      const stubState: GameMainProps = {
        cardRowsCols: [8, 4],
        gameMode: "irasutoya",
      };

      render(<GameMain__test state={stubState} />);

      expect(useGameTimer).toHaveBeenCalledWith(
        calcGameSeconds(stubState.cardRowsCols),
        expect.any(Function)
      );
    });
    it("カードを初回クリックするとゲームタイマーが開始される", async () => {
      render(<GameMain__test />);

      const cardArea = screen.getByLabelText("神経衰弱のカードエリア");
      await userEvent.click(cardArea.children[0]);

      expect(spyStart).toHaveBeenCalledTimes(1);
    });
    it("カードを2枚目をクリックしてもゲームタイマーは開始されない", async () => {
      render(<GameMain__test />);

      const cardArea = screen.getByLabelText("神経衰弱のカードエリア");
      await userEvent.click(cardArea.children[0]);
      await userEvent.click(cardArea.children[1]);

      act(() => {
        vi.advanceTimersByTime(800);
      });

      expect(spyStart).toHaveBeenCalledTimes(1);
    });
    it("全て表にするとゲームタイマーのstopが呼ばれる", async () => {
      render(<GameMain__test />);
      const cardArea = screen.getByLabelText("神経衰弱のカードエリア");
      const cards = Array.from(cardArea.children);

      // ペアを揃えるために、1と3, 2と4を順にクリックする
      // まずクリック1枚目と3枚目
      await userEvent.click(cards[0]);
      await userEvent.click(cards[2]);
      act(() => {
        vi.advanceTimersByTime(800);
      });

      // 次にクリック2枚目と4枚目
      await userEvent.click(cards[1]);
      await userEvent.click(cards[3]);
      act(() => {
        vi.advanceTimersByTime(800);
      });

      expect(spyPause).toHaveBeenCalled();
    });
    it("useGameTimerの第２引数にgameOverのstate更新関数がある timeが0になるとゲームオーバーになる", () => {
      let onExpireMock: () => void;
      (useGameTimer as any).mockImplementation(
        (_: any, onExpire: () => void) => {
          onExpireMock = onExpire;
          return {
            milliseconds: 0,
            seconds: 0,
            minutes: 0,
            hours: 0,
            days: 0,
            isRunning: false,
            start: vi.fn(),
            pause: vi.fn(),
            restart: vi.fn(),
          };
        }
      );

      render(<GameMain__test />);
      act(() => {
        onExpireMock();
      });

      expect(screen.getByText("GAME OVER")).toBeInTheDocument();
    });
  });
});
