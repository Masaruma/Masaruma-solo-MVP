import { useCallback, useEffect, useState } from "react";

import { useLocation } from "react-router-dom";

import { Card } from "@/components/Card.tsx";
import { BreadcrumbWithCustomSeparator } from "@/components/customUi/BreadcrumbWithCustomSeparator.tsx";
import { DialogCustom } from "@/components/customUi/DialogCustom.tsx";
import { GameTimer } from "@/components/GameTimer.tsx";
import { ScoreInput } from "@/components/ScoreInput.tsx";
import { useGameTimer } from "@/hooks/useGameTimer.ts";
import { useInitializeGame } from "@/hooks/useInitializeGame.ts";
import { useNervousBreakdownLogic } from "@/hooks/useNervousBreakdownLogic.ts";
import { GameModeType } from "@/pages/StartPage.tsx";
import { calcGameSeconds, culcAllowMissCount } from "@/utils/culcGameLevel.ts";

export interface GameMainProps {
  cardRowsCols: [number, number];
  gameMode: GameModeType;
}

export type CardImageType = {
  id: number;
  img: string;
};
export type CardsWithMatchKeyType = CardImageType & {
  idx: number;
  isMatched: boolean;
};

export const GameMainPage = () => {
  const { state } = useLocation();
  const { cardRowsCols, gameMode } = (state as GameMainProps) || {};

  const { cards, initializeGame, setCards } = useInitializeGame(
    gameMode,
    cardRowsCols
  );

  const { isCleared, missCount, score, selectedCards, setSelectedCards } =
    useNervousBreakdownLogic(cards, setCards);

  useEffect(() => {
    void initializeGame();
  }, [initializeGame]);

  const [isGameOver, setIsGameOver] = useState(false);
  const [isStarted, setIsStarted] = useState<boolean>(false);

  const gameTimer = useGameTimer(calcGameSeconds(cardRowsCols), () => {
    setIsGameOver(true);
  });
  const onCardClick = useCallback(() => {
    if (!isStarted) {
      setIsStarted(true);
      gameTimer.start();
    }
  }, [gameTimer, isStarted]);

  useEffect(() => {
    if (isCleared) {
      gameTimer.pause();
    }
  }, [isCleared, gameTimer]);


  useEffect(() => {
    if(missCount === culcAllowMissCount(cardRowsCols)) {
      setIsGameOver(true);
    }
  }, [cardRowsCols, missCount]);

  return (
    <>
      <div
        className={`
          flex min-h-0 w-full flex-col items-center justify-center overflow-auto
          bg-transparent
        `}
      >
        <BreadcrumbWithCustomSeparator />

        <GameTimer milliseconds={gameTimer.totalMilliseconds} />
        {/*<div> {gameTimer.elapsedMilliseconds}</div>*/}
        <div aria-label={"現在の手数"} className={"text-center text-2xl"}>
          現在の手数:{score}
        </div>
        <div aria-label={"ミス回数"} className={"text-center text-2xl"}>
          ミス回数:{missCount} / {culcAllowMissCount(cardRowsCols)}
        </div>

        <div
          className={`
            flex w-fit justify-center rounded-2xl bg-[#a2e29b] p-12
            shadow-[4px_4px_13px_5px_rgba(0,0,0,0.25)]
          `}
        >
          <div
            aria-label={"神経衰弱のカードエリア"}
            className={`w-fit gap-1`}
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${cardRowsCols[1]}, 1fr)`,
              gridTemplateRows: `repeat(${cardRowsCols[0]}, 1fr)`,
            }}
          >
            {cards.map((card) => (
              <Card
                card={card}
                key={card.idx}
                onCardClick={onCardClick}
                selectedCards={selectedCards}
                setSelectedCards={setSelectedCards}
              />
            ))}
          </div>
        </div>
      </div>
      <DialogCustom dialogTitle={"GAME OVER"} isOpen={isGameOver} />
      <DialogCustom dialogTitle={"GAME CLEAR"} isOpen={isCleared}>
        <ScoreInput
          cardRowsCols={cardRowsCols}
          elapsedTimeMillis={gameTimer.elapsedMilliseconds}
          gameMode={gameMode}
          initializeGame={initializeGame}
          isCleared={isCleared}
          missCount={missCount}
          score={score}
        />
      </DialogCustom>
    </>
  );
};
