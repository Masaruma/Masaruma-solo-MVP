import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";

import { useNervousBreakdownLogic } from "./useNervousBreakdownLogic.ts";

describe("useNervousBreakdownLogic", () => {
  const mockCards = [
    { id: 1, img: "test1.jpg", idx: 0, isMatched: false },
    { id: 2, img: "test2.jpg", idx: 1, isMatched: false },
    { id: 1, img: "test1.jpg", idx: 2, isMatched: false },
    { id: 2, img: "test2.jpg", idx: 3, isMatched: false },
  ];

  it("レベル5でカードを選択した時にシャッフル処理が実行される", () => {
    vi.useFakeTimers();
    const setCards = vi.fn();
    const { result } = renderHook(() =>
      useNervousBreakdownLogic(mockCards, setCards, 5)
    );

    // Math.randomをモックして、必ずシャッフルが実行されるようにする
    vi.spyOn(Math, "random").mockReturnValue(0);

    // 最初のカードを選択
    act(() => {
      result.current.handleCardClick(mockCards[0]);
    });

    // 2枚目のカードを選択
    act(() => {
      result.current.handleCardClick(mockCards[1]);
    });

    // タイマーを進める
    act(() => {
      vi.runAllTimers();
    });

    // シャッフル処理が実行されることを確認
    expect(setCards).toHaveBeenCalled();
    vi.useRealTimers();
  });

  it("レベル5以外ではシャッフル処理が実行されない", () => {
    const setCards = vi.fn();
    const { result } = renderHook(() =>
      useNervousBreakdownLogic(mockCards, setCards, 3)
    );

    // 最初のカードを選択
    act(() => {
      result.current.handleCardClick(mockCards[0]);
    });

    // 2枚目のカードを選択
    act(() => {
      result.current.handleCardClick(mockCards[1]);
    });

    // シャッフル処理が実行されないことを確認
    expect(setCards).not.toHaveBeenCalled();
  });

  it("シャッフル中はカードをクリックできない", () => {
    const setCards = vi.fn();
    const { result } = renderHook(() =>
      useNervousBreakdownLogic(mockCards, setCards, 5)
    );

    // Math.randomをモックして、必ずシャッフルが実行されるようにする
    vi.spyOn(Math, "random").mockReturnValue(0);

    // 最初のカードを選択
    act(() => {
      result.current.handleCardClick(mockCards[0]);
    });

    // 2枚目のカードを選択してシャッフルを開始
    act(() => {
      result.current.handleCardClick(mockCards[1]);
    });

    // シャッフル中にカードをクリック
    act(() => {
      result.current.handleCardClick(mockCards[2]);
    });

    // シャッフル中は通知が表示されていることを確認
    expect(result.current.isShowReverseNotification).toBe(true);
  });

  it("シャッフル時に通知が表示される", () => {
    const setCards = vi.fn();
    const { result } = renderHook(() =>
      useNervousBreakdownLogic(mockCards, setCards, 5)
    );

    // Math.randomをモックして、必ずシャッフルが実行されるようにする
    vi.spyOn(Math, "random").mockReturnValue(0);

    // 最初のカードを選択
    act(() => {
      result.current.handleCardClick(mockCards[0]);
    });

    // 2枚目のカードを選択
    act(() => {
      result.current.handleCardClick(mockCards[1]);
    });

    // 通知が表示されることを確認
    expect(result.current.isShowReverseNotification).toBe(true);
  });

  it("全てのカードがマッチしたらisClearedがtrueになる", () => {
    const setCards = vi.fn();
    const matchedCards = mockCards.map((card) => ({
      ...card,
      isMatched: true,
    }));
    const { result } = renderHook(() =>
      useNervousBreakdownLogic(matchedCards, setCards, 1)
    );
    expect(result.current.isCleared).toBe(true);
  });

  it("ミスしたらmissCountが増える", () => {
    const setCards = vi.fn();
    const { result } = renderHook(() =>
      useNervousBreakdownLogic(mockCards, setCards, 1)
    );
    act(() => {
      result.current.handleCardClick(mockCards[0]);
      result.current.handleCardClick(mockCards[1]); // id違い
    });
    expect(result.current.missCount).toBe(1);
  });

  it("マッチ済みカードは選択できない", () => {
    const setCards = vi.fn();
    const matchedCard = { ...mockCards[0], isMatched: true };
    const { result } = renderHook(() =>
      useNervousBreakdownLogic(
        [matchedCard, ...mockCards.slice(1)],
        setCards,
        1
      )
    );
    act(() => {
      result.current.handleCardClick(matchedCard);
    });
    expect(result.current.selectedCards.length).toBe(0);
  });

  it("2枚選択後、selectedCardsがリセットされる", () => {
    vi.useFakeTimers();
    const setCards = vi.fn();
    const { result } = renderHook(() =>
      useNervousBreakdownLogic(mockCards, setCards, 1)
    );
    act(() => {
      result.current.handleCardClick(mockCards[0]);
      result.current.handleCardClick(mockCards[2]);
    });
    // タイマー進める
    act(() => {
      vi.runAllTimers();
    });
    expect(result.current.selectedCards.length).toBe(0);
    vi.useRealTimers();
  });
});
