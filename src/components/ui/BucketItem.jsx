import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { HiCheck } from 'react-icons/hi';

function Sparkle({ x, y }) {
  return (
    <motion.span
      initial={{ x: 0, y: 0, opacity: 1, scale: 1 }}
      animate={{ x, y, opacity: 0, scale: 0 }}
      transition={{ duration: 0.7, ease: 'easeOut' }}
      className="absolute w-1.5 h-1.5 rounded-full bg-gold pointer-events-none"
    />
  );
}

const SPARKLE_OFFSETS = [
  { x: -20, y: -15 }, { x: 20, y: -15 },
  { x: -25, y: 5 }, { x: 25, y: 5 },
  { x: -10, y: -25 }, { x: 10, y: -25 },
];

export default function BucketItem({ item, onToggle, readOnly = false }) {
  const [sparkling, setSparkling] = useState(false);

  const handleClick = () => {
    if (readOnly) return;
    if (!item.checked) {
      setSparkling(true);
      setTimeout(() => setSparkling(false), 700);
    }
    onToggle(item.id);
  };

  return (
    <motion.button
      layout
      onClick={handleClick}
      className={`relative w-full flex items-center gap-3 p-3 rounded-xl transition-colors text-left ${
        readOnly ? 'cursor-default' : ''
      } ${
        item.checked
          ? 'bg-amber-100/20'
          : readOnly
            ? 'bg-cream shadow-sm border border-amber-200/40'
            : 'bg-cream hover:bg-amber-100/30 shadow-sm border border-amber-200/40'
      }`}
    >
      {/* Checkbox */}
      <motion.div
        whileTap={{ scale: 0.8 }}
        className={`relative flex-shrink-0 w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors ${
          item.checked
            ? 'bg-amber-500 border-amber-500'
            : 'border-amber-300 hover:border-amber-400'
        }`}
      >
        <AnimatePresence>
          {item.checked && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
            >
              <HiCheck className="text-cream" size={14} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Text */}
      <span
        className={`relative text-sm transition-all duration-300 ${
          item.checked
            ? 'text-ink/30 line-through'
            : 'text-ink'
        }`}
      >
        {item.text}
        {item.checked && (
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
            transition={{ duration: 0.4, delay: 0.15 }}
            className="absolute top-1/2 left-0 h-px bg-amber-400/60"
          />
        )}
      </span>

      {/* Sparkles */}
      {sparkling && !item.checked && (
        <div className="absolute left-4 top-1/2">
          {SPARKLE_OFFSETS.map((p, i) => (
            <Sparkle key={i} x={p.x} y={p.y} />
          ))}
        </div>
      )}
    </motion.button>
  );
}
