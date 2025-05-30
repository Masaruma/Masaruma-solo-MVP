import axios from "axios";
import { expect } from "vitest";

import * as GameScoreRepository from "@/repository/GameScoreRepository.ts";
import {
  GetGameScoreType,
  PostGameScoreType,
} from "@/repository/GameScoreRepository.ts";

const stubAxiosGetResponse: { data: GetGameScoreType[] } = {
  data: [
    {
      createdAt: "dummy",
      elapsedTimeMillis: 10,
      gameScore: 1,
      id: 1,
      missCount: 2,
      numberOfCard: 4,
      user: "user",
    },
  ],
};

// const stubGetGameScoresResponse = stubAxiosGetResponse.data

const stubPostRequestBody: PostGameScoreType = {
  elapsedTimeMillis: 10,
  gameScore: 1,
  missCount: 2,
  numberOfCard: 4,
  user: "user",
  gameModeId: 2,
  gameLevelId: 1,
};

describe("GameScoreRepository", () => {
  it("getGameScoresがaxiosを正しく呼び出している", async () => {
    vi.spyOn(axios, "get").mockResolvedValue(stubAxiosGetResponse);

    await GameScoreRepository.getGameScores(1, 4, 1);

    expect(axios.get).toHaveBeenCalledTimes(1);
    expect(axios.get).toHaveBeenCalledWith("/api/score", {
      params: { gameModeId: 1, numberOfCard: 4, gameLevelId: 1 },
    });
  });

  it("postGameScoresがaxiosを正しく呼び出す", async () => {
    vi.spyOn(axios, "post").mockResolvedValue({});

    await GameScoreRepository.postGameScore(stubPostRequestBody);

    expect(axios.post).toHaveBeenCalledTimes(1);
    expect(axios.post).toHaveBeenLastCalledWith("/api/score", {
      ...stubPostRequestBody,
    });
  });
});
