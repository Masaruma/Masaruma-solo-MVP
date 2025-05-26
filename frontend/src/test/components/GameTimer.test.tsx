import { render, screen } from "@testing-library/react";
import { expect } from "vitest";

import { GameTimer } from "@/components/GameTimer.tsx";

describe(`${GameTimer.name}`, () => {
  it("toFixedが正しい引数で呼び出されている。", () => {
    const toFixedSpy = vi.spyOn(Number.prototype, "toFixed");

    render(<GameTimer milliseconds={1000} />);

    expect(toFixedSpy).toHaveBeenCalledWith(2);
  });
  it("引数で渡されたm秒をsecondsに直し小数点以下2桁まで表記している", () => {
    render(<GameTimer milliseconds={1000} />);
    const nowTimer = screen.getByText("1.00");

    expect(nowTimer).toBeInTheDocument();
  });
});
