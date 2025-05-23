import { useTimer } from "react-timer-hook";

export const GameTimer = ({ expiryTimestamp }: { expiryTimestamp: Date }) => {
  const {
    days,
    hours,
    isRunning,
    milliseconds,
    minutes,
    pause,
    restart,
    resume,
    seconds,
    start,
  } = useTimer({
    expiryTimestamp,
    onExpire: () => console.info("onExpire called"),
  });

  return (
    <div style={{ textAlign: "center" }}>
      <div className={"text-2l"}>
        <span>{days}</span>:<span>{hours}</span>:<span>{minutes}</span>:
        <span>{seconds}</span>:<span>{milliseconds}</span>
      </div>
      <p>{isRunning ? "Running" : "Not running"}</p>
      <button onClick={start}>Start</button>
      <button onClick={pause}>Pause</button>
      <button onClick={resume}>Resume</button>
      <button
        onClick={() => {
          const time = new Date();
          time.setSeconds(time.getSeconds() + 300);
          restart(time);
        }}
      >
        Restart
      </button>
    </div>
  );
};
