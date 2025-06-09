import { ReactNode, useEffect } from "react";

import { useAtomValue } from "jotai/index";

import { gameSoundAtom } from "@/utils/atom.ts";

export const MusicLayout = ({ children }: { children: ReactNode }) => {
  const gameSound = useAtomValue(gameSoundAtom);
  // todo the opening of a book written by ioniにしてもいいかも
  useEffect(() => {
    gameSound?.playBGMSound();
  }, [gameSound]);
  return <>{children}</>;
};
