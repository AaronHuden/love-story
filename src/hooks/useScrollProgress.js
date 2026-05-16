import { useState, useEffect } from 'react';

export function useScrollProgress() {
  const [scrollY, setScrollY] = useState(0);
  const [direction, setDirection] = useState('down');

  useEffect(() => {
    let prevY = window.scrollY;

    const handleScroll = () => {
      const currentY = window.scrollY;
      setDirection(currentY > prevY ? 'down' : 'up');
      setScrollY(currentY);
      prevY = currentY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const docHeight = typeof document !== 'undefined'
    ? document.documentElement.scrollHeight - window.innerHeight
    : 1;
  const progress = docHeight > 0 ? scrollY / docHeight : 0;

  return { scrollY, progress: Math.min(progress, 1), direction };
}
