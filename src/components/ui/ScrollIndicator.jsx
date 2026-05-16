import { motion } from 'framer-motion';
import { HiChevronDown } from 'react-icons/hi';

export default function ScrollIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 1.5, duration: 0.8 }}
      className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1 text-amber-200/80 drop-shadow-[0_1px_4px_rgba(0,0,0,0.5)]"
    >
      <span className="text-xs tracking-widest uppercase">Scroll</span>
      <motion.div
        animate={{ y: [0, 8, 0] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'easeInOut' }}
      >
        <HiChevronDown size={20} />
      </motion.div>
    </motion.div>
  );
}
