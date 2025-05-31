import { useEffect, useState } from "react";

interface NotificationProps {
  duration?: number;
  message: string;
  onClose?: () => void;
}

export const Notification = ({
  duration = 2000,
  message,
  onClose,
}: NotificationProps) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false);
      onClose?.();
    }, duration);

    return () => clearTimeout(timer);
  }, [duration, onClose]);

  if (!isVisible) return null;

  return (
    <div
      className={`
        animate-fade-in-out fixed top-1/2 left-1/2 z-50 -translate-x-1/2
        -translate-y-1/2 transform rounded-lg bg-yellow-400 px-6 py-3 text-lg
        font-bold text-black shadow-lg
      `}
      role={"alert"}
    >
      {message}
    </div>
  );
};
