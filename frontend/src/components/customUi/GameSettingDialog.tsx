import { useEffect, useState } from "react";

import { useAtomValue } from "jotai/index";
import { Cog } from "lucide-react";

import { Button } from "@/components/ui/button.tsx";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog.tsx";
import { Slider } from "@/components/ui/slider.tsx";
import { gameSoundAtom } from "@/utils/atom.ts";

export const GameSettingDialog = () => {
  const gameSound = useAtomValue(gameSoundAtom);
  const [effectVol, setEffectVol] = useState(0.4);
  const [bgmVol, setBgmVol] = useState(0.03);

  // サウンドのボリュームが取得できるようになったら初期値をセット
  useEffect(() => {
    if (gameSound) {
      const e = gameSound.effectVolumeGet();
      const b = gameSound.bgmVolumeGet();
      if (typeof e === "number") setEffectVol(e);
      if (typeof b === "number") setBgmVol(b);
    }
  }, [gameSound]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant={"outline"}>
          <Cog />
          設定
        </Button>
      </DialogTrigger>
      <DialogContent className={"sm:max-w-md"}>
        <DialogHeader>
          <DialogTitle>ゲーム設定</DialogTitle>
        </DialogHeader>
        <div className={"flex items-center gap-2"}>
          <div className={"grid flex-1 gap-2"}>
            効果音:
            <Slider
              defaultValue={[effectVol]}
              max={1}
              min={0}
              onValueChange={(value) => {
                setEffectVol(value[0]);
                gameSound?.effectVolumeSet(value[0]);
              }}
              step={0.1}
            />
            ゲームサウンド
            <Slider
              defaultValue={[bgmVol]}
              max={0.05}
              min={0}
              onValueChange={(value) => {
                setBgmVol(value[0]);
                gameSound?.bgmVolumeSet(value[0]);
              }}
              step={0.005}
            />
          </div>
        </div>
        <DialogFooter className={"sm:justify-end"}>
          <DialogClose asChild>
            <Button type={"button"} variant={"secondary"}>
              Close
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
