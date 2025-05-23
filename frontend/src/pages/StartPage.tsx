import { useState } from "react";

import { useNavigate } from "react-router-dom";

import { Ranking } from "@/components/Ranking.tsx";
import "@/pages/StartPage.css";
import { Button } from "@/components/ui/button.tsx";
import { culcurateGameLevel } from "@/utils/culcurateGameLevel.ts";

export type GameModeType = "irasutoya" | "pokemon";

export const StartPage = () => {
  const [gameMode, setGameMode] = useState<GameModeType>("irasutoya");
  const [cardRowsCols, setCardRowsCols] = useState<[number, number]>([0, 0]);
  const [gameStart, setGameStart] = useState({
    IsOkModeSelect: false,
    isOkNumberSelect: false,
  });

  const navigate = useNavigate();

  const gameModeArray: GameModeType[] = ["irasutoya", "pokemon"];

  // カードの枚数が偶数、4〜100枚まで許容するサイズリスト（例）
  const sizes: [number, number][] = [
    [2, 2],
    [2, 3],
    [2, 4],
    [2, 5],
    [2, 6],
    [2, 7],
    [2, 8],
    [2, 9],
    [2, 10],
    [4, 6],
    [4, 7],
    [4, 8],
    [4, 9],
    [4, 10],
    [5, 10],
    [6, 10],
    [7, 10],
    [8, 10],
    [9, 10],
    [10, 10],
  ];
  const gameSettingList = sizes.map((cols) => ({
    cardRowsCols: cols,
    numberOfCards: culcurateGameLevel(cols),
  }));

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
              {gameSettingList.map((gameSetting) => (
                <Button
                  key={gameSetting.numberOfCards}
                  onClick={() => {
                    setCardRowsCols(gameSetting.cardRowsCols);
                    setGameStart({
                      IsOkModeSelect: true,
                      isOkNumberSelect: true,
                    });
                  }}
                  size={"default"}
                  variant={
                    culcurateGameLevel(cardRowsCols) ===
                    culcurateGameLevel(gameSetting.cardRowsCols)
                      ? "default"
                      : "secondary"
                  }
                >
                  {gameSetting.numberOfCards}枚
                </Button>
              ))}
            </div>
          </div>
        )}
        {gameStart.isOkNumberSelect && (
          <>
            <Ranking cardRowsCols={cardRowsCols} gameMode={gameMode} />
            <Button
              onClick={() => {
                void navigate("/nervousbreakdown", {
                  state: { gameMode, cardRowsCols },
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
