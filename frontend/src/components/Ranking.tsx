import { useEffect, useState } from "react";

import { GameModeType } from "@/pages/NervousbreakdownPage.tsx";

interface RankingProps {
  gameMode: GameModeType;
}

export const Ranking = ({ gameMode }: RankingProps) => {
  const [table, setTable] = useState([]);

  useEffect(() => {
    console.log(table);
    console.log(typeof table[0]);
  }, [table]);

  // !初回更新でランキングデータ取得 モード変更で描画変更
  useEffect(() => {
    // todo Repositoryに直す
    fetch(`/api/score/${gameMode}`)
      .then((res) => res.json())
      .then((rank) => {
        const scoreTable = rank.map((obj:{createdAt:string, gameScore: number; id:number, user: string,}, tableIndex:number) => {
          return (
            <tr key={obj.id}>
              <th scope={"row"}>{tableIndex + 1}</th>
              <td>{new Date(obj.createdAt).toLocaleString()}</td>
              <td>{obj.user}</td>
              <td>{obj.gameScore}</td>
            </tr>
          );
        });
        setTable(scoreTable);
        return scoreTable;
      })
      .catch((err) => console.error(err));
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
          <tbody>{table}</tbody>
        </table>
      </div>
    </>
  );
};
