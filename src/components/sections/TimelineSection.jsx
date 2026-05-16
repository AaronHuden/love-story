import { motion } from 'framer-motion';
import SectionWrapper from '../ui/SectionWrapper';
import TimelineItem from '../ui/TimelineItem';
import timelineData from '../../data/timeline.json';

export default function TimelineSection() {
  return (
    <SectionWrapper
      id="timeline"
      title="Our Journey"
      subtitle="From that first embrace to forever"
      dark
    >
      <div className="relative">
        {/* Center line — desktop */}
        <motion.div
          initial={{ scaleY: 0 }}
          whileInView={{ scaleY: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          style={{ transformOrigin: 'top' }}
          className="hidden md:block absolute left-1/2 -translate-x-px top-0 bottom-0 w-0.5 bg-amber-300/60"
        />

        {/* Mobile left line */}
        <motion.div
          initial={{ scaleY: 0 }}
          whileInView={{ scaleY: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, ease: 'easeOut' }}
          style={{ transformOrigin: 'top' }}
          className="md:hidden absolute left-6 top-0 bottom-0 w-0.5 bg-amber-300/60"
        />

        {timelineData.events.map((event, i) => (
          <TimelineItem
            key={i}
            event={event}
            index={i}
            isLeft={i % 2 === 0}
          />
        ))}
      </div>
    </SectionWrapper>
  );
}
