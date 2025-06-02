import useSound from "use-sound";

import clickSound from "@/sounds/click.mp3";
import failedSound from "@/sounds/failed.mp3";
import gameClearSound from "@/sounds/gameClear.mp3";
import gameFailedSound from "@/sounds/gameFailed.mp3";
import shuffleSound from "@/sounds/shuffle.mp3";
import successSound from "@/sounds/success.mp3";
import cardClickSound from "@/sounds/cardClick.mp3";

export const useGameSound = () => {
  const [playSuccess] = useSound(successSound, { volume: 0.5 });
  const [playFailed] = useSound(failedSound, { volume: 0.5, interrupt: false });
  const [playClick] = useSound(clickSound, { volume: 0.2 });
  const [playCardClick] = useSound(cardClickSound, { volume: 0.4 });
  const [playShuffle] = useSound(shuffleSound, {
    volume: 0.4,
    interrupt: false,
  });
  const [playClear] = useSound(gameClearSound, { volume: 0.1 });
  const [playGameFailed] = useSound(gameFailedSound, { volume: 0.2 });

  return {
    playSuccess,
    playFailed,
    playClick,
    playShuffle,  
    playClear,
    playGameFailed,
    playCardClick
  };
};
