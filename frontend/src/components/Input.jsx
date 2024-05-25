import React, { useEffect, useRef } from "react";

export default function Input({ isCleared, score, mode }) {
    const nameInput = useRef();
    const postScore = () => {
        // post処理
        const postData = { name: nameInput.current.value, score: score };
        console.log("postData: ", postData.name);
        if (!postData.name) {
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
                        ref={nameInput}
                        type="text"
                        placeholder="your name"
                    />
                </div>
                <div className="score">
                    <div className="scoreDisplay">現在の手数:{score}</div>

                    {isCleared && (
                        <button className="scorePost" onClick={postScore}>
                            スコアを送信する
                        </button>
                    )}
                    <button className="scorePost" onClick={postScore}>
                        スコアを送信する
                    </button>
                </div>
            </div>
        </>
    );
}
