import { render, waitFor } from "@testing-library/react";
import { beforeEach, expect } from "vitest";

import { Ranking } from "@/components/Ranking.tsx";
import * as GameScoreRepository from "@/repository/GameScoreRepository.ts";

vi.mock("@/repository/GameScoreRepository.ts");

describe("Ranking", () => {
  beforeEach(() => {
    vi.spyOn(GameScoreRepository, "getGameScores").mockResolvedValue([]);
  });
  it("初期レンダリング時にrepositoryのgetを読んでいる", async () => {
    render(
      <Ranking
        gameLevelId={1}
        gameMode={"irasutoya"}
        selectedNumberOfCard={12}
      />
    );
    await waitFor(() => {
      expect(GameScoreRepository.getGameScores).toHaveBeenCalledTimes(1);
    });
  });
});
