import { renderHook } from "@testing-library/react";
import { expect } from "vitest";

import { useGameSound } from "@/hooks/useGameSound.ts";

const spySoundPlayer = vi.fn();
const spySoundConfig = vi.fn();
vi.mock("use-sound", () => {
  return {
    default: vi.fn(() => [
      spySoundPlayer,
      {
        sound: { volume: spySoundConfig },
      },
    ]),
  };
});

describe("useGameSound", () => {
  it("効果音の音量setterに正しくhawler.jsの音量セット用の関数が渡される", () => {
    const { result } = renderHook(() => useGameSound());
    result.current.effectVolumeSet(0.5);
    expect(spySoundConfig.mock.calls.length).toBeGreaterThanOrEqual(7);
  });
  it("BGMの音量setterに正しくhawlerの音量セット用の関数が渡される", () => {
    const { result } = renderHook(() => useGameSound());
    result.current.bgmVolumeSet(0.5);
    expect(spySoundConfig.mock.calls.length).toBeGreaterThanOrEqual(1);
  });
  it("音再生の関数が正しく実行できている", () => {
    const { result } = renderHook(() => useGameSound());
    result.current.playSuccess();
    result.current.playBGMSound();
    result.current.playCardClick();
    result.current.playShuffle();
    result.current.playClear();
    result.current.playGameFailed();
    result.current.playClick();

    expect(spySoundPlayer.mock.calls.length).toBeGreaterThanOrEqual(7);
  });
});
