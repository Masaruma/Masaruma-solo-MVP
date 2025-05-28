import { useState } from "react";

import { useNavigate } from "react-router-dom";

import { Ranking } from "@/components/Ranking.tsx";
import { Button } from "@/components/ui/button.tsx";

export type GameModeType = "irasutoya" | "pokemon";

export const StartPage = () => {
  const [gameMode, setGameMode] = useState<GameModeType>("irasutoya");
  const [selectedNumberOfCard, setSelectedNumberOfCard] = useState<number>(0);
  const [gameStart, setGameStart] = useState({
    IsOkModeSelect: false,
    isOkNumberSelect: false,
  });

  const navigate = useNavigate();

  const gameModeArray: GameModeType[] = ["irasutoya", "pokemon"];

  // カードの枚数が偶数、4〜100枚まで許容するサイズリスト（例）
  const numberOfCardArray = [
    ...Array.from({ length: (60 - 4) / 2 + 1 }, (_, i) => 4 + i * 2),
    ...Array.from({ length: (100 - 60) / 10 }, (_, i) => 60 + (i + 1) * 10),
  ];

  return (
    <div className={"flex h-lvh w-full flex-col items-center justify-center"}>
      <h1 className={"m-2.5 w-1/2 text-5xl"}>神経衰弱:{gameMode}</h1>
      <div className={"m-2.5 w-1/2"}>
        モードを選択してください
        <div className={"m-2.5 grid grid-cols-2 gap-2"}>
          {gameModeArray.map((mode) => (
            <Button
              className={""}
              key={mode}
              onClick={() => {
                setGameMode(mode);
                setGameStart({
                  IsOkModeSelect: true,
                  isOkNumberSelect: false,
                });
              }}
              size={"default"}
              variant={gameMode === mode ? "default" : "secondary"}
            >
              {mode}
            </Button>
          ))}
        </div>
        {gameStart.IsOkModeSelect && (
          <div aria-label={"カードの枚数を選択"} className={"w-full"}>
            マス目を選択してください
            <h6>10×10はポケモンのみ。</h6>
            <div className={"m-2.5 grid grid-cols-10 grid-rows-3 gap-2"}>
              {numberOfCardArray.map((numberOfCard) => (
                <Button
                  key={numberOfCard}
                  onClick={() => {
                    setSelectedNumberOfCard(numberOfCard);
                    setGameStart({
                      IsOkModeSelect: true,
                      isOkNumberSelect: true,
                    });
                  }}
                  size={"default"}
                  variant={
                    selectedNumberOfCard === numberOfCard
                      ? "default"
                      : "secondary"
                  }
                >
                  {numberOfCard}枚
                </Button>
              ))}
            </div>
          </div>
        )}
        {gameStart.isOkNumberSelect && (
          <>
            <Ranking
              gameMode={gameMode}
              selectedNumberOfCard={selectedNumberOfCard}
            />
            <Button
              onClick={() => {
                void navigate("/nervousbreakdown", {
                  state: {
                    gameMode,
                    selectedNumberOfCard: selectedNumberOfCard,
                  },
                });
              }}
              size={"lg"}
              variant={"outline"}
            >
              ゲームスタート
            </Button>
          </>
        )}
      </div>
    </div>
  );
};
