import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface AnimatedSectionProps extends React.HTMLAttributes<HTMLElement> {
  children: React.ReactNode;
  delay?: number;
}

export function AnimatedSection({ children, className, delay = 0, ...props }: AnimatedSectionProps) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1], delay }}
      className={cn("w-full max-w-5xl mx-auto px-6 py-24 md:py-32", className)}
      {...props}
    >
      {children}
    </motion.section>
  );
}
