import { useScroll, useTransform, motion } from 'framer-motion';
import DaysCounter from '../ui/DaysCounter';
import ScrollIndicator from '../ui/ScrollIndicator';
import { useDaysTogether } from '../../hooks/useDaysTogether';
import coupleData from '../../data/couple.json';

const PHOTO_SLOTS = [
  { col: '1 / 9', row: '1 / 4', rotate: '-1deg', scale: 'scale-105' },
  { col: '7 / 13', row: '1 / 4', rotate: '1.5deg', scale: 'scale-105' },
  { col: '1 / 6', row: '3 / 5', rotate: '-0.5deg', scale: 'scale-105' },
  { col: '5 / 13', row: '3 / 5', rotate: '2deg', scale: 'scale-110' },
];

export default function HeroSection() {
  const { scrollY } = useScroll();
  const bgY = useTransform(scrollY, [0, 600], [0, 80]);
  const textY = useTransform(scrollY, [0, 600], [0, -80]);
  const opacity = useTransform(scrollY, [0, 400], [1, 0.3]);

  const { days } = useDaysTogether(coupleData.relationshipStart);
  const photos = coupleData.heroPhotos || [];

  return (
    <section
      id="hero"
      className="relative h-screen min-h-[650px] overflow-hidden bg-ink-deep"
    >
      {/* Photo collage background */}
      <motion.div style={{ y: bgY }} className="absolute inset-0">
        <div className="absolute inset-0 grid grid-cols-12 grid-rows-4 gap-2 md:gap-3 p-2 md:p-3">
          {photos.map((photo, i) => (
            <div
              key={i}
              className="relative overflow-hidden rounded-2xl shadow-2xl"
              style={{
                gridColumn: PHOTO_SLOTS[i]?.col || 'auto',
                gridRow: PHOTO_SLOTS[i]?.row || 'auto',
                transform: `rotate(${PHOTO_SLOTS[i]?.rotate || '0deg'})`,
              }}
            >
              <img
                src={photo}
                alt=""
                className={`w-full h-full object-cover img-film ${PHOTO_SLOTS[i]?.scale || ''}`}
              />
              <div className="absolute inset-0 ring-1 ring-white/10 rounded-2xl pointer-events-none" />
            </div>
          ))}
        </div>
      </motion.div>

      {/* Retro warm overlay for text readability */}
      <div className="absolute inset-0 pointer-events-none z-[2]">
        {/* Left edge fade */}
        <div
          className="absolute left-0 top-0 bottom-0 w-[28%] md:w-[22%]"
          style={{
            background:
              'linear-gradient(to right, rgba(30,20,10,0.8) 0%, rgba(30,20,10,0.4) 40%, transparent 100%)',
          }}
        />
        {/* Right edge fade */}
        <div
          className="absolute right-0 top-0 bottom-0 w-[28%] md:w-[22%]"
          style={{
            background:
              'linear-gradient(to left, rgba(30,20,10,0.8) 0%, rgba(30,20,10,0.4) 40%, transparent 100%)',
          }}
        />
        {/* Top gradient */}
        <div
          className="absolute top-0 left-0 right-0 h-[25%]"
          style={{
            background:
              'linear-gradient(to bottom, rgba(25,15,8,0.6) 0%, transparent 100%)',
          }}
        />
        {/* Full warm sepia overlay */}
        <div
          className="absolute inset-0"
          style={{
            background:
              'linear-gradient(to bottom, rgba(35,22,12,0.6) 0%, rgba(35,22,12,0.45) 30%, rgba(35,22,12,0.55) 60%, rgba(30,18,8,0.78) 100%)',
          }}
        />
      </div>

      {/* Content */}
      <motion.div
        style={{ y: textY, opacity }}
        className="relative z-10 flex flex-col items-center justify-center h-full text-center px-4"
      >
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="text-amber-200/80 text-lg md:text-xl font-light tracking-[0.2em] uppercase mb-4 drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]"
        >
          Our Love Story
        </motion.p>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="font-[family-name:var(--font-heading)] text-5xl md:text-7xl lg:text-8xl text-cream mb-6 drop-shadow-[0_4px_16px_rgba(0,0,0,0.7)] italic"
        >
          {coupleData.name1}
          <span className="text-amber-300 mx-2 md:mx-4 drop-shadow-[0_4px_16px_rgba(0,0,0,0.7)]">
            &amp;
          </span>
          {coupleData.name2}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.45 }}
          className="text-amber-200/80 text-base md:text-lg font-light max-w-md mb-8 drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)]"
        >
          {coupleData.bio}
        </motion.p>

        <DaysCounter days={days} />
      </motion.div>

      <ScrollIndicator />
    </section>
  );
}
