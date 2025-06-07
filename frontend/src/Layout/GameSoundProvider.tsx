// GameSoundProvider.tsx
import { ReactNode, useEffect } from "react";

import { useSetAtom } from "jotai";

import { useGameSound } from "@/hooks/useGameSound.ts";
import { gameSoundAtom } from "@/utils/atom.ts";

export const GameSoundProvider = ({ children }: { children: ReactNode }) => {
  const setSoundAtom = useSetAtom(gameSoundAtom);
  const gameSound = useGameSound();

  useEffect(() => {
    setSoundAtom(gameSound);
  }, [gameSound, setSoundAtom]);

  return <>{children}</>;
};
