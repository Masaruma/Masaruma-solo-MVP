import {
  Dispatch,
  SetStateAction,
  useCallback,
  useEffect,
  useState,
} from "react";

import { CardsWithMatchKeyType } from "@/pages/GameMainPage.tsx";

export const useNervousBreakdownLogic = (
  cards: CardsWithMatchKeyType[],
  setCards: Dispatch<SetStateAction<CardsWithMatchKeyType[]>>
) => {
  const [selectedCards, setSelectedCards] = useState<CardsWithMatchKeyType[]>(
    []
  );
  const [score, setScore] = useState(0);
  const [isCleared, setIsCleared] = useState(false);

  // １枚目のカードと2枚目のカードのマッチ判定
  const checkMatch = useCallback(() => {
    if (selectedCards[0].id === selectedCards[1].id) {
      setCards((prevCards) =>
        prevCards.map((card) =>
          card.id === selectedCards[0].id ? { ...card, isMatched: true } : card
        )
      );
    }
  }, [selectedCards, setCards]);

  // 選択処理
  useEffect(() => {
    if (selectedCards.length === 2) {
      setTimeout(() => setSelectedCards([]), 800);
      setScore((prev) => prev + 1);
      checkMatch();
    }
  }, [selectedCards, checkMatch]);

  // クリア判定
  useEffect(() => {
    if (cards.length === 0) return;
    if (cards.every((card) => card.isMatched)) {
      setIsCleared(true);
      setTimeout(() => {
        alert("ゲームクリア");
      }, 500);
    }
  }, [cards]);

  return {
    selectedCards,
    setSelectedCards,
    score,
    isCleared,
  };
};
