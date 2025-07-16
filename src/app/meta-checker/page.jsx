'use client';

import { useState } from 'react';
import Navbar from '../../components/NavBar';
import Image from 'next/image';

export default function MetaCheckerPage() {
  const [myURL, setMyURL] = useState('');
  const [compURL, setCompURL] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e) {
    e.preventDefault();
    setLoading(true);

    const res = await fetch('/api/meta-checker', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ myURL, compURL }),
    });

    const data = await res.json();
    setResults(data);
    setLoading(false);
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

        <p className="mb-4">
    👉 Also check out our{' '}
    <a href="/keyword-keyword-analyser" className="underline text-[var(--accent-soft)] hover:text-[var(--light-text)]">
      Keyword Analyser Tool
    </a>
    !
  </p>


        <p className="mb-6 text-gray-200">
          Use this tool to check your page's title, meta description, and keywords — or compare your page with a competitor. The second URL is optional.
        </p>
        


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
            <h2 className="text-xl font-semibold mb-2">Results</h2>
            <table className="w-full border border-gray-300">
              <thead>
                <tr style={{ background: 'var(--deep-purple)', color: 'var(--light-text)' }}>
                  <th className="border p-2 text-left">Element</th>
                  <th className="border p-2 text-left">Your Page</th>
                  {compURL && <th className="border p-2 text-left">Competitor Page</th>}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-2">Title</td>
                  <td className="border p-2">{results.my.title}</td>
                  {compURL && <td className="border p-2">{results.comp.title}</td>}
                </tr>
                <tr>
                  <td className="border p-2">Meta Description</td>
                  <td className="border p-2">{results.my.description}</td>
                  {compURL && <td className="border p-2">{results.comp.description}</td>}
                </tr>
                <tr>
                  <td className="border p-2">Meta Keywords</td>
                  <td className="border p-2">{results.my.keywords}</td>
                  {compURL && <td className="border p-2">{results.comp.keywords}</td>}
                </tr>
              </tbody>
            </table>

            <p className="mt-4 text-sm text-gray-300">
              Note: Google ignores the &lt;meta name="keywords"&gt; tag, but some other search engines may still reference it.
            </p>
          </div>
        )}
      </div>
    </>
  );
}
