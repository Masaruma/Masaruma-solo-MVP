import React, { useEffect, useState } from "react";
import Card from "./Card";
import "../App.css";

export default function GameMain() {
    // !シャッフルされたカードを格納しておく箱
    const [cards, setCards] = useState([]);
    // !カードの選択に利用する子要素で追加、useEffectで2枚選択で初期化
    const [selectedCards, setSelectedCards] = useState([]);
    // !手数計算
    const [score, setScore] = useState(0);
    // !ゲームがクリアされたか
    const [isCleared, setIsCleared] = useState(false);
    //!初期データ処理==================================================
    // データベースから持ってくるデータ
    let images = [
        { id: 1, img: "/images/animal_chara_radio_buta.png" },
        { id: 2, img: "/images/cooking_tousyoumen.png" },
        { id: 3, img: "/images/job_chocolatier_man.png" },
        { id: 4, img: "/images/komebukuro_apron_woman.png" },
        { id: 5, img: "/images/ofuro_sauna_neppashi_woman.png" },
        { id: 6, img: "/images/opera_singer_man.png" },
    ];

    // images = images.map((obj) => ({ ...obj, isMatched: false }));

    // 神経衰弱用に２枚ずつ増やす
    const doubleImages = [...images, ...images];
    // ? カードのシャッフルを行うヘルパー関数=================================
    const shuffleImages = () => {
        // カードのシャッフル用のidxを付与
        // マッチキー booleanを付与する
        let shuffled = doubleImages
            .map((obj, idx) => {
                return {
                    ...obj,
                    idx,
                    isMatched: false,
                };
            })
            .sort((a, b) => Math.random() - 0.5);
        // console.log("shuffled: ", shuffled);
        setCards(shuffled);
    };

    // !!①番目の処理 再読み込み時にuseEffectでカードのシャッフルを行う
    useEffect(() => {
        shuffleImages();
    }, []);
    //============================================================ß

    // ??神経衰弱の処理 ヘルパー関数===================
    // 何をアップデートしている？
    const checkMatch = () => {
        // １枚目のカードと2枚目のカードが選択後走る
        // cardsのisMatchをtrueに変更する
        // mapで一時的にコピー配列を作り
        if (
            selectedCards[0].id === selectedCards[1].id
            // && selectedCards[0].idx !== selectedCards[1].idx
        ) {
            console.log("マッチしました");
            let updatedCards = cards.map((card) => {
                //２回目のクリックで 0 と1のisMatchdをtrueに
                if (card.id === selectedCards[0].id) {
                    return { ...card, isMatched: true };
                }
                // そうじゃないものはそのまま。
                return card;
            });
            // stateの変更をかける
            setCards(updatedCards);
        } else {
            console.log("ミスマッチ");
        }
        // setSelectedCards([]);
    };
    // !!カードが選択されるたびに走る
    useEffect(() => {
        // カードを２つチェックしたらチェックマッチ関数を呼び出す
        if (selectedCards.length === 2) {
            console.log("チェックが走りました");
            setTimeout(() => {
                setSelectedCards([]);
            }, 1000);
            setScore((ele) => ele + 1);
            console.log(score);
            checkMatch();
        }
        console.log(cards);
        console.log(selectedCards);
    }, [selectedCards]);
    // !クリア処理
    useEffect(() => {
        if (cards.length === 0) return;
        const gameClear = cards.every((card) => card.isMatched);
        if (gameClear) {
            setTimeout(() => {
                alert("ゲームクリア");
                setIsCleared(gameClear);
            }, 500);
        }
    }, cards);
    //!useStateのstateの変更がかかるたびに変更箇所の描画が変更される（Reactの仕様）
    //今回はCardの部分
    return (
        <div className="game">
            {/*  リロードボタンと 名前入力欄 +スコア表示欄+ スコア送信欄(iscleared scoreをわたす)/}
            {/* スコアの計算方法はよう考察 時間と手数 とりあえず手数*/}
            {/* そのためにはスコアstateをここで持つ必要がある */}
            <div className="container">
                <div className="cards-container">
                    {/* cardsを直接変更するはしないが、コピーを元に神経衰弱を描画 */}
                    {cards.map((card) => {
                        return (
                            <Card
                                key={card.idx}
                                card={card}
                                selectedCards={selectedCards}
                                setSelectedCards={setSelectedCards}
                            ></Card>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
