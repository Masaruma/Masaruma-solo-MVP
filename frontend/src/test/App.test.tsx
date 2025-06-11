import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";

import { App } from "@/App.tsx";

vi.mock("@/pages/GameMainPage.tsx", () => ({
  GameMainPage: vi.fn(() => <div data-testid={"mock-game-main-page"} />),
}));
vi.mock("@/pages/StartPage.tsx", () => ({
  StartPage: vi.fn(() => <div data-testid={"mock-start-page"} />),
}));
vi.mock("@/pages/CpuGameMainPage.tsx", () => ({
  CpuGameMainPage: vi.fn(() => <div data-testid={"mock-cpu-page"} />),
}));
describe("App.tsx", () => {
  it("/のルートはStartPageが表示される", () => {
    render(
      <MemoryRouter initialEntries={["/"]}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByTestId("mock-start-page")).toBeInTheDocument();
  });

  it("/nervousbreakdownのルートはstateを持つ場合GameMainPageが表示される", () => {
    render(
      <MemoryRouter
        initialEntries={[{ pathname: "/nervousbreakdown", state: vi.fn() }]}
      >
        <App />
      </MemoryRouter>
    );
    expect(screen.getByTestId("mock-game-main-page")).toBeInTheDocument();
  });

  it("/nervousbreakdownのルートはstateを持たない場合StartPageにリダイレクトされる", () => {
    render(
      <MemoryRouter initialEntries={[{ pathname: "/nervousbreakdown" }]}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByTestId("mock-start-page")).toBeInTheDocument();
  });
  it("/cpuのルートはCpuGameMainPageが表示される", () => {
    render(
      <MemoryRouter initialEntries={[{ pathname: "/cpu" }]}>
        <App />
      </MemoryRouter>
    );
    expect(screen.getByTestId("mock-cpu-page")).toBeInTheDocument();
  });
});
