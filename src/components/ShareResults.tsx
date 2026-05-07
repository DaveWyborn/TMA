'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

type ShareResultsProps = {
  toolName: string;
  scannedUrl: string;
};

export default function ShareResults({ toolName, scannedUrl }: ShareResultsProps) {
  const [showModal, setShowModal] = useState(false);
  const [comments, setComments] = useState('');
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);

    try {
      const res = await fetch('/api/share-results', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          toolName,
          scannedUrl,
          name,
          email,
          comments,
        }),
      });

      if (res.ok) {
        setSubmitted(true);
        setTimeout(() => {
          setShowModal(false);
          setSubmitted(false);
          setComments('');
          setEmail('');
          setName('');
        }, 3000);
      } else {
        alert('Failed to send. Please try again.');
      }
    } catch (err) {
      console.error('Share error:', err);
      alert('Failed to send. Please try again.');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <>
      <div className="mt-8 p-6 border-2 border-[var(--accent-soft)] rounded-lg bg-gradient-to-br from-purple-900/20 to-blue-900/20">
        <h3 className="text-xl font-bold mb-2">Need Help With These Results?</h3>
        <p className="text-sm text-gray-300 mb-4">
          Share your results with Dave at Tailor Made Analytics for expert review and recommendations on your next call.
        </p>
        <button
          onClick={() => setShowModal(true)}
          className="px-6 py-3 bg-[var(--accent-soft)] text-white rounded-lg hover:shadow-lg hover:shadow-[var(--accent-soft)]/30 transition-all font-semibold"
        >
          📤 Share Results with TMA
        </button>
      </div>

      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
            onClick={() => !submitting && setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              className="bg-gray-900 border border-gray-600 rounded-lg p-6 max-w-md w-full"
              onClick={(e) => e.stopPropagation()}
            >
              {!submitted ? (
                <>
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-white">Share Results</h3>
                      <p className="text-sm text-gray-400 mt-1">
                        Send {toolName} results to Dave
                      </p>
                    </div>
                    <button
                      onClick={() => setShowModal(false)}
                      className="text-gray-400 hover:text-white text-2xl"
                      disabled={submitting}
                    >
                      ×
                    </button>
                  </div>

                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-300">
                        Scanned URL
                      </label>
                      <input
                        type="text"
                        value={scannedUrl}
                        disabled
                        className="w-full p-2 bg-gray-800 border border-gray-600 rounded text-sm text-gray-400"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-300">
                        Your Name *
                      </label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        placeholder="John Smith"
                        className="w-full p-2 bg-gray-800 border border-gray-600 rounded text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-300">
                        Your Email *
                      </label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder="you@example.com"
                        className="w-full p-2 bg-gray-800 border border-gray-600 rounded text-white"
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium mb-1 text-gray-300">
                        Comments or Questions (optional)
                      </label>
                      <textarea
                        value={comments}
                        onChange={(e) => setComments(e.target.value)}
                        placeholder="What would you like Dave to look at?"
                        rows={3}
                        className="w-full p-2 bg-gray-800 border border-gray-600 rounded text-white"
                      />
                    </div>

                    <div className="flex gap-3">
                      <button
                        type="submit"
                        disabled={submitting}
                        className="flex-1 px-4 py-2 bg-[var(--accent-soft)] text-white rounded hover:opacity-90 transition-opacity disabled:opacity-50"
                      >
                        {submitting ? 'Sending...' : 'Send to Dave'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowModal(false)}
                        disabled={submitting}
                        className="px-4 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </>
              ) : (
                <div className="text-center py-8">
                  <div className="text-6xl mb-4">✓</div>
                  <h3 className="text-xl font-bold text-white mb-2">Results Sent!</h3>
                  <p className="text-sm text-gray-400">
                    Dave will review your results and discuss on your next call.
                  </p>
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
