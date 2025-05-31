vi.mock("@/utils/irasutoyaImageArray", () => ({
  irasutoyaImages: [
    { id: 1, img: "https://1.bp.blogspot.com/test1.jpg" },
    { id: 2, img: "https://1.bp.blogspot.com/test2.jpg" },
    { id: 3, img: "https://1.bp.blogspot.com/test2.jpg" },
    { id: 4, img: "https://1.bp.blogspot.com/test2.jpg" },
    { id: 5, img: "https://1.bp.blogspot.com/test2.jpg" },
    { id: 6, img: "https://1.bp.blogspot.com/test2.jpg" },
  ],
}));

import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

import { useInitializeGame } from "@/hooks/useInitializeGame.ts";

describe("useInitializeGame", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    vi.clearAllMocks();
  });

  it("初期状態ではカードが空配列", () => {
    const { result } = renderHook(() => useInitializeGame("irasutoya", 4));
    expect(result.current.cards).toEqual([]);
  });

  it("initializeGameを呼ぶとカードが生成される", async () => {
    const { result } = renderHook(() => useInitializeGame("irasutoya", 4));
    await act(async () => {
      await result.current.initializeGame();
    });
    expect(result.current.cards.length).toBe(4);
  });

  it("カードは必ずペアになる", async () => {
    const { result } = renderHook(() => useInitializeGame("irasutoya", 4));
    await act(async () => {
      await result.current.initializeGame();
    });
    const ids = result.current.cards.map((card) => card.id);
    const uniqueIds = new Set(ids);
    expect(uniqueIds.size).toBe(2); // 2種類のID（ペア）
  });

  it("カードはシャッフルされている", async () => {
    const { result } = renderHook(() => useInitializeGame("irasutoya", 4));
    await act(async () => {
      await result.current.initializeGame();
    });
    const ids = result.current.cards.map((card) => card.id);
    // シャッフルの判定：元の配列と異なる順序になっているか
    const originalOrder = [...ids].sort();
    expect(ids).not.toEqual(originalOrder);
  });

  it("指定した枚数のカードが生成される", async () => {
    const { result } = renderHook(() => useInitializeGame("irasutoya", 6));
    await act(async () => {
      await result.current.initializeGame();
    });
    expect(result.current.cards.length).toBe(6);
  });

  it.skip("ポケモンモードでは正しいURLの画像が生成される", async () => {
    const { result } = renderHook(() => useInitializeGame("pokemon", 4));
    await act(async () => {
      await result.current.initializeGame();
    });
    const urls = result.current.cards.map((card) => card.img);
    // eslint-disable-next-line no-restricted-syntax -- 全カードのurlが正しいかテストのため
    urls.forEach((url) => {
      expect(url).toMatch(
        /^https:\/\/raw\.githubusercontent\.com\/PokeAPI\/sprites\/master\/sprites\/pokemon/
      );
    });
  });

  it("いらすとやモードでは正しいURLの画像が生成される", async () => {
    const { result } = renderHook(() => useInitializeGame("irasutoya", 4));
    await act(async () => {
      await result.current.initializeGame();
    });
    const urls = result.current.cards.map((card) => card.img);
    // eslint-disable-next-line no-restricted-syntax -- 全カードのurlが正しいかテストのため
    urls.forEach((url) => {
      expect(url).toMatch(/^https:\/\/1\.bp\.blogspot\.com/);
    });
  });

  it("setCardsでカードの状態を更新できる", async () => {
    const { result } = renderHook(() => useInitializeGame("irasutoya", 4));
    await act(async () => {
      await result.current.initializeGame();
    });
    const newCards = result.current.cards.map((card) => ({
      ...card,
      isMatched: true,
    }));
    act(() => {
      result.current.setCards(newCards);
    });
    expect(result.current.cards.every((card) => card.isMatched)).toBe(true);
  });
});
