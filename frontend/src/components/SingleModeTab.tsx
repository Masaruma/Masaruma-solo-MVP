import { useState } from "react";

import { useAtomValue } from "jotai/index";
import { ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { MultiButtons } from "@/components/customUi/MultiButtons.tsx";
import { Ranking } from "@/components/Ranking.tsx";
import { Button } from "@/components/ui/button.tsx";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
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

export const SingleModeTab = () => {
  const gameSound = useAtomValue(gameSoundAtom);

  const [tab, setTab] = useState("mode");
  const [gameMode, setGameMode] = useState<GameModeType>("pokemon");
  const [gameLevel, setGameLevel] = useState(1);

  const [selectedNumberOfCard, setSelectedNumberOfCard] = useState<number>(0);

  const navigate = useNavigate();

  const gameModeArray: GameModeType[] = ["pokemon", "irasutoya"];
  const gameLevelArray = Object.values(gameLevelMap);

  const numberOfCardArray = [
    ...Array.from({ length: (60 - 4) / 2 + 1 }, (_, i) => 4 + i * 2),
    ...Array.from({ length: (100 - 60) / 10 }, (_, i) => 60 + (i + 1) * 10),
  ];
  return (
    <Tabs
      aria-label={"シングルプレイ"}
      className={"w-full max-w-md"}
      onValueChange={setTab}
      value={tab}
    >
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
        <MultiButtons
          nameArray={gameModeArray}
          onClickHandlers={() => {
            setTab("level");
            gameSound?.playClick();
          }}
          setState={setGameMode}
          state={gameMode}
        />
      </TabsContent>

      {/* 2. 難易度 */}
      <TabsContent
        className={`
          bg-beige-100 animate-fade-left flex h-full justify-center rounded-2xl
          border-[2px] border-[#e0dcbc] p-12
          shadow-[0_0_18px_2px_rgba(0,0,0,0.15)] backdrop-blur-xl
        `}
        value={"level"}
      >
        <MultiButtons
          mapObject={gameLevelIdMap}
          nameArray={gameLevelArray}
          onClickHandlers={() => {
            setTab("card");
            gameSound?.playClick();
          }}
          setState={setGameLevel}
          state={gameLevel}
        />
      </TabsContent>

      {/* 3. 枚数 */}
      <TabsContent
        className={`
          bg-beige-100 animate-fade-left flex h-full justify-center
          overflow-hidden rounded-2xl border-[2px] border-[#e0dcbc] p-12
          shadow-[0_0_18px_2px_rgba(0,0,0,0.15)] backdrop-blur-xl
        `}
        value={"card"}
      >
        <MultiButtons
          className={"grid grid-cols-5 gap-2"}
          nameArray={numberOfCardArray}
          onClickHandlers={() => {
            setTab("confirm");

            gameSound?.playClick();
          }}
          setState={setSelectedNumberOfCard}
          state={selectedNumberOfCard}
        />
      </TabsContent>

      {/* 4. 確認 */}
      <TabsContent
        className={`
          bg-beige-100 animate-fade-left flex h-full justify-center rounded-2xl
          border-[2px] border-[#e0dcbc] p-4
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
  );
};
