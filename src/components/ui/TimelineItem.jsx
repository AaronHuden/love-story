import { motion } from 'framer-motion';

const ICON_MAP = {
  airplane: '✈️',
  heart: '💕',
  compass: '🧭',
  rainbow: '🌈',
  ring: '💍',
  wedding: '💒',
  sparkles: '✨',
  waves: '🌊',
  home: '🏠',
  paw: '🐾',
  sunflower: '🌻',
};

export default function TimelineItem({ event, index, isLeft }) {
  const emoji = ICON_MAP[event.icon] || '💖';

  return (
    <motion.div
      initial={{ opacity: 0, x: isLeft ? -60 : 60 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
      className={`relative flex items-center w-full mb-12 md:mb-16 ${
        isLeft ? 'md:flex-row' : 'md:flex-row-reverse'
      } flex-row`}
    >
      {/* Timeline dot with emoji */}
      <div className="absolute left-4 md:left-1/2 md:-translate-x-1/2 w-10 h-10 bg-cream rounded-full border-[3px] border-amber-400 z-10 shadow-md flex items-center justify-center text-sm">
        {emoji}
      </div>

      {/* Content card */}
      <div
        className={`ml-14 md:ml-0 md:w-[calc(50%-2rem)] ${
          isLeft ? 'md:pr-10 md:text-right' : 'md:pl-10 md:text-left'
        }`}
      >
        <div className="bg-cream rounded-2xl p-6 shadow-sm hover:shadow-md transition-shadow border border-amber-200/60">
          <span className="inline-block text-xs font-semibold tracking-widest uppercase text-amber-500 mb-2">
            {event.month} {event.year}
          </span>
          <h3 className="font-[family-name:var(--font-heading)] text-xl text-ink-deep mb-2 italic">
            {event.title}
          </h3>
          <p className="text-sepia text-sm leading-relaxed mb-4">
            {event.description}
          </p>
          {event.image && (
            <div className="overflow-hidden rounded-xl">
              <img
                src={event.image}
                alt={event.title}
                loading="lazy"
                className="w-full h-48 object-cover rounded-xl hover:scale-105 transition-transform duration-500 img-film"
              />
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
}
