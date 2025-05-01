import { useEffect, useState } from "react";

import "../pages/NervousBreakdownPage.css";
import { Card } from "@/components/Card.tsx";
import { Input } from "@/components/Input.tsx";
import { useInitializeGame } from "@/hooks/useInitializeGame.ts";
import { GameModeType } from "@/pages/NervousBreakdownPage.tsx";

interface GameMainProps {
  cardRowsCols: [number, number];
  gameMode: GameModeType;
}

export type CardImageType = {
  id: number;
  img: string;
};
export type CardsWithMatchKeyType = CardImageType & {
  idx: number;
  isMatched: boolean;
};

export const GameMain = ({ gameMode, cardRowsCols }: GameMainProps) => {
  const [selectedCards, setSelectedCards] = useState<CardsWithMatchKeyType[]>(
    []
  );
  const [score, setScore] = useState(0);
  const [isCleared, setIsCleared] = useState(false);
  //!初期データ処理==================================================
  const { cards, initializeGame, setCards } = useInitializeGame(
    gameMode,
    cardRowsCols
  );
  useEffect(() => {
    void initializeGame();
    setIsCleared(false);
    setScore(0);
  }, [initializeGame]);

  // ??神経衰弱の処理 ヘルパー関数===================
  const checkMatch = () => {
    // １枚目のカードと2枚目のカードが選択後走る
    // cardsのisMatchをtrueに変更する
    // mapで一時的にコピー配列を作り
    if (selectedCards[0].id === selectedCards[1].id) {
      console.log("マッチしました");
      let updatedCards = cards.map((card) => {
        //２回目のクリックで 0 と1のisMatchdをtrueに
        if (card.id === selectedCards[0].id) {
          return { ...card, isMatched: true };
        }
        // そうじゃないものはそのまま。
        return card;
      });
      setCards(updatedCards);
    } else {
      console.log("ミスマッチ");
    }
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
      checkMatch();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps -- 手数がバグるため
  }, [selectedCards]);

  useEffect(() => {
    console.log("running クリアEffect");
    if (cards.length === 0) return;
    const isGameClear = cards.every((card) => card.isMatched);
    if (isGameClear) {
      setTimeout(() => {
        alert("ゲームクリア");
        setIsCleared(isGameClear);
      }, 500);
    }
  }, [cards]);

  return (
    <div className={"game"}>
      <Input
        cardRowsCols={cardRowsCols}
        gameMode={gameMode}
        initializeGame={initializeGame}
        isCleared={isCleared}
        score={score}
      />
      <div className={"container"}>
        <div
          className={"cards-container"}
          style={{
            gridTemplateRows: `repeat(${cardRowsCols[0]}, 1fr)`,
            gridTemplateColumns: `repeat(${cardRowsCols[1]}, 1fr)`,
          }}
        >
          {/* cardsを直接変更するはしないが、コピーを元に神経衰弱を描画 */}
          {cards.map((card) => {
            return (
              <Card
                card={card}
                key={card.idx}
                selectedCards={selectedCards}
                setSelectedCards={setSelectedCards}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
};
