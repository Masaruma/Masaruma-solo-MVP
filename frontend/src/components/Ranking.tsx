import { useEffect, useState } from "react";

import { GameModeType } from "@/pages/NervousbreakdownPage.tsx";
import * as GameScoreRepository from "@/repository/GameScoreRepository.ts";
import { GetGameScoreType } from "@/repository/GameScoreRepository.ts";
interface RankingProps {
  gameMode: GameModeType;
}

export const Ranking = ({ gameMode }: RankingProps) => {
  const [getResult, setGetResult] = useState<GetGameScoreType[]>([]);

  // !初回更新でランキングデータ取得 モード変更で描画変更
  useEffect(() => {
    void (async () => {
      const getScoreResult = await GameScoreRepository.getGameScores(gameMode);
      setGetResult(getScoreResult);
    })();
  }, [gameMode]);
  return (
    <>
      <div className={"rank"}>
        <h2>👑Ranking👑</h2>
        <table border={1}>
          <thead>
            <tr>
              <th scope={"col"}>Ranking</th>
              <th scope={"col"}>Date</th>
              <th scope={"col"}>User</th>
              <th scope={"col"}>score</th>
            </tr>
          </thead>
          <tbody>
            {getResult.map((obj, tableIndex) => {
              return (
                <tr key={obj.id}>
                  <th scope={"row"}>{tableIndex + 1}</th>
                  <td>{new Date(obj.createdAt).toLocaleString()}</td>
                  <td>{obj.user}</td>
                  <td>{obj.gameScore}</td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
};
