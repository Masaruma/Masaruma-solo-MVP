import { useState } from "react";

import "./App.css";
import { GameMain } from "@/components/GameMain.tsx";
import { Login } from "@/components/Login.tsx";
import { Ranking } from "@/components/Ranking.tsx";

export const App = () => {
  // モード選択 ヘッダーにクリックで変更されるように mode選択で取ってくるデータとランキングのget、postを変更させる
  const [mode, setMode] = useState("irasutoya");

  const [gameLevel, setGameLevel] = useState([3, 4]);
  const [isSuccess, setIsSuccess] = useState(false);

  return (
    <>
      {/* webページの中心に位置させたいため */}
      {isSuccess ? (
        <div className={"wrapper"}>
          <header>
            <h1>神経衰弱:{mode}モード</h1>
            <div className={"mode"}>
              モードを選択してください
              <button className={""} onClick={() => setMode("irasutoya")}>
                イラスト屋
              </button>
              <button className={""} onClick={() => setMode("pokemon")}>
                ポケモン
              </button>
              <div className={"cell"}>
                マス目を選択してください
                <button
                  className={""}
                  onClick={() => {
                    setGameLevel([3, 4]);
                  }}
                >
                  3✖️4マス
                </button>
                <button
                  className={""}
                  onClick={() => {
                    setGameLevel([4, 5]);
                  }}
                >
                  4✖️5マス
                </button>
                <button
                  className={""}
                  onClick={() => {
                    setGameLevel([6, 8]);
                  }}
                >
                  6✖️8マス
                </button>
                <button
                  className={""}
                  onClick={() => {
                    setGameLevel([10, 10]);
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
              <Ranking mode={mode} />

              <GameMain RC={gameLevel} mode={mode} />
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
