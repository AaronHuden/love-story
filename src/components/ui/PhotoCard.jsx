import { motion } from 'framer-motion';
import { HiX } from 'react-icons/hi';

export default function PhotoCard({ photo, onClick, showRemove, onRemove }) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4 }}
      className="break-inside-avoid mb-4 cursor-pointer group"
      onClick={() => onClick(photo)}
    >
      <div className="overflow-hidden rounded-xl bg-cream shadow-sm hover:shadow-lg transition-shadow relative">
        {showRemove && (
          <button
            onClick={(e) => { e.stopPropagation(); onRemove(photo.id); }}
            className="absolute top-2 right-2 z-10 p-1.5 rounded-full bg-black/40 backdrop-blur-sm text-white/80 hover:bg-red-500 hover:text-white opacity-0 group-hover:opacity-100 transition-all"
            title="Remove photo"
          >
            <HiX size={14} />
          </button>
        )}
        <img
          src={photo.src}
          alt={photo.alt}
          loading="lazy"
          className="w-full block group-hover:scale-105 transition-transform duration-500 img-film"
          style={{ aspectRatio: `${photo.width}/${photo.height}` }}
        />
      </div>
    </motion.div>
  );
}
