// hooks/useGameTimer.ts
import { useTimer } from "react-timer-hook";

export const useGameTimer = (initialSeconds = 180, onExpire = () => {}) => {
  const getExpiryTimestamp = (seconds: number) => {
    const now = new Date();

    now.setSeconds(now.getSeconds() + seconds);
    return now;
  };

  const {
    days,
    hours,
    isRunning,
    milliseconds,
    minutes,
    pause,
    restart,
    seconds,
    start,
    totalMilliseconds,
  } = useTimer({
    expiryTimestamp: getExpiryTimestamp(initialSeconds),
    onExpire: onExpire,
    autoStart: false,
    interval: 10,
  });

  const restartTimer = () => {
    restart(getExpiryTimestamp(initialSeconds), false); // falseでautoStartしない
  };

  return {
    elapsedMilliseconds:
      initialSeconds * 1000 - Math.floor(totalMilliseconds / 10) * 10,
    totalMilliseconds: Math.floor(totalMilliseconds / 10) * 10,
    milliseconds,
    seconds,
    minutes,
    hours,
    days,
    isRunning,
    start,
    pause,
    restart: restartTimer,
  };
};
