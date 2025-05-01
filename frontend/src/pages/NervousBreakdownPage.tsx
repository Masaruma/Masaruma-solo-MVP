import { useState } from "react";

import { GameMain } from "@/components/GameMain.tsx";
import { Login } from "@/components/Login.tsx";
import { Ranking } from "@/components/Ranking.tsx";

import "@/pages/NervousBreakdownPage.css";

export type GameModeType = "irasutoya" | "pokemon";

export const NervousBreakdownPage = () => {
  // モード選択 ヘッダーにクリックで変更されるように mode選択で取ってくるデータとランキングのget、postを変更させる
  const [gameMode, setGameMode] = useState<GameModeType>("irasutoya");

  const [cardRowsCols, setCardRowsCols] = useState<[number, number]>([3, 4]);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  return (
    <>
      {/* webページの中心に位置させたいため */}
      {isSuccess ? (
        <div className={"wrapper"}>
          <header>
            <h1>神経衰弱:{gameMode}モード</h1>
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
                  onClick={() => {
                    setCardRowsCols([10, 10]);
                  }}
                >
                  10✖️10マス
                </button>
              </div>
              <div className={"tyuu"}>
                ※ゲームリセット,まだうまくいかないのでゲーム途中でのモード変更はうまくいきません
                <br />
                リロードしてください10×10はポケモンのみ。
              </div>
            </div>
          </header>
          {/* asideを追加したときに横並びにしたいため */}
          <div className={"main-container"}>
            {/* ゲーム画面とランキングの縦並びの位置を調整したいため */}
            <main className={"game-container"}>
              <Ranking cardRowsCols={cardRowsCols} gameMode={gameMode} />

              <GameMain cardRowsCols={cardRowsCols} gameMode={gameMode} />
            </main>
            <aside />
          </div>
        </div>
      ) : (
        <Login setSuccess={setIsSuccess} />
      )}
    </>
  );
};
