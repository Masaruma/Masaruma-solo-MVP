import "../pages/NervousBreakdownPage.css";
import { Dispatch, SetStateAction, useEffect, useState } from "react";

import { CardsWithMatchKeyType } from "@/components/GameMain.tsx";

interface CardProps {
  card: CardsWithMatchKeyType;
  selectedCards: CardsWithMatchKeyType[];
  setSelectedCards: Dispatch<SetStateAction<CardsWithMatchKeyType[]>>;
}

export const Card = ({ card, selectedCards, setSelectedCards }: CardProps) => {
  const [isFripped, setIsFripped] = useState(false);
  // !選択したカードのリストが入ってくるヘルパー関数、各カードに仕込んでおく
  const handleClick = () => {
    // 同じカードが選択されたら、すでにマッチしているカードが追加されないように、別のカードなら選択stateに
    !selectedCards.includes(card) &&
      !card.isMatched &&
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
  }, [selectedCards, card]);

  return (
    // !各カード要素にhandleClickを設定する
    // handleClickはクリックしたcardをselectedCardsに追加する

    // eslint-disable-next-line jsx-a11y/click-events-have-key-events -- enterで押さないため
    <div className={"card"} onClick={handleClick} role={"button"} tabIndex={0}>
      {isFripped ? (
        <div className={"front"}>
          <img alt={""} src={card.img} />
        </div>
      ) : (
        <div className={"back"} />
      )}
    </div>
  );
};
