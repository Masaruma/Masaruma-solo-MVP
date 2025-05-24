import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";
import { beforeEach, expect, MockInstance } from "vitest";

import { ScoreInput } from "@/components/ScoreInput.tsx";
import * as GameScoreRepository from "@/repository/GameScoreRepository.ts";

vi.mock("@/repository/GameScoreRepository.ts");

describe(`ScoreInput.name`, () => {
  let alertSpy: MockInstance<(message?: any) => void>;
  beforeEach(() => {
    vi.spyOn(GameScoreRepository, "postGameScore").mockResolvedValue(201);
    alertSpy = vi.spyOn(window, "alert").mockImplementation(() => {});
  });
  it("送信ボタンを押した時Repositoryのpostが呼ばれる。成功時のメッセージが表示される", async () => {
    render(
      <ScoreInput
        cardRowsCols={[3, 4]}
        elapsedTimeMillis={1000}
        gameMode={"irasutoya"}
        initializeGame={async () => {}}
        isCleared={true}
        score={20}
      />
    );

    const inputBox = screen.getByPlaceholderText("名前を入れてね");
    await userEvent.type(inputBox, "Masaru");

    const postButton = screen.getByRole("button", { name: "スコアを送信する" });
    await userEvent.click(postButton);

    expect(GameScoreRepository.postGameScore).toHaveBeenCalledTimes(1);

    expect(alertSpy).toHaveBeenCalledWith("送信完了しました");
  });
});
