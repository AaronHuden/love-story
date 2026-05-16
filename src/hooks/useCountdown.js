import { useState, useEffect } from 'react';
import { differenceInSeconds, parseISO } from 'date-fns';

export function useCountdown(targetDateStr) {
  const calcRemaining = () => {
    const now = new Date();
    const target = parseISO(targetDateStr);
    const totalSeconds = differenceInSeconds(target, now);

    if (totalSeconds <= 0) {
      return { days: 0, hours: 0, minutes: 0, seconds: 0, isExpired: true, totalSeconds: 0 };
    }

    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return { days, hours, minutes, seconds, isExpired: false, totalSeconds };
  };

  const [remaining, setRemaining] = useState(calcRemaining);

  useEffect(() => {
    const timer = setInterval(() => setRemaining(calcRemaining()), 1000);
    return () => clearInterval(timer);
  }, [targetDateStr]);

  return remaining;
}
