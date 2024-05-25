import React, { useEffect, useState } from "react";
import "../App.css";
//Props
export default function Card({ card, selectedCards, setSelectedCards }) {
    // !めくれた状態の管理 初期値false trueになったら表側という意味
    const [isFripped, setIsFripped] = useState(false);
    // !選択したカードのリストが入ってくるヘルパー関数、各カードに仕込んでおく
    const handleClick = () => {
        // 同じカードが選択されたら、追加されないように、別のカードなら選択stateに
        !selectedCards.includes(card) &&
            setSelectedCards([...selectedCards, card]);
    };
    //!選んだカードは表向きのままにしておく処理。つまり仮想DOMの更新
    // 3枚目以降にクリックされたものは描画されない
    // stateでカードの裏表を管理させる
    // 裏表を実現するのはcss
    useEffect(() => {
        if (
            // 選んだカード１枚目表向きのままにしておく＝selectedCardsが描画処理のされている要素ならcssを表面にする。
            // ためのisFrippedをtrueにする
            selectedCards[0] === card ||
            // 選んだカード2枚目ももちろん表向きのままにしておく
            selectedCards[1] === card ||
            // マッチしているカードも表向きのままにしておく=cardsのcardのisMatchedでも管理する
            card.isMatched
        ) {
            setIsFripped(true);
        } else {
            // それ以外の場合は裏側にする(失敗したときも)
            setIsFripped(false);
        }
        // カードを選ぶたびにselectedCardsに更新がかかるので =実行がされる。
    }, [selectedCards]);
    // 以下grid表示領域、子要素＝カード
    return (
        // !各カード要素にhandleClickを設定する
        // handleClickはクリックしたcardをselectedCardsに追加する

        <div className="card" onClick={handleClick}>
            {isFripped ? (
                <div className="front">
                    <img src={card.img} alt="" />
                </div>
            ) : (
                <div className="back"></div>
            )}
        </div>

        // <div className={isFripped ? "card open" : "card"} onClick={handleClick}>
        //     <div className="front">
        //         <img src={card.img} alt="" />
        //     </div>
        //     <div className="back"></div>
        // </div>
    );
}
