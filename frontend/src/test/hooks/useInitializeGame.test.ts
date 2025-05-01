import { act, renderHook } from "@testing-library/react";
import { beforeEach, expect } from "vitest";

import { useInitializeGame } from "@/hooks/useInitializeGame.ts";

describe(`${useInitializeGame.name}`, () => {
  let stubGameMode = "irasutoya";
  let stubCardRowsCols: [number, number] = [3, 4];
  beforeEach(() => {
    vi.resetModules();
  });
  it("initializeGame関数を実行すると、引数cardRowsColsに戻り値cardsの枚数が連動している", () => {
    const { result } = renderHook(() =>
      useInitializeGame(stubGameMode, stubCardRowsCols)
    );
    expect(result.current.cards.length).toBe(0);

    act(() => {
      void result.current.initializeGame();
    });

    expect(result.current.cards.length).toBe(12);
  });

  it("gameModeがirasutoyaの場合irasutoyaのカード情報を取得している", async () => {
    vi.doMock("@/utils/irasutoyaImageArray", () => ({
      irasutoyaImages: [], // テスト用に空配列など
    }));

    const { useInitializeGame } = await import("@/hooks/useInitializeGame.ts");
    const { result } = renderHook(() =>
      useInitializeGame(stubGameMode, stubCardRowsCols)
    );

    act(() => {
      void result.current.initializeGame();
    });

    expect(result.current.cards.length).toBe(0);
  });
  it.skip("gameModeがpokemonの場合pokemonのカード情報を取得している", () => {
    let stubGameMode = "pokemon";
    renderHook(() => useInitializeGame(stubGameMode, stubCardRowsCols));
  });
});
