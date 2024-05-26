import React, { useState } from "react";
// import reactLogo from "./assets/react.svg";
// import viteLogo from "/vite.svg";
import "./App.css";
import Ranking from "./components/Ranking";
import GameMain from "./components/GameMain";

function App() {
    // モード選択 ヘッダーにクリックで変更されるように mode選択で取ってくるデータとランキングのget、postを変更させる
    const [mode, setMode] = useState("irasutoya");
    return (
        <>
            {/* webページの中心に位置させたいため */}
            <div className="wrapper">
                <header>
                    <h1>神経衰弱{mode}</h1>
                    <div className="mode">
                        モードを選択してください
                        <button
                            className=""
                            onClick={() => setMode("irasutoya")}
                        >
                            イラスト屋
                        </button>
                        <button className="" onClick={() => setMode("pokemon")}>
                            ポケモン
                        </button>
                    </div>
                </header>
                {/* asideを追加したときに横並びにしたいため */}
                <div className="main-container">
                    {/* ゲーム画面とランキングの縦並びの位置を調整したいため */}
                    <main className="game-container">
                        <Ranking mode={mode}></Ranking>

                        <GameMain mode={mode}></GameMain>
                    </main>
                    <aside></aside>
                </div>
            </div>
        </>
    );
}

export default App;
