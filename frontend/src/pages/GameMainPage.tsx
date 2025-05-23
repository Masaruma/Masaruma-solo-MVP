import { useEffect } from "react";

import { useLocation } from "react-router-dom";

import { Card } from "@/components/Card.tsx";
import { BreadcrumbWithCustomSeparator } from "@/components/customUi/BreadcrumbWithCustomSeparator.tsx";
import { GameTimer } from "@/components/GameTimer.tsx";
import { ScoreInput } from "@/components/ScoreInput.tsx";
import { useInitializeGame } from "@/hooks/useInitializeGame.ts";
import { useNervousBreakdownLogic } from "@/hooks/useNervousBreakdownLogic.ts";
import { GameModeType } from "@/pages/StartPage.tsx";

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

  const { isCleared, score, selectedCards, setSelectedCards } =
    useNervousBreakdownLogic(cards, setCards);

  useEffect(() => {
    void initializeGame();
    // 初期化時スコアやクリア状態もリセット（useNervousBreakdownLogic内に初期化用メソッド持たせてもOK）
  }, [initializeGame]);

  return (
    <div
      className={`
        flex min-h-0 w-full flex-col items-center justify-center overflow-auto
        bg-transparent
      `}
    >
      <BreadcrumbWithCustomSeparator />
      <ScoreInput
        cardRowsCols={cardRowsCols}
        gameMode={gameMode}
        initializeGame={initializeGame}
        isCleared={isCleared}
        score={score}
      />
      <GameTimer expiryTimestamp={new Date(Date.now() + 1000 * 60 * 3)} />
      <div className={"text-center text-2xl"}>現在の手数:{score}</div>
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
              selectedCards={selectedCards}
              setSelectedCards={setSelectedCards}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
