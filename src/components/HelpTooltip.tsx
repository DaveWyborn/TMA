'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type HelpTooltipProps = {
  text: string;
};

export default function HelpTooltip({ text }: HelpTooltipProps) {
  const [show, setShow] = useState(false);

  return (
    <span className="relative inline-block ml-1">
      <button
        onClick={() => setShow(!show)}
        onMouseEnter={() => setShow(true)}
        onMouseLeave={() => setShow(false)}
        className="inline-flex items-center justify-center w-4 h-4 text-xs bg-gray-600 hover:bg-gray-500 text-white rounded-full cursor-help transition-colors"
        aria-label="Help"
        type="button"
      >
        ?
      </button>
      <AnimatePresence>
        {show && (
          <motion.div
            initial={{ opacity: 0, y: -5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 w-64 p-3 mt-2 text-xs bg-gray-800 border border-gray-600 rounded shadow-lg -left-24"
            onMouseEnter={() => setShow(true)}
            onMouseLeave={() => setShow(false)}
          >
            <div className="text-gray-200">{text}</div>
            <div className="absolute w-2 h-2 bg-gray-800 border-t border-l border-gray-600 transform rotate-45 -top-1 left-1/2 -translate-x-1/2"></div>
          </motion.div>
        )}
      </AnimatePresence>
    </span>
  );
}
