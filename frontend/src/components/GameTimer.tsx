// components/GameTimer.tsx
export const GameTimer = ({
  milliseconds,
  seconds,
}: {
  milliseconds: number;
  seconds: number;
}) => (
  <div style={{ textAlign: "center" }}>
    <div className={"text-2l"}>
      <span>{seconds}</span>:<span>{milliseconds}</span>
    </div>
  </div>
);
