import { atom } from "jotai";

import { GameSoundType } from "@/hooks/useGameSound.ts";

export const gameSoundAtom = atom<GameSoundType | null>(null);
