import { AnimatePresence, motion } from 'framer-motion';
import { useCountdown } from '../../hooks/useCountdown';

export default function CountdownTimer({ targetDate, label }) {
  const { days, hours, minutes, seconds, isExpired } = useCountdown(targetDate);

  if (isExpired) {
    return (
      <div className="text-center py-4">
        <p className="font-[family-name:var(--font-heading)] text-xl text-amber-500 italic mb-1">
          {label}
        </p>
        <p className="text-ink">Celebrated with love!</p>
      </div>
    );
  }

  return (
    <div className="text-center">
      {label && (
        <p className="font-[family-name:var(--font-heading)] text-lg text-ink mb-3 italic">
          {label}
        </p>
      )}
      <div className="flex items-center justify-center gap-2 md:gap-4">
        <TimeUnit value={days} unit="Days" />
        <Colon />
        <TimeUnit value={hours} unit="Hours" />
        <Colon />
        <TimeUnit value={minutes} unit="Mins" />
        <Colon />
        <TimeUnit value={seconds} unit="Secs" />
      </div>
    </div>
  );
}

function TimeUnit({ value, unit }) {
  const digits = String(value).padStart(2, '0');

  return (
    <div className="text-center">
      <div className="flex">
        {digits.split('').map((d, i) => (
          <div
            key={i}
            className="w-10 md:w-14 h-14 md:h-20 bg-cream rounded-xl shadow-sm border border-amber-200/60 flex items-center justify-center overflow-hidden mx-0.5"
          >
            <AnimatePresence mode="popLayout">
              <motion.span
                key={`${i}-${d}`}
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: -20, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="font-[family-name:var(--font-heading)] text-2xl md:text-4xl text-ink-deep tabular-nums"
              >
                {d}
              </motion.span>
            </AnimatePresence>
          </div>
        ))}
      </div>
      <span className="text-xs text-sepia uppercase tracking-wider mt-1 block">
        {unit}
      </span>
    </div>
  );
}

function Colon() {
  return (
    <span className="font-[family-name:var(--font-heading)] text-2xl md:text-3xl text-amber-400 pb-4">
      :
    </span>
  );
}
