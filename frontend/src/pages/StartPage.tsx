import { useState } from "react";

import { useAtomValue } from "jotai";
import { useNavigate } from "react-router-dom";

import { GameSettingDialog } from "@/components/customUi/GameSettingDialog.tsx";
import { MultiButtons } from "@/components/customUi/MultiButtons.tsx";
import { SingleModeTab } from "@/components/SingleModeTab.tsx";
import { Button } from "@/components/ui/button.tsx";
import { gameSoundAtom } from "@/utils/atom.ts";

export const StartPage = () => {
  const gameSound = useAtomValue(gameSoundAtom);
  const navigate = useNavigate();

  const [singleOrCouOrMulti, setSingleOrCouOrMulti] = useState("シングル");

  return (
    <div className={"flex h-lvh w-full flex-col items-center justify-center"}>
      <h1 className={"text-outline m-2.5 mb-15 w-full text-center text-7xl"}>
        神経衰弱
      </h1>
      <div className={"flex h-1/3 w-full max-w-sm flex-col gap-6"}>
        <MultiButtons
          nameArray={["シングル", "CPU", "マルチ"]}
          onClickHandlers={() => {
            gameSound?.playClick();
          }}
          setState={setSingleOrCouOrMulti}
          state={singleOrCouOrMulti}
        />
        {singleOrCouOrMulti === "シングル" && <SingleModeTab />}
        {singleOrCouOrMulti === "CPU" && (
          <Button
            onClick={() => {
              gameSound?.playClick();
              void navigate("/nervousbreakdown", {
                state: {
                  gameLevel: 1,
                  gameMode: "pokemon",
                  selectedNumberOfCard: 16,
                  isVsCpu: true,
                  cpuLevel: 1,
                },
              });
            }}
            size={"lg"}
            variant={"outline"}
          >
            ゲームスタート
          </Button>
        )}
      </div>
      <GameSettingDialog />
    </div>
  );
};
