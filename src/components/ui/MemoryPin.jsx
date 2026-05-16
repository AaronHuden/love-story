import { motion } from 'framer-motion';
import { HiX, HiPencil } from 'react-icons/hi';

export default function MemoryPin({ memory, index, showAdmin, onEdit, onRemove }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 40, rotate: 0 }}
      whileInView={{ opacity: 1, y: 0, rotate: memory.rotation }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className="relative bg-cream p-3 pb-10 shadow-md hover:shadow-lg hover:scale-105 hover:z-10 transition-all duration-300 group"
      style={{ borderRadius: '2px' }}
    >
      {/* Thumbtack */}
      <div className="absolute top-2 left-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-amber-500 shadow-md z-10" />
      <div className="absolute top-2 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-amber-200 z-20" />

      {/* Admin controls */}
      {showAdmin && (
        <div className="absolute top-1 right-1 z-20 flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={(e) => { e.stopPropagation(); onEdit(memory); }}
            className="p-1.5 rounded-full bg-black/40 backdrop-blur-sm text-white/80 hover:bg-amber-500 hover:text-white transition-colors"
            title="Edit memory"
          >
            <HiPencil size={12} />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); onRemove(memory.id); }}
            className="p-1.5 rounded-full bg-black/40 backdrop-blur-sm text-white/80 hover:bg-red-500 hover:text-white transition-colors"
            title="Remove memory"
          >
            <HiX size={12} />
          </button>
        </div>
      )}

      {/* Photo */}
      <div className="overflow-hidden mb-3" style={{ borderRadius: '1px' }}>
        <img
          src={memory.image}
          alt={memory.caption}
          loading="lazy"
          decoding="async"
          className="w-full h-48 object-cover img-film"
        />
      </div>

      {/* Caption */}
      <p className="font-[family-name:var(--font-hand)] text-lg text-ink leading-snug px-1">
        {memory.caption}
      </p>

      {/* Date */}
      <span className="absolute bottom-3 right-4 text-xs text-sepia font-medium">
        {memory.date}
      </span>
    </motion.div>
  );
}
