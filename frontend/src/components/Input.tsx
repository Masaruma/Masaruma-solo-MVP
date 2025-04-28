import { useRef } from "react";

import { GameModeType } from "@/pages/NervousbreakdownPage.tsx";
import * as GameScoreRepository from "@/repository/GameScoreRepository.ts";

interface InputProps {
  gameMode: GameModeType;
  initializeGame: () => Promise<void>;
  isCleared: boolean;

  score: number;
}

export const Input = ({
  isCleared,
  score,
  gameMode,
  initializeGame,
}: InputProps) => {
  const nameInput = useRef<HTMLInputElement>(null);
  // todo Repositoryに直す
  const postScore = async () => {
    const postData = {
      user: nameInput.current?.value ?? "",
      gameMode: gameMode,
      gameScore: score,
    };

    if (!postData.user) {
      alert("名前を入力してください!");
      return;
    }
    if (confirm("スコアを送信してもよろしいですか？")) {
      const responseStatus = await GameScoreRepository.postGameScore(postData);
      if (responseStatus === 201) {
        alert("送信完了しました");
        void initializeGame();
      } else {
        alert("送信に失敗しました");
      }
    }
  };

  return (
    <>
      <div className={"inputAndPostContainer"}>
        <div className={"nameInput"}>
          <input
            className={"textbox"}
            placeholder={"名前を入れてね"}
            ref={nameInput}
            type={"text"}
          />
        </div>
        <div className={"score"}>
          <div className={"scoreDisplay"}>現在の手数:{score}</div>

          {isCleared && (
            <button className={"scorePost"} onClick={postScore}>
              スコアを送信する
            </button>
          )}
        </div>
      </div>
    </>
  );
};
