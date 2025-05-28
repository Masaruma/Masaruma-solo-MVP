import { useRef } from "react";

import { Button } from "@/components/ui/button.tsx";
import { Input } from "@/components/ui/input.tsx";
import { GameModeType } from "@/pages/StartPage.tsx";
import * as GameScoreRepository from "@/repository/GameScoreRepository.ts";

interface InputProps {
  elapsedTimeMillis: number;
  gameMode: GameModeType;
  initializeGame: () => Promise<void>;
  isCleared: boolean;
  missCount: number;
  score: number;
  selectedNumberOfCards: number;
}

export const ScoreInput = ({
  elapsedTimeMillis,
  gameMode,
  initializeGame,
  isCleared,
  missCount,
  score,
  selectedNumberOfCards,
}: InputProps) => {
  const nameInput = useRef<HTMLInputElement>(null);
  const postScore = async () => {
    const user = nameInput.current?.value ?? "";
    if (!user) {
      alert("名前を入力してください!");
      return;
    }
    const responseStatus = await GameScoreRepository.postGameScore({
      user,
      gameMode: gameMode,
      gameScore: score,
      gameLevel: selectedNumberOfCards,
      elapsedTimeMillis: elapsedTimeMillis,
      missCount: missCount,
    });
    if (responseStatus === 201) {
      alert("送信完了しました");
      void initializeGame();
    } else {
      alert("送信に失敗しました");
    }
  };

  return (
    <>
      <div className={""}>
        <Input
          className={"border-4 border-gray-300 bg-amber-50"}
          placeholder={"名前を入れてね"}
          ref={nameInput}
          type={"text"}
        />
      </div>
      {isCleared && (
        <Button
          className={"scorePost"}
          onClick={postScore}
          size={"default"}
          variant={"outline"}
        >
          スコアを送信する
        </Button>
      )}
    </>
  );
};
