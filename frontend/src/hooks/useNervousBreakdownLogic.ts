import { useCallback, useEffect, useState } from "react";
import * as React from "react";

import { useAtomValue } from "jotai/index";

import { CardsWithMatchKeyType } from "@/pages/GameMainPage.tsx";
import { gameSoundAtom } from "@/utils/atom.ts";

const isVsCPU = false;

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

  const [isPlayerTurn, setIsPlayerTurn] = useState(false);
  const [isCpuTurn, setIsCpuTurn] = useState(false);
  const [playerScore, setPlayerScore] = useState(0);
  const [cpuScore, setCpuScore] = useState(0);

  const gameSound = useAtomValue(gameSoundAtom);

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

  const checkMatch = useCallback(() => {
    if (selectedCards[0].id === selectedCards[1].id) {
      gameSound && setTimeout(gameSound.playSuccess, 300);

      setCards((prevCards) =>
        prevCards.map((card) =>
          card.id === selectedCards[0].id ? { ...card, isMatched: true } : card
        )
      );
      if (isVsCPU) {
        isCpuTurn && setCpuScore((prevState) => prevState + 2);
        isPlayerTurn && setPlayerScore((prevState) => prevState + 2);
      }
    } else if (selectedCards[0].id !== selectedCards[1].id) {
      gameSound && setTimeout(gameSound.playFailed, 300);
      setMissCount((prev) => prev + 1);

      if (isVsCPU) {
        if (isCpuTurn) {
          setIsCpuTurn(false);
          setIsPlayerTurn(true);
        } else if (isPlayerTurn) {
          setIsCpuTurn(true);
          setIsPlayerTurn(false);
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- 無限ループするため todo いずれ直す
  }, [gameSound, selectedCards, setCards]);

  useEffect(() => {
    // player match judge
    if (isPlayerTurn && selectedCards.length === 2) {
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
  }, [selectedCards, checkMatch, gameLevel, shuffleCardsPercent, isPlayerTurn]);

  useEffect(() => {
    // clear judge
    if (cards.length === 0) return;
    if (cards.every((card) => card.isMatched)) {
      setIsCleared(true);
      // gameSound.playClear()
    }
  }, [cards, gameSound]);

  const handleCardClick = (card: CardsWithMatchKeyType) => {
    if (isShuffling) return;
    if (isVsCPU && !isPlayerTurn) return;
    if (!selectedCards.includes(card) && !card.isMatched) {
      gameSound?.playCardClick();
      setSelectedCards((prev) => {
        const cleared = prev.length === 2 ? [] : prev;
        return [...cleared, card];
      });
    }
  };

  const [remainHelpsFindPairCard, setRemainHelpsFindPairCard] = useState(1);

  const handleFindPairCard = useCallback(() => {
    if (remainHelpsFindPairCard === 0) return;
    if (selectedCards.length === 1) {
      const selectedCardId = selectedCards[0].id;
      const pairCard = cards.find((card) => card.id === selectedCardId)!!;
      setSelectedCards((prev) => [...prev, pairCard]);
    } else {
      const noMatchedAllCards = cards.filter((card) => !card.isMatched);

      const randomIdNoMatchedCard =
        noMatchedAllCards[Math.floor(Math.random() * noMatchedAllCards.length)]
          .id;

      const noMatchedPairCards = cards.filter(
        (card) => card.id === randomIdNoMatchedCard
      );

      setSelectedCards(noMatchedPairCards);
    }
    setRemainHelpsFindPairCard((prev) => prev - 1);
  }, [
    cards,
    remainHelpsFindPairCard,
    selectedCards,
    setRemainHelpsFindPairCard,
  ]);

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

  useEffect(() => {
    // early or later
    if (!isVsCPU) {
      setIsPlayerTurn(true);
      setIsCpuTurn(false);
    } else {
      const isEarlyOrLater = Math.random() > 0.5;
      setTimeout(() => {
        setIsPlayerTurn(isEarlyOrLater);
        setIsCpuTurn(!isEarlyOrLater);
      }, 1000);
    }
  }, []);

  const cpuCardClick = useCallback(() => {
    const noMatchedAndNoSelectedAllCards = cards
      .filter((card) => !card.isMatched)
      .filter((card) => !selectedCards.includes(card));

    const cpuRandomSelectedCard =
      noMatchedAndNoSelectedAllCards[
        Math.floor(Math.random() * noMatchedAndNoSelectedAllCards.length)
      ];
    setSelectedCards((prev) => {
      const cleared = prev.length === 2 ? [] : prev;
      return [...cleared, cpuRandomSelectedCard];
    });
  }, [cards, selectedCards]);

  useEffect(() => {
    // cpu click
    if (isCleared) return;
    if (isVsCPU && isCpuTurn && selectedCards.length <= 1) {
      setTimeout(() => {
        cpuCardClick();
      }, 1100);
    }
  }, [cpuCardClick, isCleared, isCpuTurn, selectedCards.length]);

  useEffect(() => {
    // cpu match judge
    if (isCleared) return;
    if (isVsCPU && isCpuTurn && selectedCards.length === 2) {
      checkMatch();
      const timeoutId = setTimeout(() => {
        setSelectedCards([]);
      }, 800);
      return () => clearTimeout(timeoutId);
    }
  }, [checkMatch, isCleared, isCpuTurn, selectedCards.length]);

  return {
    helperFlipCards,
    selectedCards,
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
    vsCpuState: {
      isPlayerTurn,
      isCpuTurn,
      playerScore,
      cpuScore,
    },
  };
};
