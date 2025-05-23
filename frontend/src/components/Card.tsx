import { Dispatch, SetStateAction, useEffect, useState } from "react";

import { CardsWithMatchKeyType } from "@/components/GameMain.tsx";

interface CardProps {
  card: CardsWithMatchKeyType;
  selectedCards: CardsWithMatchKeyType[];
  setSelectedCards: Dispatch<SetStateAction<CardsWithMatchKeyType[]>>;
}

export const Card = ({ card, selectedCards, setSelectedCards }: CardProps) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleClick = () => {
    // 同じカードが選択されたら、すでにマッチしているカードが追加されないように、別のカードなら選択stateに
    if (!selectedCards.includes(card) && !card.isMatched) {
      setSelectedCards([...selectedCards, card]);
    }
  };

  useEffect(() => {
    // 選んだカード表向きか裏向きか決定する
    setIsFlipped(
      selectedCards[0] === card || selectedCards[1] === card || card.isMatched
    );
  }, [selectedCards, card]);

  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events -- enterで押さないため
    <div className={"card"} onClick={handleClick} role={"button"} tabIndex={0}>
      {isFlipped ? (
        <div className={"front"}>
          <img alt={""} src={card.img} />
        </div>
      ) : (
        <div className={"back"} />
      )}
    </div>
  );
};
