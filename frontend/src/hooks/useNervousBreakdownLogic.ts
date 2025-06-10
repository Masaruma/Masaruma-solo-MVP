import * as React from "react";
import { useCallback, useEffect, useState } from "react";

import { useAtomValue } from "jotai/index";

import { CardsWithMatchKeyType } from "@/pages/GameMainPage.tsx";
import { gameSoundAtom } from "@/utils/atom.ts";

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

  const gameSound = useAtomValue(gameSoundAtom);

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
  const checkMatch = useCallback((selectedCardsToCheck: CardsWithMatchKeyType[]) => {
    if (selectedCardsToCheck[0].id === selectedCardsToCheck[1].id) {
      gameSound && setTimeout(gameSound.playSuccess, 300);

      setCards((prevCards) =>
        prevCards.map((card) =>
          card.id === selectedCardsToCheck[0].id ? { ...card, isMatched: true } : card
        )
      );
    } else if (selectedCardsToCheck[0].id !== selectedCardsToCheck[1].id) {
      gameSound && setTimeout(gameSound.playFailed, 300);
      setMissCount((prev) => prev + 1);
    }
  }, [gameSound, setCards]);

  // 選択処理
  useEffect(() => {
    const selectedCardsInState = cards.filter((card) => card.isSelected);
    
    if (selectedCardsInState.length === 2) {
      setScore((prev) => prev + 1);
      checkMatch(selectedCardsInState);

      if (gameLevel === 5) {
        shuffleCardsPercent(0.15);
      }

      const timeoutId = setTimeout(() => {
        setCards((prev) =>
          prev.map((card) => {
            if (card.isSelected) {
              return { ...card, isSelected: false };
            } else {
              return card;
            }
          })
        );
      }, 800);
      return () => clearTimeout(timeoutId);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cards.map(card => card.isSelected).join(','), checkMatch, gameLevel, setCards, shuffleCardsPercent]);

  // クリア判定
  useEffect(() => {
    if (cards.length === 0) return;
    if (cards.every((card) => card.isMatched)) {
      setIsCleared(true);
      // gameSound.playClear()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [cards.map(card => card.isMatched).join(',')]);

  const handleCardClick = (clicked: CardsWithMatchKeyType) => {
    if (isShuffling) return; // シャッフル中はクリックを無効化
    if (!clicked.isSelected && !clicked.isMatched) {
      gameSound?.playCardClick();
      setCards((prev) => {
        const currentSelected = prev.filter((card) => card.isSelected);
        
        if (currentSelected.length === 2) {
          // 既に2枚選択されている場合は選択をリセット
          return prev.map((card) => ({ ...card, isSelected: card.idx === clicked.idx }));

        } else {
          // 新しいカードを選択
          return prev.map((card) => {
            if (card.idx === clicked.idx) {
              return { ...card, isSelected: true };
            } else {
              return card;
            }
          });
        }
      });
    }
  };

  // 以下のhelper機能は既存のselectedCardsを使用しているため修正が必要
  const [remainHelpsFindPairCard, setRemainHelpsFindPairCard] = useState(1);

  const handleFindPairCard = useCallback(() => {
    if (remainHelpsFindPairCard === 0) return;
    
    const currentSelected = cards.filter((card) => card.isSelected);
    
    if (currentSelected.length === 1) {
      const selectedCardId = currentSelected[0].id;
      const pairCard = cards.find((card) => card.id === selectedCardId && card.idx !== currentSelected[0].idx);
      if (pairCard) {
        setCards(prev => prev.map(card => 
          card.idx === pairCard.idx ? { ...card, isSelected: true } : card
        ));
      }
    } else {
      const noMatchedAllCards = cards.filter((card) => !card.isMatched);
      const randomIdNoMatchedCard =
        noMatchedAllCards[Math.floor(Math.random() * noMatchedAllCards.length)]?.id;

      if (randomIdNoMatchedCard) {
        const noMatchedPairCards = cards.filter(
          (card) => card.id === randomIdNoMatchedCard && !card.isMatched
        );

        setCards(prev => prev.map(card => 
          noMatchedPairCards.some(pair => pair.idx === card.idx) 
            ? { ...card, isSelected: true } 
            : { ...card, isSelected: false }
        ));
      }
    }
    setRemainHelpsFindPairCard((prev) => prev - 1);
  }, [cards, remainHelpsFindPairCard, setCards]);

  const [remainHelpsTurnAll, setRemainHelpsTurnAll] = useState(
    gameLevel >= 3 ? 1 : 0
  );
  const [helperFlipCards, setHelperFlipCards] = useState<
    CardsWithMatchKeyType[]
  >([]);

  const handleTurnAllCardOut = useCallback(() => {
    if (remainHelpsTurnAll === 0) return;
    const noMatchedAllCards = cards
      .filter((card) => !card.isMatched)
      .sort(() => Math.random() - 0.5);
    const maxSimultaneousFront = cards.length / 2 - 1;

    const flipSequentially = (step: number) => {
      if (step >= noMatchedAllCards.length + maxSimultaneousFront) {
        setHelperFlipCards([]);
        return;
      }
      const startIdx = Math.max(0, step + 1 - maxSimultaneousFront);
      const endIdx = Math.min(noMatchedAllCards.length, step + 1);
      const currentBatch = noMatchedAllCards.slice(startIdx, endIdx);

      setHelperFlipCards(currentBatch);
      setTimeout(() => flipSequentially(step + 1), 120);
    };

    flipSequentially(0);
    setRemainHelpsTurnAll((prev) => prev - 1);
  }, [cards, remainHelpsTurnAll]);

  const onLogicReset = useCallback(() => {
    setIsCleared(false);
    setScore(0);
    setMissCount(0);
    setRemainHelpsTurnAll(gameLevel >= 3 ? 1 : 0);
    setRemainHelpsFindPairCard(1);
    setSelectedCards([]);
    setIsShowReverseNotification(false);
    setIsShuffling(false);
    setHelperFlipCards([]);
  }, [gameLevel]);

  // selectedCardsを計算で求める
  const computedSelectedCards = cards.filter((card) => card.isSelected);

  return {
    helperFlipCards,
    selectedCards: computedSelectedCards,
    handleCardClick,
    score,
    isCleared,
    missCount,
    isShowReverseNotification,
    handleFindPairCard,
    remainHelpsFindPairCard,
    handleTurnAllCardOut,
    remainHelpsTurnAll,
    onLogicReset,
  };
};