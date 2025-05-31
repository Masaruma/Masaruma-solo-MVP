import { useCallback, useEffect, useState } from "react";
import * as React from "react";

import { CardsWithMatchKeyType } from "@/pages/GameMainPage.tsx";

export const useNervousBreakdownLogic = (
  cards: CardsWithMatchKeyType[],
  setCards: React.Dispatch<React.SetStateAction<CardsWithMatchKeyType[]>>,
  gameLevel: number
) => {
  const [selectedCards, setSelectedCards] = useState<CardsWithMatchKeyType[]>(
    []
  );
  const [score, setScore] = useState(0);
  const [isCleared, setIsCleared] = useState(false);
  const [missCount, setMissCount] = useState(0);
  const [isShowReverseNotification, setIsShowReverseNotification] =
    useState(false);
  const [isShuffling, setIsShuffling] = useState(false);

  // カードのシャッフル処理
  const shuffleCards = useCallback(() => {
    if (gameLevel !== 5) return;
    setIsShuffling(true);

    setIsShowReverseNotification(true);
    setTimeout(() => {
      setCards((prevCards) => {
        // マッチしていないカードのみをシャッフル対象とする
        // const unmatchedCards = prevCards.filter(card => !card.isMatched);
        // const matchedCards = prevCards.filter(card => card.isMatched);

        // フィッシャー・イェーツのシャッフルアルゴリズム
        for (let i = prevCards.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [prevCards[i], prevCards[j]] = [prevCards[j], prevCards[i]];
        }

        // マッチしたカードとシャッフルしたカードを結合
        return [...prevCards];
      });
      setIsShowReverseNotification(false);
      setIsShuffling(false);
    }, 1100);
  }, [gameLevel, setCards]);

  // １枚目のカードと2枚目のカードのマッチ判定
  const checkMatch = useCallback(() => {
    if (selectedCards[0].id === selectedCards[1].id) {
      setCards((prevCards) =>
        prevCards.map((card) =>
          card.id === selectedCards[0].id ? { ...card, isMatched: true } : card
        )
      );
    } else if (selectedCards[0].id !== selectedCards[1].id) {
      setMissCount((prev) => prev + 1);
    }
  }, [selectedCards, setCards]);

  // 選択処理
  useEffect(() => {
    if (selectedCards.length === 2) {
      setScore((prev) => prev + 1);
      checkMatch();
      if (gameLevel === 5) {
        shuffleCards();
      }
      const timeoutId = setTimeout(() => {
        setSelectedCards([]);
      }, 800);
      return () => clearTimeout(timeoutId);
    }
  }, [selectedCards, checkMatch, gameLevel, shuffleCards]);

  // クリア判定
  useEffect(() => {
    if (cards.length === 0) return;
    if (cards.every((card) => card.isMatched)) {
      setIsCleared(true);
    }
  }, [cards]);

  const handleCardClick = (card: CardsWithMatchKeyType) => {
    if (isShuffling) return; // シャッフル中はクリックを無効化

    if (!selectedCards.includes(card) && !card.isMatched) {
      setSelectedCards((prev) => {
        const cleared = prev.length === 2 ? [] : prev;
        return [...cleared, card];
      });
    }
  };

  return {
    selectedCards,
    handleCardClick,
    score,
    isCleared,
    missCount,
    isShowReverseNotification,
  };
};
