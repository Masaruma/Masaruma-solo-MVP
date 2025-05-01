import { GameMain } from "@/components/GameMain.tsx";
import { act, render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { afterEach, beforeEach, expect } from "vitest";
import { useState } from "react";

vi.mock("@/hooks/useInitializeGame", () => {
  return {
    useInitializeGame: () => {
      const defaultCards = [
        { id: 1, img: null, idx: 0, isMatched: false },
        { id: 2, img: null, idx: 1, isMatched: false },
        { id: 1, img: null, idx: 2, isMatched: false },
        { id: 2, img: null, idx: 3, isMatched: false },

      ];
      const [cards, setCards] =useState(defaultCards);
      const initializeGame = async () => {};
      return { cards, initializeGame, setCards };
    },
  };
});


describe(`${GameMain.name}`, () => {
  beforeEach(() =>{
    vi.useFakeTimers({
      shouldAdvanceTime: true,
    });
  })
  afterEach(()=> {
    vi.useRealTimers()
  })
  it("カードが表になると表のクラスを持つ", async () => {
    render(<GameMain cardRowsCols={[3,4]} gameMode={"irasutoya"}/>)
    const cardArea = screen.getByLabelText("神経衰弱のカードエリア")
    const firstCardComponet = cardArea.children[0]

    await userEvent.click(cardArea.children[0])

    expect(firstCardComponet.children[0]).toHaveClass("front")
  });
  it("カードが裏になると裏のクラスを持つ", () => {
    render(<GameMain cardRowsCols={[3,4]} gameMode={"irasutoya"}/>)
    const cardArea = screen.getByLabelText("神経衰弱のカードエリア")

    const firstCardComponet = cardArea.children[0]
    expect(firstCardComponet.children[0]).toHaveClass("back")
  });
  it("失敗した場合カードは裏から表になる。", async () => {
    render(<GameMain cardRowsCols={[3,4]} gameMode={"irasutoya"}/>)
    const cardArea = screen.getByLabelText("神経衰弱のカードエリア")

    const firstCardComponet = cardArea.children[0]
    const secondCardComponet = cardArea.children[1]
    await userEvent.click(firstCardComponet)
    await userEvent.click(secondCardComponet)
    expect(firstCardComponet.children[0]).toHaveClass("front")
    expect(secondCardComponet.children[0]).toHaveClass("front")

    act(() => {
      vi.advanceTimersByTime(800);
    })

    expect(firstCardComponet.children[0]).toHaveClass("back")
    expect(secondCardComponet.children[0]).toHaveClass("back")
  });

  it("成功した場合カードは表のままになる。", async () => {
    render(<GameMain cardRowsCols={[3,4]} gameMode={"irasutoya"}/>)
    const cardArea = screen.getByLabelText("神経衰弱のカードエリア")

    const firstCardComponet = cardArea.children[0]
    const thirdCardComponet = cardArea.children[2]

    await userEvent.click(firstCardComponet)
    await userEvent.click(thirdCardComponet)

    act(() => {
      vi.advanceTimersByTime(800);
    })

    expect(firstCardComponet.children[0]).toHaveClass("front")
    expect(thirdCardComponet.children[0]).toHaveClass("front")
  });
  it("全て表にするとゲームクリアになる", async () => {
    const alertSpy = vi.spyOn(window, "alert").mockImplementation(() => {});
    render(<GameMain cardRowsCols={[3,4]} gameMode={"irasutoya"}/>)
    const cardArea = screen.getByLabelText("神経衰弱のカードエリア")

    const firstCardComponet = cardArea.children[0]
    const secondCardComponet = cardArea.children[1]
    const thirdCardComponet = cardArea.children[2]
    const fourthCardComponet = cardArea.children[3]

    await userEvent.click(firstCardComponet)
    await userEvent.click(thirdCardComponet)

    act(() => {
      vi.advanceTimersByTime(800);
    })

    await userEvent.click(secondCardComponet)
    await userEvent.click(fourthCardComponet)

    act(() => {
      vi.advanceTimersByTime(800);
    })
    expect(alertSpy).toHaveBeenCalledWith("ゲームクリア")
  });
});