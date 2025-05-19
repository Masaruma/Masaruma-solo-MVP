import { useState } from "react";

import { GameMain } from "@/components/GameMain.tsx";
import { Login } from "@/components/Login.tsx";
import { Ranking } from "@/components/Ranking.tsx";

import "@/pages/NervousBreakdownPage.css";

export type GameModeType = "irasutoya" | "pokemon";

export const NervousBreakdownPage = () => {
  const [gameMode, setGameMode] = useState<GameModeType>("irasutoya");

  const [cardRowsCols, setCardRowsCols] = useState<[number, number]>([3, 4]);


  return (
    <>

        <div className={"wrapper"}>
          <header>
            <h1>
              神経衰弱:{gameMode} {cardRowsCols[0]}❌{cardRowsCols[1]}
            </h1>
            <div className={"mode"}>
              モードを選択してください
              <button className={""} onClick={() => setGameMode("irasutoya")}>
                イラスト屋
              </button>
              <button className={""} onClick={() => setGameMode("pokemon")}>
                ポケモン
              </button>
              <div className={"cell"}>
                マス目を選択してください
                <h6>10×10はポケモンのみ。</h6>
                <button
                  className={""}
                  onClick={() => {
                    setCardRowsCols([3, 4]);
                  }}
                >
                  3✖️4マス
                </button>
                <button
                  className={""}
                  onClick={() => {
                    setCardRowsCols([4, 5]);
                  }}
                >
                  4✖️5マス
                </button>
                <button
                  className={""}
                  onClick={() => {
                    setCardRowsCols([6, 8]);
                  }}
                >
                  6✖️8マス
                </button>
                <button
                  className={""}
                  disabled={gameMode === "irasutoya"}
                  onClick={() => {
                    setCardRowsCols([10, 10]);
                  }}
                >
                  10✖️10マス
                </button>
              </div>
            </div>
          </header>
          <div className={"main-container"}>
            <main className={"game-container"}>
              <Ranking cardRowsCols={cardRowsCols} gameMode={gameMode} />

              <GameMain cardRowsCols={cardRowsCols} gameMode={gameMode} />
            </main>
            <aside />
          </div>
        </div>

    </>
  );
};
