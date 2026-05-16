import { useState } from 'react';
import { motion } from 'framer-motion';
import { HiMail, HiMailOpen, HiPencil, HiX } from 'react-icons/hi';

export default function Envelope({ letter, isRead, onClick, showAdmin, onEdit, onRemove }) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <motion.button
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -6 }}
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="relative bg-cream rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow border border-amber-200/60 text-left w-full group"
    >
      {!isRead && (
        <div className="absolute top-3 right-3 w-2.5 h-2.5 bg-amber-500 rounded-full animate-pulse" />
      )}

      {/* Admin controls */}
      {showAdmin && (
        <div className="absolute top-2 left-2 z-20 flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => { e.stopPropagation(); onEdit(letter); }}
            className="p-1.5 rounded-full bg-black/40 backdrop-blur-sm text-white/80 hover:bg-amber-500 hover:text-white transition-colors"
            title="Edit letter"
          >
            <HiPencil size={12} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onRemove(letter.id); }}
            className="p-1.5 rounded-full bg-black/40 backdrop-blur-sm text-white/80 hover:bg-red-500 hover:text-white transition-colors"
            title="Remove letter"
          >
            <HiX size={12} />
          </button>
        </div>
      )}

      <div className={`mb-4 transition-colors ${isHovered ? 'text-amber-500' : 'text-amber-400'}`}>
        {isHovered ? <HiMailOpen size={32} /> : <HiMail size={32} />}
      </div>

      <h4 className="font-[family-name:var(--font-heading)] text-lg text-ink-deep mb-1 italic">
        {letter.title}
      </h4>
      <p className="text-xs text-sepia">
        From {letter.from} &middot; {letter.date}
      </p>

      {/* Decorative wax seal */}
      <div className="absolute bottom-4 right-4 w-8 h-8 rounded-full border-2 border-amber-300/60 flex items-center justify-center opacity-40">
        <span className="text-amber-400 text-xs">&#9829;</span>
      </div>
    </motion.button>
  );
}
