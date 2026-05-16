import { useEffect } from 'react';
import { motion, useMotionValue, useTransform, animate } from 'framer-motion';
import { HiHeart } from 'react-icons/hi';

export default function DaysCounter({ days }) {
  const count = useMotionValue(0);
  const display = useTransform(count, (v) => Math.round(v).toLocaleString());

  useEffect(() => {
    const controls = animate(count, days, {
      duration: 2.5,
      ease: 'easeOut',
    });
    return controls.stop;
  }, [days]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.6, duration: 0.8 }}
      className="flex items-center justify-center gap-2"
    >
      <HiHeart className="text-amber-300 text-lg drop-shadow-[0_2px_6px_rgba(0,0,0,0.5)]" />
      <motion.span className="text-2xl md:text-3xl font-light tracking-wide text-cream drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]">
        {display}
      </motion.span>
      <span className="text-lg md:text-xl font-light tracking-wide text-amber-200/90 drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]">
        days together
      </span>
    </motion.div>
  );
}
