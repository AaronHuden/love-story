import { useMemo } from 'react';
import { HiHeart } from 'react-icons/hi';

export default function FloatingHearts() {
  const hearts = useMemo(
    () =>
      Array.from({ length: 12 }, (_, i) => ({
        id: i,
        left: `${Math.random() * 95}%`,
        size: `${Math.random() * 16 + 8}px`,
        duration: `${Math.random() * 8 + 10}s`,
        delay: `${Math.random() * 10}s`,
      })),
    [],
  );

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {hearts.map((h) => (
        <div
          key={h.id}
          className="absolute bottom-0 text-amber-400/15"
          style={{
            left: h.left,
            fontSize: h.size,
            animation: `float-up ${h.duration} linear infinite`,
            animationDelay: h.delay,
          }}
        >
          <HiHeart />
        </div>
      ))}
    </div>
  );
}
