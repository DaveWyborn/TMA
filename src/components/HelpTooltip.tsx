'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type HelpTooltipProps = {
  text: string;
};

export default function HelpTooltip({ text }: HelpTooltipProps) {
  const [show, setShow] = useState(false);

  return (
    <span className="relative inline-block ml-2 align-middle">
      <button
        onClick={() => setShow(!show)}
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        className="help-pill"
        aria-label="Help"
        type="button"
      >
        ?
      </button>
      <AnimatePresence>
        {show && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className="help-popover"
            onMouseEnter={() => setShow(true)}
            onMouseLeave={() => setShow(false)}
          >
            {text}
          </motion.div>
        )}
      </AnimatePresence>
    </span>
  );
}
