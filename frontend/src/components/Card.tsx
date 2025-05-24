import { Dispatch, SetStateAction, useEffect, useState } from "react";

import { CardsWithMatchKeyType } from "@/pages/GameMainPage.tsx";

interface CardProps {
  card: CardsWithMatchKeyType;
  onCardClick: () => void;
  selectedCards: CardsWithMatchKeyType[];
  setSelectedCards: Dispatch<SetStateAction<CardsWithMatchKeyType[]>>;
}

export const Card = ({
  card,
  onCardClick,
  selectedCards,
  setSelectedCards,
}: CardProps) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleClick = () => {
    // 同じカードが選択されたら、すでにマッチしているカードが追加されないように、別のカードなら選択stateに
    if (!selectedCards.includes(card) && !card.isMatched) {
      onCardClick();
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
    <div
      className={`
        relative flex h-40 w-32.5 flex-col items-center justify-center
        bg-transparent
        max-sm:h-17.5 max-sm:w-[55px]
      `}
      onClick={handleClick}
      role={"button"}
      tabIndex={0}
    >
      {isFlipped ? (
        <div aria-label={"表のカード"} className={"bg-transparent"}>
          <img
            alt={""}
            className={`
              h-[158px] w-[130px] rounded-[10px] border-[0.15rem] border-solid
              border-red-500 bg-white object-contain
              max-sm:h-[70px] max-sm:w-[55px]
            `}
            src={card.img}
          />
        </div>
      ) : (
        <div
          aria-label={"裏のカード"}
          className={`
            absolute h-full w-full cursor-pointer
            bg-[url('/images/illustkun-01476-back-of-cards.png')] bg-center
            bg-no-repeat shadow-[4px_4px_13px_5px_rgba(0,0,0,0.1)]
            bg-[length:150%]
          `}
        />
      )}
    </div>
  );
};
