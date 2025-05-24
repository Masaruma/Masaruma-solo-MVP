// hooks/useGameTimer.ts
import { useTimer } from "react-timer-hook";

export const useGameTimer = (initialSeconds = 180, onExpire = () => {}) => {
  const expiryTimestamp = new Date();
  expiryTimestamp.setSeconds(expiryTimestamp.getSeconds() + initialSeconds);

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
  } = useTimer({
    expiryTimestamp,
    onExpire: onExpire,
    autoStart: false,
    interval: 10,
  });

  const restartTimer = () => {
    const newExpiry = new Date();
    newExpiry.setSeconds(newExpiry.getSeconds() + initialSeconds);
    restart(newExpiry, false); // falseでautoStartしない
  };

  return {
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
