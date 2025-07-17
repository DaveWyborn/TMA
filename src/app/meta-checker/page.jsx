'use client';

import { useState } from 'react';
import Navbar from '../../components/NavBar';
import Image from 'next/image';

export default function MetaCheckerPage() {
  const [myURL, setMyURL] = useState('');
  const [compURL, setCompURL] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showLog, setShowLog] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    console.log('🔍 Form submitted');
    setLoading(true);

    try {
      const res = await fetch('/api/meta-checker', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ myURL, compURL }),
      });

      const data = await res.json();
      console.log('✅ Final Results:', data);
      setResults(data);
    } catch (err) {
      console.error('❌ Fetch or parsing error:', err.message);
    } finally {
      setLoading(false);
    }
  }

  function handleReset() {
    setMyURL('');
    setCompURL('');
    setResults(null);
  }

  return (
    <>
      <Navbar />

      <div className="meta-checker-container">
        <div className="flex flex-col items-center mb-6">
          <Image
            src="/images/TMA Light Logo Transparent.png"
            alt="Tailor Made Analytics Logo"
            width={200}
            height={80}
            priority
          />
        </div>
        <div className="bg-yellow-600 text-black p-2 text-center mb-4 rounded">
          🚧 <strong>Beta:</strong> This tool is in early beta. Features may break, be removed, or change without warning.
        </div>

        <p className="mb-4 text-xs text-gray-300">
          Note: Usage is logged for test purposes.
        </p>

        <h1 className="meta-checker-heading">SEO Meta Checker</h1>

        <form onSubmit={handleSubmit} className="dark-form mb-8">
          <div>
            <label className="block mb-1">Your URL:</label>
            <input
              type="url"
              value={myURL}
              onChange={(e) => setMyURL(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block mb-1">Competitor URL (optional):</label>
            <input
              type="url"
              value={compURL}
              onChange={(e) => setCompURL(e.target.value)}
              placeholder="Leave blank to check only your page"
            />
          </div>

          <div className="flex gap-4 mt-4">
            <button
              type="submit"
              className="dark-button"
              disabled={loading}
            >
              {loading ? 'Checking...' : 'Compare'}
            </button>

            <button
              type="button"
              className="dark-button"
              onClick={handleReset}
            >
              Reset
            </button>
          </div>
        </form>

        {results && (
          <div className="meta-checker-results mt-12">
            <h2 className="text-xl font-semibold mb-2">Meta Tags</h2>
            <table className="w-full border border-gray-300 mb-6">
              <thead>
                <tr style={{ background: 'var(--deep-purple)', color: 'var(--light-text)' }}>
                  <th className="border p-2 text-left">Element</th>
                  <th className="border p-2 text-left">Your Page</th>
                  {compURL && results.comp && <th className="border p-2 text-left">Competitor Page</th>}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-2">Title</td>
                  <td className="border p-2">{results.my.title}</td>
                  {compURL && results.comp && <td className="border p-2">{results.comp.title}</td>}
                </tr>
                <tr>
                  <td className="border p-2">Meta Description</td>
                  <td className="border p-2">{results.my.description}</td>
                  {compURL && results.comp && <td className="border p-2">{results.comp.description}</td>}
                </tr>
                <tr>
                  <td className="border p-2">Meta Keywords</td>
                  <td className="border p-2">{results.my.keywords}</td>
                  {compURL && results.comp && <td className="border p-2">{results.comp.keywords}</td>}
                </tr>
              </tbody>
            </table>

            <h2 className="text-xl font-semibold mb-2">Schema Summary</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {[{ label: 'Your Page', data: results.my.schemaSummary },
                { label: 'Competitor Page', data: results.comp?.schemaSummary || [] }]
                .filter(section => section.data && section.data.length > 0)
                .map((section, idx) => (
                  <div key={idx} className="p-4 border border-gray-500 rounded">
                    <h3 className="font-bold text-lg mb-2">{section.label}</h3>
                    {section.data.map((block, i) => (
                      <div key={i} className="mb-3">
                        <p className="font-semibold">Type: {block.type}</p>
                        <ul className="pl-5 list-disc">
                          {Object.entries(block).map(([key, val]) => (
                            key !== 'type' ? <li key={key}><strong>{key}</strong>: {val}</li> : null
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                ))}
            </div>

            <div className="mt-10">
              <button
                className="text-sm text-[var(--accent-soft)] underline"
                onClick={() => setShowLog(prev => !prev)}
              >
                {showLog ? 'Hide' : 'Show'} Changelog & Beta Notes
              </button>
              {showLog && (
                <div className="mt-4 border border-gray-600 p-4 rounded text-sm text-gray-300 bg-black/20">
                  <h3 className="text-lg font-bold mb-2">🧪 Meta Checker Beta</h3>
                  <p><strong>Initial Features:</strong> Title, description, keywords, schema detection with comparison.</p>
                  <p><strong>Schema Extraction:</strong> Currently supports WebSite, Organization, Article, FAQPage types.</p>
                  <p><strong>Coming Soon:</strong></p>
                  <ul className="list-disc pl-6">
                    <li>Schema score or completeness indicator</li>
                    <li>Optional PDF export</li>
                    <li>Basic schema generator templates</li>
                    <li>Audit history and bookmarks</li>
                  </ul>
                  <p className="mt-4 italic text-xs">Built by Tailor Made Analytics — designed to help you see what your competitors aren’t showing Google.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  );
}
