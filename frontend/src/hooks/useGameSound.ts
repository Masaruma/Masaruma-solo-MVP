import useSound from "use-sound";

import cardClickSound from "@/assets/sounds/cardClick.mp3";
import BGMSound from "@/assets/sounds/CassetteBGM.mp3";
import clickSound from "@/assets/sounds/click.mp3";
import failedSound from "@/assets/sounds/failed.mp3";
import gameClearSound from "@/assets/sounds/gameClear.mp3";
import gameFailedSound from "@/assets/sounds/gameFailed.mp3";
import shuffleSound from "@/assets/sounds/shuffle.mp3";
import successSound from "@/assets/sounds/success.mp3";

export const useGameSound = () => {
  const [playSuccess, { sound: playSuccessConfig }] = useSound(successSound, {
    volume: 0.4,
  });
  const [playFailed, { sound: playFailedConfig }] = useSound(failedSound, {
    volume: 0.3,
    interrupt: false,
  });
  const [playClick, { sound: playClickConfig }] = useSound(clickSound, {
    volume: 0.4,
  });
  const [playCardClick, { sound: playCardClickConfig }] = useSound(
    cardClickSound,
    { volume: 0.4 }
  );
  const [playShuffle, { sound: playShuffleConfig }] = useSound(shuffleSound, {
    volume: 0.3,
    interrupt: false,
  });
  const [playClear, { sound: playClearConfig }] = useSound(gameClearSound, {
    volume: 0.4,
  });
  const [playGameFailed, { sound: playGameFailedConfig }] = useSound(
    gameFailedSound,
    { volume: 0.4 }
  );

  const [playBGMSound, { sound: playBgmSoundConfig }] = useSound(BGMSound, {
    volume: 0.0,
    loop: true,
    interrupt: true,
  });

  return {
    playSuccess,
    playFailed,
    playClick,
    playShuffle,
    playClear,
    playGameFailed,
    playCardClick,
    effectVolumeGet: () => playGameFailedConfig?.volume(),
    effectVolumeSet: (vol: number) => {
      playSuccessConfig.volume(vol);
      playFailedConfig.volume(vol);
      playClickConfig.volume(vol);
      playCardClickConfig.volume(vol);
      playShuffleConfig.volume(vol);
      playClearConfig.volume(vol);
      playGameFailedConfig.volume(vol);
    },
    playBGMSound,
    bgmVolumeGet: () => playBgmSoundConfig?.volume(),
    bgmVolumeSet: (vol: number) => {
      playBgmSoundConfig.volume(vol);
    },
  };
};

export type GameSoundType = ReturnType<typeof useGameSound>;
