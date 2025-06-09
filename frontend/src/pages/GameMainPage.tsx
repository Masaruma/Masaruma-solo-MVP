import { useCallback, useEffect, useState } from "react";

import { CircleX, Hand } from "lucide-react";
import { useLocation } from "react-router-dom";

import { Card } from "@/components/Card.tsx";
import { BreadcrumbWithCustomSeparator } from "@/components/customUi/BreadcrumbWithCustomSeparator.tsx";
import { DialogCustom } from "@/components/customUi/DialogCustom.tsx";
import { GameSettingDialog } from "@/components/customUi/GameSettingDialog.tsx";
import { GameTimer } from "@/components/GameTimer.tsx";
import { Notification } from "@/components/Notification.tsx";
import { ScoreInput } from "@/components/ScoreInput.tsx";
import { Button } from "@/components/ui/button.tsx";
import { useGameTimer } from "@/hooks/useGameTimer.ts";
import { useInitializeGame } from "@/hooks/useInitializeGame.ts";
import { useNervousBreakdownLogic } from "@/hooks/useNervousBreakdownLogic.ts";
import { GameModeType } from "@/pages/StartPage.tsx";
import {
  calcGameSeconds,
  calcAllowMissCount,
  calcGridTemplateColumns,
} from "@/utils/calcGameLevel.ts";

export interface GameMainProps {
  gameLevel: number;
  gameMode: GameModeType;
  selectedNumberOfCard: number;
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
  const { gameLevel, gameMode, selectedNumberOfCard } =
    (state as GameMainProps) || {};

  const { cards, initializeGame, setCards } = useInitializeGame(
    gameMode,
    selectedNumberOfCard
  );

  const {
    handleCardClick,
    handleFindPairCard,
    handleTurnAllCardOut,
    helperFlipCards,
    isCleared,
    isShowReverseNotification,
    missCount,
    remainHelpsFindPairCard,
    remainHelpsTurnAll,
    score,
    selectedCards,
  } = useNervousBreakdownLogic(cards, setCards, gameLevel);

  useEffect(() => {
    void initializeGame();
  }, [initializeGame]);

  const [isGameOver, setIsGameOver] = useState(false);
  const [isStarted, setIsStarted] = useState<boolean>(false);

  const gameTimer = useGameTimer(
    calcGameSeconds(selectedNumberOfCard, gameLevel),
    () => {
      setIsGameOver(true);
    }
  );
  const startWithCardClick = useCallback(() => {
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
    if (missCount > calcAllowMissCount(selectedNumberOfCard, gameLevel)) {
      setIsGameOver(true);
    }
  }, [selectedNumberOfCard, missCount, gameLevel]);

  return (
    <>
      <div
        className={`
          flex min-h-0 w-full flex-col items-center justify-center overflow-auto
          bg-transparent
        `}
      >
        {isShowReverseNotification && (
          <Notification
            duration={2000}
            message={"カードがシャッフルされます！"}
          />
        )}
        <div className={"mt-4 mb-2 flex w-full flex-row justify-around gap-4"}>
          <BreadcrumbWithCustomSeparator />
          <GameSettingDialog />
        </div>

        <div className={"mt-4 mb-2 flex w-1/3 flex-row justify-around gap-4"}>
          <div aria-label={"現在の手数"} className={"text-2l text-center"}>
            <Hand className={"inline-block"} /> {score}
          </div>
          <GameTimer
            milliseconds={
              gameLevel === 1
                ? gameTimer.elapsedMilliseconds
                : gameTimer.totalMilliseconds
            }
          />
          <div aria-label={"ミス回数"} className={"text-1xl text-center"}>
            <CircleX className={"inline-block"} />
            {missCount}/{calcAllowMissCount(selectedNumberOfCard, gameLevel)}
          </div>
        </div>

        <div
          className={`
            bg-beige-100 flex w-fit justify-center rounded-2xl border-[2px]
            border-[#e0dcbc] p-4
            shadow-[inset_0_0_10px_2px_rgba(0,0,0,0.25),inset_0_1.5px_18px_0_rgba(0,0,0,0.15)]
            backdrop-blur-xl
          `}
        >
          <div
            aria-label={"神経衰弱のカードエリア"}
            className={`w-fit gap-1`}
            style={{
              display: "grid",
              gridTemplateColumns: `repeat(${calcGridTemplateColumns(selectedNumberOfCard)}, 1fr)`,
              // gridTemplateRows: `repeat(${selectedNumberOfCard[0]}, 1fr)`,
            }}
          >
            {cards.map((card) => (
              <Card
                card={card}
                handleCardClick={handleCardClick}
                helperFlipCards={helperFlipCards}
                key={card.idx}
                selectedCards={selectedCards}
                startWithCardClick={startWithCardClick}
              />
            ))}
          </div>
        </div>
        <div className={"flex flex-row gap-2"}>
          <Button
            className={"relative mt-2"}
            disabled={
              !isStarted ||
              isCleared ||
              isGameOver ||
              remainHelpsFindPairCard === 0
            }
            onClick={() => {
              handleFindPairCard();
            }}
            size={"default"}
            variant={"outline"}
          >
            <span
              aria-hidden={"true"}
              className={`
                absolute top-0 right-0 translate-x-1/2 -translate-y-1/2
                rounded-full bg-red-500 px-1.5 py-0.5 text-xs text-white
              `}
            >
              {remainHelpsFindPairCard}
            </span>
            ペアを見つける
          </Button>
          <Button
            className={"relative mt-2"}
            disabled={
              !isStarted ||
              isCleared ||
              isGameOver ||
              remainHelpsTurnAll === 0 ||
              selectedCards.length === 1
            }
            onClick={() => {
              handleTurnAllCardOut();
            }}
            size={"default"}
            variant={"outline"}
          >
            <span
              aria-hidden={"true"}
              className={`
                absolute top-0 right-0 translate-x-1/2 -translate-y-1/2
                rounded-full bg-red-500 px-1.5 py-0.5 text-xs text-white
              `}
            >
              {remainHelpsTurnAll}
            </span>
            すべて表を見る
          </Button>
        </div>
      </div>
      <DialogCustom dialogTitle={"GAME OVER"} isOpen={isGameOver} />
      <DialogCustom dialogTitle={"GAME CLEAR"} isOpen={isCleared}>
        <ScoreInput
          elapsedTimeMillis={gameTimer.elapsedMilliseconds}
          gameLevel={gameLevel}
          gameMode={gameMode}
          initializeGame={initializeGame}
          isCleared={isCleared}
          missCount={missCount}
          score={score}
          selectedNumberOfCards={selectedNumberOfCard}
        />
      </DialogCustom>
    </>
  );
};
