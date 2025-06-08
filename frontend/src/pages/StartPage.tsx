import { useEffect, useState } from "react";

import { useAtomValue } from "jotai";
import { useNavigate } from "react-router-dom";

import { GameSettingDialog } from "@/components/customUi/GameSettingDialog.tsx";
import { Ranking } from "@/components/Ranking.tsx";
import { Button } from "@/components/ui/button.tsx";
import { gameSoundAtom } from "@/utils/atom.ts";

export type GameModeType = "irasutoya" | "pokemon";

const gameLevelMap: Record<number, "優しい" | "ふつう" | "難しい" | "超難関"> =
  {
    1: "優しい",
    2: "ふつう",
    3: "難しい",
    5: "超難関",
  };

const gameLevelIdMap: Record<
  "優しい" | "ふつう" | "難しい" | "超難関",
  number
> = {
  優しい: 1,
  ふつう: 2,
  難しい: 3,
  超難関: 5,
};

export const StartPage = () => {
  const [gameMode, setGameMode] = useState<GameModeType>("irasutoya");
  const [gameLevel, setGameLevel] = useState(1);

  const [selectedNumberOfCard, setSelectedNumberOfCard] = useState<number>(0);
  const [gameStart, setGameStart] = useState({
    IsOkModeSelect: false,
    IsOkLevelSelect: false,
    isOkNumberSelect: false,
  });

  const navigate = useNavigate();

  const gameModeArray: GameModeType[] = ["irasutoya", "pokemon"];
  const gameLevelArray = Object.values(gameLevelMap);

  const numberOfCardArray = [
    ...Array.from({ length: (60 - 4) / 2 + 1 }, (_, i) => 4 + i * 2),
    ...Array.from({ length: (100 - 60) / 10 }, (_, i) => 60 + (i + 1) * 10),
  ];

  const gameSound = useAtomValue(gameSoundAtom);
  useEffect(() => {
    gameSound?.playBGMSound();
  }, [gameSound]);

  return (
    <div className={"flex h-lvh w-full flex-col items-center justify-center"}>
      <h1 className={"m-2.5 w-1/2 text-5xl"}>神経衰弱:{gameMode}</h1>
      <div className={"m-2.5 w-1/2"}>
        <GameSettingDialog />
        <div aria-label={"ゲームの絵柄を選択"} className={"w-full"}>
          モードを選択してください
          <div className={"m-2.5 grid grid-cols-2 gap-2"}>
            {gameModeArray.map((mode) => (
              <Button
                className={""}
                key={mode}
                onClick={() => {
                  gameSound?.playClick();
                  setGameMode(mode);
                  setGameStart({
                    IsOkModeSelect: true,
                    IsOkLevelSelect: false,
                    isOkNumberSelect: false,
                  });
                }}
                size={"default"}
                variant={gameMode === mode ? "default" : "secondary"}
              >
                {mode}
              </Button>
            ))}
          </div>
        </div>
        {gameStart.IsOkModeSelect && (
          <div aria-label={"ゲームの難易度を選択"} className={`w-full`}>
            難易度を選択してください
            <div className={"m-2.5 grid grid-cols-3 gap-2"}>
              {gameLevelArray.map((level) => (
                <Button
                  className={""}
                  key={level}
                  onClick={() => {
                    gameSound?.playClick();

                    setGameLevel(gameLevelIdMap[level]);
                    setGameStart({
                      IsOkModeSelect: true,
                      IsOkLevelSelect: true,
                      isOkNumberSelect: false,
                    });
                  }}
                  size={"default"}
                  variant={
                    gameLevel === gameLevelIdMap[level]
                      ? "default"
                      : "secondary"
                  }
                >
                  {level}
                </Button>
              ))}
            </div>
          </div>
        )}
        {gameStart.IsOkLevelSelect && (
          <div aria-label={"カードの枚数を選択"} className={"w-full"}>
            マス目を選択してください
            <h6>10×10はポケモンのみ。</h6>
            <div className={"m-2.5 grid grid-cols-10 grid-rows-3 gap-2"}>
              {numberOfCardArray.map((numberOfCard) => (
                <Button
                  key={numberOfCard}
                  onClick={() => {
                    gameSound?.playClick();

                    setSelectedNumberOfCard(numberOfCard);
                    setGameStart({
                      IsOkModeSelect: true,
                      IsOkLevelSelect: true,
                      isOkNumberSelect: true,
                    });
                  }}
                  size={"default"}
                  variant={
                    selectedNumberOfCard === numberOfCard
                      ? "default"
                      : "secondary"
                  }
                >
                  {numberOfCard}枚
                </Button>
              ))}
            </div>
          </div>
        )}
        {gameStart.isOkNumberSelect && (
          <>
            <Ranking
              gameLevelId={gameLevel}
              gameMode={gameMode}
              selectedNumberOfCard={selectedNumberOfCard}
            />
            <Button
              onClick={() => {
                gameSound?.playClick();

                void navigate("/nervousbreakdown", {
                  state: {
                    gameLevel,
                    gameMode,
                    selectedNumberOfCard: selectedNumberOfCard,
                  },
                });
              }}
              size={"lg"}
              variant={"outline"}
            >
              ゲームスタート
            </Button>
          </>
        )}
      </div>
    </div>
  );
};
