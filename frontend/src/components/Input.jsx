import React, { useEffect, useRef } from "react";

export default function Input({ isCleared, score, mode }) {
    const nameInput = useRef();
    // todo Repositoryに直す
    const postScore = () => {
        // post処理
        const postData = {
            user: nameInput.current.value,
            date: new Date().toLocaleString(),
            score: score,
        };
        console.log("postData: ", postData);
        if (!postData.user) {
            alert("名前を入力してください!");
            return;
        }
        console.log(mode);
        if (confirm("スコアを送信してもよろしいですか？")) {
            fetch(`/api/score/${mode}`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(postData),
            })
                .then((res) => res.json())
                .then((res) => {
                    alert("送信完了しました");
                });
        }
    };

    // console.log(isCleared);
    return (
        <>
            <div className="inputAndPostContainer">
                <div className="nameInput">
                    <input
                        className="textbox"
                        ref={nameInput}
                        type="text"
                        placeholder="名前を入れてね"
                    />
                </div>
                <div className="score">
                    <div className="scoreDisplay">現在の手数:{score}</div>

                    {isCleared && (
                        <button className="scorePost" onClick={postScore}>
                            スコアを送信する
                        </button>
                    )}
                    {/* <button className="scorePost" onClick={postScore}>
                        スコアを送信する
                    </button> */}
                </div>
            </div>
        </>
    );
}
