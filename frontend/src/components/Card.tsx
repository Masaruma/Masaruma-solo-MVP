import { CardsWithMatchKeyType } from "@/pages/GameMainPage.tsx";

export const Card = ({
  card,
  handleCardClick,
  helperFlipCards,
  selectedCards,
  startWithCardClick,
}: {
  card: CardsWithMatchKeyType;
  handleCardClick: (card: CardsWithMatchKeyType) => void;
  helperFlipCards: CardsWithMatchKeyType[];
  selectedCards: CardsWithMatchKeyType[];
  startWithCardClick: () => void;
}) => {
  const isFlipped =
    selectedCards.includes(card) ||
    card.isMatched ||
    helperFlipCards.includes(card);

  return (
    // eslint-disable-next-line jsx-a11y/click-events-have-key-events -- enterで押さないため
    <div
      className={`
        relative flex h-[134px] w-[107px] flex-col items-center justify-center
        bg-transparent 
        max-sm:h-[70px] max-sm:w-[58px]
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
          background absolute h-full w-full bg-[url('/images/cardImage.png')]
          bg-center bg-no-repeat bg-[length:100%_100%]
          shadow-[4px_4px_13px_5px_rgba(0,0,0,0.1)]
  
        `}
        style={{
          position: "absolute",
          backfaceVisibility: "hidden",
        }}
      />
      <div
        aria-label={"表のカード"}
        className={card.isMatched ? "animate-fade-out" : ""}
        style={{
          position: "absolute",
          backfaceVisibility: "hidden",
          transform: "rotateY(180deg)",
        }}
      >
        <img
          alt={""}
          className={`
            h-[134px] w-[107px] overflow-hidden rounded-[10px] border-[0.2rem]
            border-solid border-[#7a0000] bg-white object-contain
            max-sm:h-[70px] max-sm:w-[58px]
          `}
          src={card.img}
        />
      </div>
    </div>
  );
};
