import { CardsWithMatchKeyType } from "@/pages/GameMainPage.tsx";

export const Card = ({
  card,
  handleCardClick,
  selectedCards,
  startWithCardClick,
}: {
  card: CardsWithMatchKeyType;
  handleCardClick: (card: CardsWithMatchKeyType) => void;
  selectedCards: CardsWithMatchKeyType[];
  startWithCardClick: () => void;
}) => {
  const isFlipped = selectedCards.includes(card) || card.isMatched;

  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events -- enterで押さないため
    <div
      className={`
        relative flex h-40 w-32.5 flex-col items-center justify-center
        bg-transparent
        max-sm:h-17.5 max-sm:w-[55px]
      `}
      onClick={() => {
        startWithCardClick();
        handleCardClick(card);
      }}
      role={"button"}
      style={{
        transformStyle: "preserve-3d",
        transition: "transform 0.3s",
        transform: isFlipped ? "rotateY(180deg)" : "rotateY(0deg)",
      }}
      tabIndex={0}
    >
      {/* 背面 */}
      <div
        aria-label={"裏のカード"}
        className={`
          absolute h-full w-full
          bg-[url('/images/illustkun-01476-back-of-cards.png')] bg-center
          bg-no-repeat shadow-[4px_4px_13px_5px_rgba(0,0,0,0.1)]
          bg-[length:150%]
        `}
        style={{
          position: "absolute",
          backfaceVisibility: "hidden",
        }}
      />
      <div
        aria-label={"表のカード"}
        className={card.isMatched ? 'animate-fade-out' : ''}
        style={{
          position: "absolute",
          backfaceVisibility: "hidden",
          transform: "rotateY(180deg)",
        }}
      >
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
    </div>
  );
};
