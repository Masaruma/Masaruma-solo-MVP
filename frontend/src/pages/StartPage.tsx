import { useState } from "react";

import { useNavigate } from "react-router-dom";

import { Ranking } from "@/components/Ranking.tsx";
import "@/pages/StartPage.css";
import { culcurateGameLevel } from "@/utils/culcurateGameLevel.ts";
import { Button } from "@/components/ui/button.tsx";

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
    <header>
      <h1>神経衰弱:{gameMode}</h1>
      <div className={"mode"}>
        モードを選択してください
        {gameModeArray.map((mode) => (
          <button
            className={""}
            key={mode}
            onClick={() => {
              setGameMode(mode);
              setGameStart({
                IsOkModeSelect: true,
                isOkNumberSelect: false,
              });
            }}
          >
            {mode}
          </button>
        ))}
        {gameStart.IsOkModeSelect && (
          <div aria-label={"カードの枚数を選択"} className={"cell"}>
            マス目を選択してください
            <h6>10×10はポケモンのみ。</h6>
            {gameSettingList.map((gameSetting) => (
              <Button key={gameSetting.numberOfCards} onClick={() => {
                setCardRowsCols(gameSetting.cardRowsCols);
                setGameStart({
                  IsOkModeSelect: true,
                  isOkNumberSelect: true,
                });
              }}

              variant={"secondary"}>{gameSetting.numberOfCards}枚</Button>
            ))}
          </div>
        )}
        {gameStart.isOkNumberSelect && (
          <div>
            <Ranking cardRowsCols={cardRowsCols} gameMode={gameMode} />
            <button
              className={""}
              onClick={() => {
                void navigate("/nervousbreakdown", {
                  state: { gameMode, cardRowsCols },
                });
              }}
            >
              ゲームスタート
            </button>
          </div>
        )}
      </div>
    </header>
  );
};
