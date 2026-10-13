import React from 'react';
import { motion, useReducedMotion } from 'motion/react';

interface RevealProps {
  children: React.ReactNode;
  className?: string;
  /** Seconds to wait before starting, for staggering siblings. */
  delay?: number;
  /** Animate on mount instead of when scrolled into view (used above the fold). */
  immediate?: boolean;
}

// Fades content up into place once, to pace the page as it is read.
// Renders static content when the visitor prefers reduced motion.
export const Reveal: React.FC<RevealProps> = ({ children, className, delay = 0, immediate = false }) => {
  const reduce = useReducedMotion();
  const visible = { opacity: 1, y: 0 };
  const transition = { duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] as const };

  if (reduce) return <div className={className}>{children}</div>;

  return immediate ? (
    <motion.div className={className} initial={{ opacity: 0, y: 20 }} animate={visible} transition={transition}>
      {children}
    </motion.div>
  ) : (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 28 }}
      whileInView={visible}
      viewport={{ once: true, amount: 0.15 }}
      transition={transition}
    >
      {children}
    </motion.div>
  );
};
