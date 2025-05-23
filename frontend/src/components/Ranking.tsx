import { useEffect, useState } from "react";

import { GameModeType } from "@/pages/StartPage.tsx";
import * as GameScoreRepository from "@/repository/GameScoreRepository.ts";
import { GetGameScoreType } from "@/repository/GameScoreRepository.ts";

interface RankingProps {
  cardRowsCols: [number, number];

  gameMode: GameModeType;
}

export const Ranking = ({ cardRowsCols, gameMode }: RankingProps) => {
  const [getResult, setGetResult] = useState<GetGameScoreType[]>([]);

  // !初回更新でランキングデータ取得 モード変更で描画変更
  useEffect(() => {
    void (async () => {
      const getScoreResult = await GameScoreRepository.getGameScores(
        gameMode,
        cardRowsCols
      );
      setGetResult(getScoreResult);
    })();
  }, [cardRowsCols, gameMode]);
  return (
    <>
      <div
        aria-label={"ランキング"}
        className={`
          m-4 w-full rounded-2xl bg-transparent p-2.5
          shadow-[4px_4px_13px_5px_rgba(0,0,0,0.25)] backdrop-blur-xl
        `}
      >
        <h1 className={"mb-2 text-center text-3xl"}>👑Ranking👑</h1>
        <table border={1} className={"w-full table-fixed border-spacing-0"}>
          <thead>
            <tr>
              {["Ranking", "Date", "User", "score", "level"].map((label) => (
                <th
                  className={`
                    bg-gradient-to-b from-[#ffb2c1] to-[#b473bf] px-4 py-2
                    text-center text-base font-bold
                  `}
                  key={label}
                >
                  {label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {getResult.map((obj, tableIndex) => {
              return (
                <tr
                  className={"border-b-1 border-solid border-[#b473bf]"}
                  key={obj.id}
                >
                  <th
                    className={`
                      bg-gradient-to-b from-[#ffb2c1] to-[#b473bf] px-4 py-2
                      text-center text-base font-bold
                    `}
                    scope={"row"}
                  >
                    {tableIndex + 1}
                  </th>
                  <td>{new Date(obj.createdAt).toLocaleString()}</td>
                  <td>{obj.user}</td>
                  <td>{obj.gameScore}手</td>
                  <td>{obj.gameLevel}マス</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
};
