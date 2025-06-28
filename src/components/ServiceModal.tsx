"use client";

import { motion, AnimatePresence } from "framer-motion";

export default function ServiceModal({
  isOpen,
  onClose,
  title,
  details,
  points,
}: {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  details: string;
  points: string[];
}) {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full text-left"
            initial={{ scale: 0.95 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.95 }}
          >
            <h3 className="text-2xl font-bold mb-4 text-[#1B1F3B]">{title}</h3>
            <p className="text-gray-700 mb-4 whitespace-pre-line">{details}</p>

            {points.length > 0 && (
              <ul className="list-disc list-inside text-gray-700 mb-6 space-y-2">
                {points.map((point, idx) => (
                  <li key={idx}>{point}</li>
                ))}
              </ul>
            )}

            <button
              onClick={onClose}
              className="bg-[#1B1F3B] text-white px-4 py-2 rounded hover:bg-[#313863] transition"
            >
              Close
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}   