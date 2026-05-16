import { motion } from 'framer-motion';

export default function SectionWrapper({
  id,
  title,
  subtitle,
  children,
  className = '',
  dark = false,
  fullHeight = false,
}) {
  return (
    <section
      id={id}
      className={`relative py-20 md:py-32 ${dark ? 'bg-cream-dark' : 'bg-cream'} ${fullHeight ? 'min-h-screen flex items-center' : ''} ${className}`}
    >
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        {title && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="font-[family-name:var(--font-heading)] text-4xl md:text-5xl text-ink-deep italic">
              {title}
            </h2>
            {subtitle && (
              <p className="mt-3 text-sepia font-light text-lg tracking-wide">
                {subtitle}
              </p>
            )}
            <div className="mx-auto mt-4 w-16 h-0.5 bg-amber-400 rounded-full" />
          </motion.div>
        )}
        {children}
      </div>
    </section>
  );
}
