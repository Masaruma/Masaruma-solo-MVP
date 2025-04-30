import { render, screen } from "@testing-library/react";
import { userEvent } from "@testing-library/user-event";

import { NervousBreakdownPage } from "@/pages/NervousBreakdownPage.tsx";
import { beforeEach } from "vitest";

vi.mock("@/repository/GameScoreRepository.ts");
vi.mock("@/components/Ranking.tsx");

// vi.mocked(getGameScores).mockResolvedValueOnce({})

describe("NervousBreakdownのテスト", () => {
  beforeEach(async () => {
    render(<NervousBreakdownPage />);

    const loginButton = screen.getByRole("button", { name: "ログイン" });
    await userEvent.click(loginButton);
  })
  it("vitestが動いてるかテスト", () => {
    const headerText = screen.getByText("モードを選択してください");

    expect(headerText).toBeInTheDocument();
  })
})