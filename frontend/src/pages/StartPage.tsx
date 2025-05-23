import { useState } from "react";

import { useNavigate } from "react-router-dom";

import { Ranking } from "@/components/Ranking.tsx";
import "@/pages/NervousBreakdownPage.css";
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

  const sizes: [number, number][] = [
    [2, 2],
    [3, 2],
    [3, 4],
    [4, 5],
    [6, 8],
    [10, 10],
  ];
  const gameSettingList = sizes.map((cols) => ({
    cardRowsCols: cols,
    numberOfCards: culcurateGameLevel(cols),
  }));

  return (
    <>
      <div className={"wrapper"}>
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
                  <button
                    className={""}
                    key={gameSetting.numberOfCards}
                    onClick={() => {
                      setCardRowsCols(gameSetting.cardRowsCols);
                      setGameStart({
                        IsOkModeSelect: true,
                        isOkNumberSelect: true,
                      });
                    }}
                  >
                    {gameSetting.numberOfCards}枚
                  </button>
                ))}
              </div>
            )}
            {gameStart.isOkNumberSelect && (
              <>
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
              </>
            )}
          </div>
        </header>
      </div>
    </>
  );
};
