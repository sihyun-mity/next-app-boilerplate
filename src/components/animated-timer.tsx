'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { ComponentProps, useEffect, useId, useState } from 'react';
import { cn } from '@/utils';

type Props = Omit<ComponentProps<'div'>, 'children'> & {
  value: number;
};

export function AnimatedTimer({ value, className, ...props }: Readonly<Props>) {
  const [displayedValue, setDisplayedValue] = useState<number>(value);
  const componentId = useId();

  useEffect(() => {
    if (value !== displayedValue) {
      const timeout = setTimeout(() => setDisplayedValue(value), 250);
      return () => clearTimeout(timeout);
    }
  }, [value, displayedValue]);

  return (
    <div className={cn('relative overflow-hidden', className)} {...props}>
      <AnimatePresence mode="popLayout">
        <motion.div
          key={`animated-digit-${componentId}-${value}`}
          initial={{ y: '-100%', opacity: 0 }}
          animate={{ y: '0%', opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="mx-auto w-max"
        >
          {String(value).padStart(2, '0')}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
