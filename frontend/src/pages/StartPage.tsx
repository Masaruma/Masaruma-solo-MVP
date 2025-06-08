import { useEffect, useState } from "react";

import { useAtomValue } from "jotai";
import { ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { GameSettingDialog } from "@/components/customUi/GameSettingDialog.tsx";
import { Ranking } from "@/components/Ranking.tsx";
import { Button } from "@/components/ui/button.tsx";
import {
  Tabs,
  TabsContent,
  TabsTrigger,
  TabsList,
} from "@/components/ui/tabs.tsx";
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
  const [tab, setTab] = useState("mode");
  const [gameMode, setGameMode] = useState<GameModeType>("irasutoya");
  const [gameLevel, setGameLevel] = useState(1);

  const [selectedNumberOfCard, setSelectedNumberOfCard] = useState<number>(0);

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
      <h1 className={"text-outline m-2.5 mb-15 w-full text-center text-7xl"}>
        神経衰弱
      </h1>
      <div className={"flex h-1/3 w-full max-w-sm flex-col gap-6"}>
        <Tabs className={"w-full max-w-md"} onValueChange={setTab} value={tab}>
          <TabsList className={"mb-6 grid w-full grid-cols-4"}>
            <TabsTrigger
              onClick={() => {
                gameSound?.playClick();
              }}
              value={"mode"}
            >
              モード
              <ChevronRight />
            </TabsTrigger>
            <TabsTrigger
              disabled={!gameMode}
              onClick={() => {
                gameSound?.playClick();
              }}
              value={"level"}
            >
              難易度
              <ChevronRight />
            </TabsTrigger>
            <TabsTrigger
              disabled={!gameLevel}
              onClick={() => {
                gameSound?.playClick();
              }}
              value={"card"}
            >
              枚数
              <ChevronRight />
            </TabsTrigger>
            <TabsTrigger
              disabled={!selectedNumberOfCard}
              onClick={() => {
                gameSound?.playClick();
              }}
              value={"confirm"}
            >
              確認
            </TabsTrigger>
          </TabsList>

          {/* 1. モード選択 */}
          <TabsContent
            className={`
            bg-beige-100 flex h-full justify-center rounded-2xl border-[2px]
            border-[#e0dcbc] p-12 shadow-[0_0_18px_2px_rgba(0,0,0,0.15)]
            backdrop-blur-xl
          `}
            value={"mode"}
          >
            <div className={"flex flex-col items-center gap-4"}>
              <div className={"flex gap-4"}>
                {gameModeArray.map((mode) => (
                  <Button
                    key={mode}
                    onClick={() => {
                      setGameMode(mode);
                      setTab("level");
                      gameSound?.playClick();
                    }}
                    variant={gameMode === mode ? "default" : "secondary"}
                  >
                    {mode === "irasutoya" ? "いらすとや" : "ポケモン"}
                  </Button>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* 2. 難易度 */}
          <TabsContent
            className={`
            bg-beige-100 animate-fade-left flex h-full justify-center
            rounded-2xl border-[2px] border-[#e0dcbc] p-12
            shadow-[0_0_18px_2px_rgba(0,0,0,0.15)] backdrop-blur-xl
          `}
            value={"level"}
          >
            <div className={"flex flex-col items-center gap-4"}>
              <div className={"flex gap-2"}>
                {gameLevelArray.map((level) => (
                  <Button
                    key={level}
                    onClick={() => {
                      setGameLevel(gameLevelIdMap[level]);
                      setTab("card");
                      gameSound?.playClick();
                    }}
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
          </TabsContent>

          {/* 3. 枚数 */}
          <TabsContent
            className={`
            bg-beige-100 animate-fade-left flex h-full justify-center
            rounded-2xl border-[2px] border-[#e0dcbc] p-12
            shadow-[0_0_18px_2px_rgba(0,0,0,0.15)] backdrop-blur-xl
            overflow-hidden`}
            value={"card"}
          >
            <div className={"flex flex-col items-center gap-4"}>
              <div className={"grid grid-cols-5 gap-2"}>
                {numberOfCardArray.map((number) => (
                  <Button
                    key={number}
                    onClick={() => {
                      setSelectedNumberOfCard(number);
                      setTab("confirm");
                      gameSound?.playClick();
                    }}
                    variant={
                      selectedNumberOfCard === number ? "default" : "secondary"
                    }
                  >
                    {number}枚
                  </Button>
                ))}
              </div>
            </div>
          </TabsContent>

          {/* 4. 確認 */}
          <TabsContent
            className={`
            bg-beige-100 animate-fade-left flex h-full justify-center
            rounded-2xl border-[2px] border-[#e0dcbc] p-12
            shadow-[0_0_18px_2px_rgba(0,0,0,0.15)] backdrop-blur-xl
          `}
            value={"confirm"}
          >
            <div className={"flex flex-col items-center gap-4"}>
              <div className={"mb-2"}>
                <b>{gameMode === "irasutoya" ? "いらすとや" : "ポケモン"}</b>／
                <b>{gameLevel && gameLevelMap[gameLevel]}</b>／
                <b>{selectedNumberOfCard}枚</b>
              </div>
              <Ranking
                gameLevelId={gameLevel ?? 1}
                gameMode={gameMode ?? "irasutoya"}
                selectedNumberOfCard={selectedNumberOfCard ?? 12}
              />
              <Button
                disabled={!gameLevel || !gameMode || !selectedNumberOfCard}
                onClick={() => {
                  gameSound?.playClick();
                  void navigate("/nervousbreakdown", {
                    state: {
                      gameLevel,
                      gameMode,
                      selectedNumberOfCard,
                    },
                  });
                }}
                size={"lg"}
                variant={"outline"}
              >
                ゲームスタート
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </div>
      <GameSettingDialog />
    </div>
  );
};
