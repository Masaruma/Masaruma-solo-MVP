import { useState } from "react";

import {
  act,
  cleanup,
  render,
  screen,
  fireEvent,
} from "@testing-library/react";
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
  selectedNumberOfCard: 12,
  gameMode: "irasutoya",
  gameLevel: 3,
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

  describe("神経衰弱のメイン動作", () => {
    it("クリックすると transform が rotateY(180deg) になり、カードが表向きになる", async () => {
      render(<GameMain__test />);
      const cardArea = screen.getByLabelText("神経衰弱のカードエリア");
      const firstCardComponent = cardArea.children[0] as HTMLElement;

      // まず初期状態では transform: "rotateY(0deg)"
      expect(firstCardComponent).toHaveStyle({ transform: "rotateY(0deg)" });

      // クリックして isFlipped=true にする
      await userEvent.click(firstCardComponent);
      // JSDOM では setTimeout やアニメーション不要。クリック直後に style.transform が更新されるはず
      expect(firstCardComponent).toHaveStyle({ transform: "rotateY(180deg)" });
    });

    it("カードが裏になると裏のクラスを持つ", () => {
      render(<GameMain__test />);
      const cardArea = screen.getByLabelText("神経衰弱のカードエリア");

      const firstCardComponet = cardArea.children[0];
      expect(firstCardComponet).toHaveStyle({ transform: "rotateY(0deg)" });
    });

    it("2枚表にし、失敗した場合1000ms後にカードは表から裏になる。", async () => {
      render(<GameMain__test />);
      const cardArea = screen.getByLabelText("神経衰弱のカードエリア");

      const firstCardComponet = cardArea.children[0];
      const secondCardComponet = cardArea.children[1];
      await userEvent.click(firstCardComponet);
      await userEvent.click(secondCardComponet);
      expect(firstCardComponet).toHaveStyle({ transform: "rotateY(180deg)" });
      expect(secondCardComponet).toHaveStyle({ transform: "rotateY(180deg)" });

      act(() => {
        vi.advanceTimersByTime(1000);
      });

      expect(firstCardComponet).toHaveStyle({ transform: "rotateY(0deg)" });
      expect(secondCardComponet).toHaveStyle({ transform: "rotateY(0deg)" });
    });
    it("2枚表にし、失敗した場合、別のカードをクリックすると即時カードは表から裏になる。", async () => {
      render(<GameMain__test />);
      const cardArea = screen.getByLabelText("神経衰弱のカードエリア");

      const firstCardComponent = cardArea.children[0];
      const secondCardComponent = cardArea.children[1];
      const thirdCardComponent = cardArea.children[2];
      await userEvent.click(firstCardComponent);
      await userEvent.click(secondCardComponent);
      expect(firstCardComponent).toHaveStyle({ transform: "rotateY(180deg)" });
      expect(secondCardComponent).toHaveStyle({ transform: "rotateY(180deg)" });

      await userEvent.click(thirdCardComponent);

      expect(firstCardComponent).toHaveStyle({ transform: "rotateY(0deg)" });
      expect(secondCardComponent).toHaveStyle({ transform: "rotateY(0deg)" });
      expect(thirdCardComponent).toHaveStyle({ transform: "rotateY(180deg)" });
    });

    it("2枚表にし、成功した場合カードは表のままになる。", async () => {
      render(<GameMain__test />);
      const cardArea = screen.getByLabelText("神経衰弱のカードエリア");

      const firstCardComponent = cardArea.children[0];
      const thirdCardComponent = cardArea.children[2];

      await userEvent.click(firstCardComponent);
      await userEvent.click(thirdCardComponent);

      act(() => {
        vi.advanceTimersByTime(1000);
      });

      expect(firstCardComponent).toHaveStyle({ transform: "rotateY(180deg)" });
      expect(thirdCardComponent).toHaveStyle({ transform: "rotateY(180deg)" });
    });

    it("全て表にするとゲームクリアになる", async () => {
      render(<GameMain__test />);
      const cardArea = screen.getByLabelText("神経衰弱のカードエリア");

      const cards = Array.from(cardArea.children);
      await userEvent.click(cards[0]);
      await userEvent.click(cards[2]);

      act(() => {
        vi.advanceTimersByTime(1000);
      });

      await userEvent.click(cards[1]);
      await userEvent.click(cards[3]);

      act(() => {
        vi.advanceTimersByTime(1000);
      });
      expect(screen.getByText("GAME CLEAR")).toBeInTheDocument();
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
          vi.advanceTimersByTime(1000);
        });
        // アンチパターン 1枚目クリック1枚目クリック すると1枚目も3枚目も表に
        // 良いパターン 1枚目クリック1枚目クリック すると1枚目だけ表
        expect(firstCardComponent).toHaveStyle({
          transform: "rotateY(180deg)",
        });
        expect(thirdCardComponent).toHaveStyle({ transform: "rotateY(0deg)" });
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
          vi.advanceTimersByTime(1000);
        });

        await userEvent.click(firstCardComponent);
        await userEvent.click(secondCardComponent);
        act(() => {
          vi.advanceTimersByTime(1000);
        });
        expect(secondCardComponent).toHaveStyle({
          transform: "rotateY(180deg)",
        });
      });
    });
  });

  describe("ミス回数", () => {
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
        vi.advanceTimersByTime(1000);
      });
      expect(scoreNow).toHaveTextContent("1");

      await userEvent.click(firstCardComponent);
      await userEvent.click(thirdCardComponent);

      act(() => {
        vi.advanceTimersByTime(1000);
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
        vi.advanceTimersByTime(1000);
      });
      expect(missCount).toHaveTextContent("1");

      await userEvent.click(cards[0]);
      await userEvent.click(cards[2]);

      act(() => {
        vi.advanceTimersByTime(1000);
      });
      expect(missCount).toHaveTextContent("1");
    });

    describe("gameLevel:1, gameLevel2", () => {
      it("失敗の最大値はInfinityとなる", () => {
        const state: GameMainProps = {
          selectedNumberOfCard: 4,
          gameMode: "irasutoya",
          gameLevel: 1,
        };

        render(<GameMain__test state={state} />);
        const missCount = screen.getByLabelText("ミス回数");

        expect(missCount).toHaveTextContent("Infinity");

        cleanup();
        const state2: GameMainProps = {
          selectedNumberOfCard: 6,
          gameMode: "irasutoya",
          gameLevel: 2,
        };

        render(<GameMain__test state={state2} />);
        const missCount2 = screen.getByLabelText("ミス回数");

        expect(missCount2).toHaveTextContent("Infinity");
      });
    });

    describe("gameLevel:3", () => {
      it("失敗の最大値は引数に依存する", () => {
        const state: GameMainProps = {
          selectedNumberOfCard: 4,
          gameMode: "irasutoya",
          gameLevel: 3,
        };

        render(<GameMain__test state={state} />);
        const missCount = screen.getByLabelText("ミス回数");

        expect(missCount).toHaveTextContent("2");

        cleanup();
        const state2: GameMainProps = {
          selectedNumberOfCard: 6,
          gameMode: "irasutoya",
          gameLevel: 3,
        };

        render(<GameMain__test state={state2} />);
        const missCount2 = screen.getByLabelText("ミス回数");

        expect(missCount2).toHaveTextContent("3");
      });

      it("失敗が規定数に達するとゲームオーバーになる", async () => {
        const state: GameMainProps = {
          selectedNumberOfCard: 4,
          gameMode: "irasutoya",
          gameLevel: 3,
        };

        render(<GameMain__test state={state} />);
        const cardArea = screen.getByLabelText("神経衰弱のカードエリア");

        const cards = Array.from(cardArea.children);
        await userEvent.click(cards[0]);
        await userEvent.click(cards[1]);
        act(() => {
          vi.advanceTimersByTime(1000);
        });

        await userEvent.click(cards[0]);
        await userEvent.click(cards[1]);

        act(() => {
          vi.advanceTimersByTime(1000);
        });
        expect(screen.getByText("GAME OVER")).toBeInTheDocument();
      });
    });
  });

  describe("gameTimer", () => {
    it("gameLevel1: calcGameSecondsが無限に近い値を持つ", () => {
      const stubState: GameMainProps = {
        selectedNumberOfCard: 32,
        gameMode: "irasutoya",
        gameLevel: 1,
      };

      expect(
        calcGameSeconds(stubState.selectedNumberOfCard, stubState.gameLevel)
      ).toBe(500000000);
    });

    it("カードを枚数によってuseGameTimerの引数が変わる", async () => {
      const stubState: GameMainProps = {
        selectedNumberOfCard: 32,
        gameMode: "irasutoya",
        gameLevel: 3,
      };

      render(<GameMain__test state={stubState} />);

      expect(useGameTimer).toHaveBeenCalledWith(
        calcGameSeconds(stubState.selectedNumberOfCard, stubState.gameLevel),
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
        vi.advanceTimersByTime(1000);
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
        vi.advanceTimersByTime(1000);
      });

      // 次にクリック2枚目と4枚目
      await userEvent.click(cards[1]);
      await userEvent.click(cards[3]);
      act(() => {
        vi.advanceTimersByTime(1000);
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

  describe("シャッフル機能", () => {
    it("gameLevel5:でカードを2枚選択するとシャッフル通知が表示される", async () => {
      vi.spyOn(Math, "random").mockReturnValue(0);
      const state: GameMainProps = {
        gameLevel: 5,
        gameMode: "irasutoya",
        selectedNumberOfCard: 4,
      };
      render(<GameMain__test state={state} />);

      // カードが2枚以上表示されるまで待つ
      const cards = await screen.findAllByRole("button");
      expect(cards.length).toBeGreaterThanOrEqual(2);
      // 2枚クリック
      act(() => {
        fireEvent.click(cards[0]);
        fireEvent.click(cards[1]);
      });
      // 通知が表示される
      expect(
          await screen.findByText("カードがシャッフルされます！")
      ).toBeInTheDocument();
    });

    it("レベル5でシャッフル中はカードをクリックできない", async () => {
      vi.spyOn(Math, "random").mockReturnValue(0);
      const state: GameMainProps = {
        gameLevel: 5,
        gameMode: "irasutoya",
        selectedNumberOfCard: 4,
      };
      render(<GameMain__test state={state} />);

      const cards = await screen.findAllByRole("button");
      
      // 2枚クリックしてシャッフルを発生させる
      await userEvent.click(cards[0]);
      await userEvent.click(cards[1]);

      // シャッフル中に別のカードをクリック
      await userEvent.click(cards[2]);

      // シャッフル中はカードが選択されないことを確認
      expect(cards[2]).toHaveStyle({ transform: "rotateY(0deg)" });
    });

    it("レベル5以外ではシャッフルが発生しない", async () => {
      vi.spyOn(Math, "random").mockReturnValue(0);
      const state: GameMainProps = {
        gameLevel: 3,
        gameMode: "irasutoya",
        selectedNumberOfCard: 4,
      };
      render(<GameMain__test state={state} />);

      const cards = await screen.findAllByRole("button");
      
      // 2枚クリック
      await userEvent.click(cards[0]);
      await userEvent.click(cards[1]);

      // シャッフル通知が表示されないことを確認
      expect(screen.queryByText("カードがシャッフルされます！")).not.toBeInTheDocument();
    });
  });

  describe("エッジケース", () => {
    it("ゲームクリア後にカードをクリックしても何も起きない", async () => {
      render(<GameMain__test />);
      const cardArea = screen.getByLabelText("神経衰弱のカードエリア");
      const cards = Array.from(cardArea.children);

      // 全てのカードをマッチさせる
      await userEvent.click(cards[0]);
      await userEvent.click(cards[2]);
      act(() => {
        vi.advanceTimersByTime(1000);
      });

      await userEvent.click(cards[1]);
      await userEvent.click(cards[3]);
      act(() => {
        vi.advanceTimersByTime(1000);
      });

      // ゲームクリア状態を確認
      expect(screen.getByText("GAME CLEAR")).toBeInTheDocument();

      // クリア後はカードがクリックできないことを確認
      expect(cardArea).toHaveStyle({ pointerEvents: "none" });
    });

    it("ゲームオーバー後にカードをクリックしても何も起きない", async () => {
      const state: GameMainProps = {
        selectedNumberOfCard: 4,
        gameMode: "irasutoya",
        gameLevel: 3,
      };
      render(<GameMain__test state={state} />);
      const cardArea = screen.getByLabelText("神経衰弱のカードエリア");
      const cards = Array.from(cardArea.children);

      // ミスを2回発生させてゲームオーバーにする
      await userEvent.click(cards[0]);
      await userEvent.click(cards[1]);
      act(() => {
        vi.advanceTimersByTime(1000);
      });

      await userEvent.click(cards[0]);
      await userEvent.click(cards[1]);
      act(() => {
        vi.advanceTimersByTime(1000);
      });

      // ゲームオーバー状態を確認
      expect(screen.getByText("GAME OVER")).toBeInTheDocument();

      // オーバー後はカードがクリックできないことを確認
      expect(cardArea).toHaveStyle({ pointerEvents: "none" });
    });
  });

});
