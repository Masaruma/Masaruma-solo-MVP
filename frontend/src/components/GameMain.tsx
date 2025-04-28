import { useEffect, useState } from "react";

import "../pages/NervousbreakdownPage.css";
import { Card } from "@/components/Card.tsx";
import { Input } from "@/components/Input.tsx";
import { useInitializeGame } from "@/hooks/useInitializeGame.ts";
import { GameModeType } from "@/pages/NervousbreakdownPage.tsx";

interface GameMainProps {
  gameMode: GameModeType;
  RC: [number, number];
}

export type CardImageType = {
  id: number;
  img: string;
};
export type CardsWithMatchKeyType = CardImageType & {
  idx: number;
  isMatched: boolean;
};

export const GameMain = ({ gameMode, RC }: GameMainProps) => {
  // !カードの選択に利用する子要素で追加、useEffectで2枚選択で初期化
  const [selectedCards, setSelectedCards] = useState<CardsWithMatchKeyType[]>(
    []
  );
  // !手数計算
  const [score, setScore] = useState(0);
  // !ゲームがクリアされたか
  const [isCleared, setIsCleared] = useState(false);
  //!初期データ処理==================================================
  const { cards, initializeGame, setCards } = useInitializeGame(gameMode, RC);
  useEffect(() => {
    void initializeGame();
    setIsCleared(false);
    setScore(0);
    //   todo clearedとscoreの初期化
  }, [initializeGame]);

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
      checkMatch();
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps -- 手数がバグるため
  }, [selectedCards]);

  // !クリア処理
  useEffect(() => {
    console.log("running クリアEffect");
    if (cards.length === 0) return;
    const isGameClear = cards.every((card) => card.isMatched);
    if (isGameClear) {
      setTimeout(() => {
        alert("ゲームクリア");
        // clearフラグをon
        setIsCleared(isGameClear);
      }, 500);
    }
  }, [cards]);
  //!useStateのstateの変更がかかるたびに変更箇所の描画が変更される（Reactの仕様）
  //今回はCardの部分
  return (
    <div className={"game"}>
      {/* リロードボタンと 名前入力欄 +スコア表示欄+ スコア送信欄(iscleared scoreをわたす)/}
            {/* スコアの計算方法はよう考察 時間と手数 とりあえず手数*/}
      <Input
        gameMode={gameMode}
        initializeGame={initializeGame}
        isCleared={isCleared}
        score={score}
      />
      <div className={"container"}>
        <div
          className={"cards-container"}
          style={{
            gridTemplateRows: `repeat(${RC[0]}, 1fr)`,
            gridTemplateColumns: `repeat(${RC[1]}, 1fr)`,
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
