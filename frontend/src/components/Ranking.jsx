import React, { useEffect, useState } from "react";

function Ranking({ mode }) {
    const [rank, setRank] = useState([]);
    // rankingの描画変更用
    const [table, setTable] = useState([]);

    // !初回更新でランキングデータ取得 モード変更で描画変更
    useEffect(() => {
        const data = fetch(`/api/score/${mode}`)
            .then((res) => res.json())

            .then((rank) => {
                const scoreTable = rank.map((obj, idx) => {
                    return (
                        <tr key={obj.id}>
                            <th scope="row">{idx + 1}</th>
                            <td>{obj.date}</td>
                            <td>{obj.user}</td>
                            <td>{obj.score}</td>
                        </tr>
                    );
                });
                setTable(scoreTable);
                return table;
            })
            .catch((err) => console.error(err));
    }, [mode]);
    return (
        <>
            <div className="RankDiv">
                <h2>Ranking</h2>
                <table border="1">
                    <thead>
                        <tr>
                            <th scope="col">Ranking</th>
                            <th scope="col">Date</th>
                            <th scope="col">User</th>
                            <th scope="col">score</th>
                        </tr>
                    </thead>
                    <tbody>{table}</tbody>
                </table>
            </div>
        </>
    );
}

export default Ranking;
