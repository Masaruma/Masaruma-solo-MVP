// components/GameTimer.tsx
import { Timer } from "lucide-react";

export const GameTimer = ({ milliseconds }: { milliseconds: number }) => (
  <div aria-label={"現在のタイム"} style={{ textAlign: "center" }}>
    <div className={"text-1xl"}>
      <Timer className={"inline-block"} size={"24px"} strokeWidth={"2px"} />
      {(milliseconds / 1000).toFixed(2)}
    </div>
  </div>
);
