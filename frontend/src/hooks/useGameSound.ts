import { useState } from "react";

import useSound from "use-sound";

import cardClickSound from "@/sounds/cardClick.mp3";
import clickSound from "@/sounds/click.mp3";
import failedSound from "@/sounds/failed.mp3";
import gameClearSound from "@/sounds/gameClear.mp3";
import gameFailedSound from "@/sounds/gameFailed.mp3";
import shuffleSound from "@/sounds/shuffle.mp3";
import successSound from "@/sounds/success.mp3";

export const useGameSound = () => {
  const [effectVolume, setEffectVolume] = useState(0.3);

  const [playSuccess] = useSound(successSound, { volume: effectVolume });
  const [playFailed] = useSound(failedSound, {
    volume: effectVolume,
    interrupt: false,
  });
  const [playClick] = useSound(clickSound, { volume: effectVolume });
  const [playCardClick] = useSound(cardClickSound, { volume: effectVolume });
  const [playShuffle] = useSound(shuffleSound, {
    volume: effectVolume,
    interrupt: false,
  });
  const [playClear] = useSound(gameClearSound, { volume: effectVolume });
  const [playGameFailed] = useSound(gameFailedSound, { volume: effectVolume });

  return {
    playSuccess,
    playFailed,
    playClick,
    playShuffle,
    playClear,
    playGameFailed,
    playCardClick,
    setEffectVolume,
  };
};

export type GameSoundType = ReturnType<typeof useGameSound>;
