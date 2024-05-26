import React, { useEffect, useState } from "react";

function Ranking({ mode }) {
    const [rank, setRank] = useState([]);
    // rankingの描画変更用
    const [table, setTable] = useState([]);
    // useEffect getでサーバーから画像を取得とりあえず仮のデータを置いておく
    // !sampleData
    const rankSample = [
        {
            id: 1,
            date: new Date().toISOString().replace("T", " ").split(".")[0],
            user: "まっちゃん",
            score: 1000,
        },
        {
            id: 2,
            date: new Date().toLocaleString("ja-JP", {
                timeZone: "Asia/Tokyo",
            }),
            user: "まっちゃん",
            score: 1100,
        },
    ];
    // useStateにしたほうがいいかも？
    const scoreTable = rank
        // .sort((a, b) => b.score - a.score)
        .map((obj, idx) => {
            // console.log("idx: ", idx);
            return (
                // eslint-disable-next-line react/jsx-key
                <tr key={obj.id}>
                    <th scope="row">{idx + 1}</th>
                    <td>{obj.date}</td>
                    <td>{obj.user}</td>
                    <td>{obj.score}</td>
                </tr>
            );
        });
    // !初回更新でランキングデータ取得
    useEffect(() => {
        const data = fetch(`/api/score/${mode}`)
            .then((res) => res.json())
            .then((res) => {
                console.log("res: ", res);
                setRank(res);
                return res;
            })
            .catch((err) => console.log(err));

        // Json.stringifyするかどうか
        // スコアが更新されるたびgetするかどうか
    }, []);
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
