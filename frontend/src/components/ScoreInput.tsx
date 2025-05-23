import { useRef } from "react";

import { Button } from "@/components/ui/button.tsx";
import { GameModeType } from "@/pages/StartPage.tsx";
import * as GameScoreRepository from "@/repository/GameScoreRepository.ts";
import { culcurateGameLevel } from "@/utils/culcurateGameLevel.ts";
import { Input } from "@/components/ui/input.tsx";

interface InputProps {
  cardRowsCols: [number, number];
  gameMode: GameModeType;
  initializeGame: () => Promise<void>;
  isCleared: boolean;
  score: number;
}

export const ScoreInput = ({
  cardRowsCols,
  gameMode,
  initializeGame,
  isCleared,
  score,
}: InputProps) => {
  const nameInput = useRef<HTMLInputElement>(null);
  const postScore = async () => {
    const postData = {
      user: nameInput.current?.value ?? "",
      gameMode: gameMode,
      gameScore: score,
      gameLevel: culcurateGameLevel(cardRowsCols),
    };

    if (!postData.user) {
      alert("名前を入力してください!");
      return;
    }
    // if (confirm("スコアを送信してもよろしいですか？")) {
    const responseStatus = await GameScoreRepository.postGameScore(postData);
    if (responseStatus === 201) {
      alert("送信完了しました");
      void initializeGame();
    } else {
      alert("送信に失敗しました");
    }
    // }
  };

  return (
    <>
      <div className={"inputAndPostContainer"}>
        <div className={"nameInput"}>
          <Input
            placeholder={"名前を入れてね"}
            ref={nameInput}
            type={"text"}
            className={"bg-amber-50 border-gray-300 border-4"}
          />
        </div>
        <div className={"score"}>
          <div className={"scoreDisplay"}>現在の手数:{score}</div>

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
        </div>
      </div>
    </>
  );
};
