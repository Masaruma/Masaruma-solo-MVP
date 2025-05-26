// components/GameTimer.tsx
export const GameTimer = ({ milliseconds }: { milliseconds: number }) => (
  <div aria-label={"現在のタイム"} style={{ textAlign: "center" }}>
    <div className={"text-2l"}>
      <span>{(milliseconds / 1000).toFixed(2)}</span>
    </div>
  </div>
);
