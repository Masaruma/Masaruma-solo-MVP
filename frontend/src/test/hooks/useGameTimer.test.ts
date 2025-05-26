import { act, renderHook } from "@testing-library/react";
import { afterEach, beforeEach, expect } from "vitest";

import { useGameTimer } from "@/hooks/useGameTimer.ts";

describe(`${useGameTimer.name}`, () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });
  it("設定したタイマーを戻り値にに設定している", async () => {
    const { result } = renderHook(() => useGameTimer(10));

    expect(result.current.start).toEqual(expect.any(Function));
    expect(result.current.totalMilliseconds).toEqual(10 * 1000);
    expect(result.current.elapsedMilliseconds).toEqual(0);
    expect(result.current.isRunning).toBe(false);

    await act(async () => {
      result.current.start();
    });
    expect(result.current.isRunning).toBe(true);

    // 1秒進める
    act(() => {
      vi.advanceTimersByTime(815);
    });

    expect(result.current.totalMilliseconds).toEqual(
      10 * 1000 - Math.floor(810 / 10) * 10
    );
    expect(result.current.elapsedMilliseconds).toEqual(
      Math.floor(810 / 10) * 10
    );
  });
});
