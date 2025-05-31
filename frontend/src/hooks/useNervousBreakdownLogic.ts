import { useCallback, useEffect, useState } from "react";
import * as React from "react";

import { CardsWithMatchKeyType } from "@/pages/GameMainPage.tsx";
import {useGameSound} from "@/hooks/useGameSound.ts";

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

  const gameSound = useGameSound()

  // カードのシャッフル処理
  const shuffleCardsPercent = useCallback(
    (percent: number) => {
      if (Math.random() > percent) return;
      setIsShuffling(true);

      setIsShowReverseNotification(true);
      setTimeout(() => {
        setCards((prevCards) => {
          // フィッシャー・イェーツのシャッフルアルゴリズム
          for (let i = prevCards.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [prevCards[i], prevCards[j]] = [prevCards[j], prevCards[i]];
          }
          return [...prevCards];
        });
        setIsShowReverseNotification(false);
        setIsShuffling(false);
      }, 1100);
    },
    [setCards]
  );

  // １枚目のカードと2枚目のカードのマッチ判定
  const checkMatch = useCallback(() => {
    if (selectedCards[0].id === selectedCards[1].id) {
      setTimeout(gameSound.playSuccess,300)

      setCards((prevCards) =>
        prevCards.map((card) =>
          card.id === selectedCards[0].id ? { ...card, isMatched: true } : card
        )
      );
    } else if (selectedCards[0].id !== selectedCards[1].id) {
      setTimeout(gameSound.playFailed,300)
      setMissCount((prev) => prev + 1);
    }
  }, [gameSound.playFailed, gameSound.playSuccess, selectedCards, setCards]);

  // 選択処理
  useEffect(() => {
    if (selectedCards.length === 2) {
      setScore((prev) => prev + 1);
      checkMatch();

      if (gameLevel === 5) {
        shuffleCardsPercent(0.15);
      }

      const timeoutId = setTimeout(() => {
        setSelectedCards([]);
      }, 800);
      return () => clearTimeout(timeoutId);
    }
  }, [selectedCards, checkMatch, gameLevel, shuffleCardsPercent]);

  // クリア判定
  useEffect(() => {
    if (cards.length === 0) return;
    if (cards.every((card) => card.isMatched)) {
      setIsCleared(true);
      // gameSound.playClear()
    }
  }, [cards, gameSound]);

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
