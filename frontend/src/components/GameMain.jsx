import React, { useEffect, useState } from "react";
import Card from "./Card";
import Input from "./Input";
import "../App.css";
// 注意！stateを変更するときはそのまま変更はかけない！シャローコピー行って変更関数を使う
export default function GameMain({ mode, cell }) {
    console.log("初回処理が走りました"); //useEffectがrunするたびに走る
    // !シャッフルされたカードを格納しておく箱
    const [cards, setCards] = useState([]);
    // !カードの選択に利用する子要素で追加、useEffectで2枚選択で初期化
    const [selectedCards, setSelectedCards] = useState([]);
    // !手数計算
    const [score, setScore] = useState(0);
    // !ゲームがクリアされたか
    const [isCleared, setIsCleared] = useState(false);
    //!初期データ処理==================================================
    // ?randomな重複なしな数値をもった配列を生成するヘルパー関数 pokemon用
    const randomArray = () => {
        /** min以上max以下の整数値の乱数を返す */
        const intRandom = (min, max) => {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        };
        /** 重複チェック用配列 */
        const randoms = [];
        /** 最小値と最大値 */
        const min = 1,
            max = 1024;
        /** 生成する乱数の個数 */
        const count = cell;
        /** 重複チェックしながら乱数作成 */
        while (randoms.length < count) {
            const tmp = intRandom(min, max);
            if (!randoms.includes(tmp)) {
                randoms.push(tmp);
            }
        }
        return randoms;
    };
    // ?modeによりカードを選択するヘルパー関数
    // グローバル変数でimagesを定義
    let images = [];
    const gameCard = async () => {
        if (mode === "irasutoya") {
            images = [
                { id: 1, img: "/images/animal_chara_radio_buta.png" },
                { id: 2, img: "/images/cooking_tousyoumen.png" },
                { id: 3, img: "/images/job_chocolatier_man.png" },
                { id: 4, img: "/images/komebukuro_apron_woman.png" },
                { id: 5, img: "/images/ofuro_sauna_neppashi_woman.png" },
                { id: 6, img: "/images/animal_yukata_dog.png" },
                { id: 7, img: "/images/fashion_jinbei_woman.png" },
                { id: 8, img: "/images/fashion_jinbei.png" },
                { id: 9, img: "/images/opera_singer_man.png" },
                { id: 10, img: "/images/tsundere_girl.png" },
            ]
                .sort((a, b) => Math.random() - 0.5)
                .slice(0, cell);
        } else if (mode === "pokemon") {
            const randoms = randomArray();
            let i = 1;
            const loadImages = randoms.map(async (n) => {
                const pokemonSprite = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${n}.png`;
                // 先に読み込ませておく処理
                const imgElement = new Image();
                imgElement.src = pokemonSprite;
                await new Promise((resolve) => {
                    imgElement.onload = () => {
                        images.push({ id: i, img: imgElement.src });
                        i++;
                        resolve();
                    };
                });
            });

            await Promise.all(loadImages);
        }
    };

    // ? カードのシャッフルを行うヘルパー関数=================================
    const shuffleImages = () => {
        // 神経衰弱用に２枚ずつ増やす
        const doubleImages = [...images, ...images];
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
        (async () => {
            console.log("カードがシャッフルされました");
            // ゲームカードの選択
            await gameCard();
            console.log("images: ", images);
            // シャッフル、事前配列処理
            shuffleImages();
        })();
    }, [mode, cell]);
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
            console.log("2枚選択されました");
            setTimeout(() => {
                setSelectedCards([]);
            }, 800);
            // 手数の計算
            setScore((ele) => ele + 1);
            console.log(score);
            checkMatch();
        }
        console.log(cards);
        console.log(selectedCards);
    }, [selectedCards]);
    // !クリア処理
    useEffect(() => {
        console.log("running クリアEffect");
        if (cards.length === 0) return;
        const gameClear = cards.every((card) => card.isMatched);
        if (gameClear) {
            setTimeout(() => {
                alert("ゲームクリア");
                // clearフラグをon
                setIsCleared(gameClear);
            }, 500);
        }
    }, cards);
    //!useStateのstateの変更がかかるたびに変更箇所の描画が変更される（Reactの仕様）
    //今回はCardの部分
    return (
        <div className="game">
            {/* リロードボタンと 名前入力欄 +スコア表示欄+ スコア送信欄(iscleared scoreをわたす)/}
            {/* スコアの計算方法はよう考察 時間と手数 とりあえず手数*/}
            <Input isCleared={isCleared} score={score} mode={mode} />
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
