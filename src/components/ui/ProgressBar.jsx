import { motion } from 'framer-motion';

export default function ProgressBar({ percent, label }) {
  return (
    <div className="w-full">
      {label && (
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-ink">{label}</span>
          <span className="text-sm font-medium text-amber-500">{percent}%</span>
        </div>
      )}
      <div className="w-full h-2 bg-amber-200/50 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          whileInView={{ width: `${percent}%` }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: 'easeOut', delay: 0.3 }}
          className="h-full bg-gradient-to-r from-amber-400 to-amber-500 rounded-full"
        />
      </div>
    </div>
  );
}
