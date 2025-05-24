// components/GameTimer.tsx
export const GameTimer = ({
  isRunning,
  milliseconds,
  // minutes,
  seconds,
}: {
  isRunning: boolean;
  milliseconds: number;
  // minutes: number;
  seconds: number;
}) => (
  <div style={{ textAlign: "center" }}>
    <div className={"text-2l"}>
      <span>{seconds}</span>:<span>{milliseconds}</span>
    </div>
    <p>{isRunning ? "Running" : "Not running"}</p>
  </div>
);
