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
        body: JSON.stringify({ toolName, scannedUrl, name, email, comments }),
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
      <div className="share-panel">
        <p
          className="brand-tag"
          style={{ color: 'var(--paper-on-ink)', marginBottom: '0.75rem' }}
        >
          Want a second opinion?
        </p>
        <h3>Share these results with us.</h3>
        <p>
          Send your {toolName.toLowerCase()} results to Dave for a review and a recommendation
          on what to do next — no obligation, no pitch.
        </p>
        <button
          onClick={() => setShowModal(true)}
          className="btn-ink on-ink"
          type="button"
        >
          Share results →
        </button>
      </div>

      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4"
            style={{ background: 'rgba(20, 23, 31, 0.6)' }}
            onClick={() => !submitting && setShowModal(false)}
          >
            <motion.div
              initial={{ y: 16, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 16, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="w-full max-w-md"
              style={{
                background: 'var(--paper)',
                border: '1px solid var(--ink)',
                borderRadius: 'var(--radius)',
                padding: '1.75rem',
              }}
              onClick={(e) => e.stopPropagation()}
            >
              {!submitted ? (
                <>
                  <p className="brand-tag" style={{ marginBottom: '0.5rem' }}>
                    Share results
                  </p>
                  <h3
                    className="display"
                    style={{ fontSize: '24px', marginBottom: '0.4rem' }}
                  >
                    Send to Dave
                  </h3>
                  <p
                    style={{
                      fontSize: '14px',
                      color: 'var(--ink-soft)',
                      marginBottom: '1.75rem',
                    }}
                  >
                    {toolName} results for{' '}
                    <span className="tool-code">{scannedUrl}</span>
                  </p>

                  <form onSubmit={handleSubmit} className="flex flex-col gap-5">
                    <div>
                      <label className="field-label">Your name</label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        required
                        placeholder="Jane Smith"
                        className="field"
                      />
                    </div>

                    <div>
                      <label className="field-label">Your email</label>
                      <input
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        placeholder="you@company.com"
                        className="field"
                      />
                    </div>

                    <div>
                      <label className="field-label">
                        Anything you want Dave to focus on? (optional)
                      </label>
                      <textarea
                        value={comments}
                        onChange={(e) => setComments(e.target.value)}
                        placeholder="e.g. ‘help with mobile speed’ or ‘meta tags vs competitor X’"
                        rows={3}
                        className="field"
                      />
                    </div>

                    <div className="flex gap-3 pt-2">
                      <button
                        type="submit"
                        disabled={submitting}
                        className="btn-ink"
                      >
                        {submitting ? 'Sending…' : 'Send to Dave →'}
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowModal(false)}
                        disabled={submitting}
                        className="btn-ghost"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </>
              ) : (
                <div className="text-center py-6">
                  <p className="brand-tag" style={{ marginBottom: '0.5rem' }}>
                    Sent
                  </p>
                  <h3
                    className="display"
                    style={{ fontSize: '24px', marginBottom: '0.4rem' }}
                  >
                    Results on the way.
                  </h3>
                  <p style={{ fontSize: '14px', color: 'var(--ink-soft)' }}>
                    Dave will be in touch shortly.
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
