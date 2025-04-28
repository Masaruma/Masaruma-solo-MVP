import { useRef } from "react";

import { GameModeType } from "@/pages/NervousbreakdownPage.tsx";

interface InputProps {
  gameMode: GameModeType;
  isCleared: boolean;
  score: number;
}

export const Input = ({ isCleared, score, gameMode }: InputProps) => {
  const nameInput = useRef<HTMLInputElement>(null);
  // todo Repositoryに直す
  const postScore = () => {

    const postData = {
      user: nameInput.current?.value,
      gameMode: gameMode,
      gameScore: score,
    };
    console.log("postData: ", postData);
    if (!postData.user) {
      alert("名前を入力してください!");
      return;
    }
    if (confirm("スコアを送信してもよろしいですか？")) {
      void fetch(`/api/score`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(postData),
      }).then((res) => res.status === 201 && alert("送信完了しました"));
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
