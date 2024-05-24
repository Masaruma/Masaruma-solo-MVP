import React from "react";

function Ranking() {
    // useEffect getでサーバーから画像を取得とりあえず仮のデータを置いておく
    // 日付、名前、スコア
    const tempScore = [
        { id: 1, date: new Date().toString(), name: "まっちゃん", score: 1000 },
        { id: 2, date: new Date().toString(), name: "まっちゃん", score: 1100 },
        { id: 3, date: new Date().toString(), name: "まっちゃん", score: 1200 },
        { id: 4, date: new Date().toString(), name: "まっちゃん", score: 1300 },
    ];
    // ソートする必要あるかも(データベースでorderbyでもOK)
    // TODO temScoreはデータベースから引っ張ってきたデータに置き換える。
    const scoreTable = tempScore
        .sort((a, b) => b.score - a.score)
        .map((obj, idx) => {
            // console.log("idx: ", idx);
            return (
                // eslint-disable-next-line react/jsx-key
                <tr key={obj.id}>
                    <th scope="row">{idx + 1}</th>
                    <td>{obj.date}</td>
                    <td>{obj.name}</td>
                    <td>{obj.score}</td>
                </tr>
            );
        });
    return (
        <>
            <div className="RankDiv">
                <h2>Ranking</h2>
                <table border="1">
                    <thead>
                        <tr>
                            <th scope="col">Ranking</th>
                            <th scope="col">Date</th>
                            <th scope="col">Name</th>
                            <th scope="col">score</th>
                        </tr>
                    </thead>
                    <tbody>{scoreTable}</tbody>
                </table>
            </div>
        </>
    );
}

export default Ranking;
