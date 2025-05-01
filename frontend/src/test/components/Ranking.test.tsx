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
    render(<Ranking cardRowsCols={[3, 4]} gameMode={"irasutoya"} />);
    await waitFor(() => {
      expect(GameScoreRepository.getGameScores).toHaveBeenCalledTimes(1);
    });
  });
});
