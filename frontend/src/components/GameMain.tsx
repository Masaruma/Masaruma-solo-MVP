import { useEffect } from "react";

import { useLocation } from "react-router-dom";

import { Card } from "@/components/Card.tsx";
import { GameTimer } from "@/components/GameTimer.tsx";
import { Input } from "@/components/Input.tsx";
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

export const GameMain = () => {
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
    <div className={"main-container"}>
      <main className={"game-container"}>
        <div className={"game"}>
          <Input
            cardRowsCols={cardRowsCols}
            gameMode={gameMode}
            initializeGame={initializeGame}
            isCleared={isCleared}
            score={score}
          />
          <GameTimer expiryTimestamp={new Date(Date.now() + 1000 * 60 * 3)} />
          <div className={"container"}>
            <div
              aria-label={"神経衰弱のカードエリア"}
              className={"cards-container"}
              style={{
                gridTemplateRows: `repeat(${cardRowsCols[0]}, 1fr)`,
                gridTemplateColumns: `repeat(${cardRowsCols[1]}, 1fr)`,
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
      </main>
    </div>
  );
};
