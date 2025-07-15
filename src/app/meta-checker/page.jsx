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

        <h1 className="text-3xl font-bold mb-2" style={{ color: 'var(--deep-purple)' }}>SEO Meta Checker</h1>
        <p className="mb-6 text-gray-200">
          Use this tool to compare the page title, meta description, and keywords
          between your page and a competitor's page. Enter the URLs below and click Compare.
        </p>

        <form onSubmit={handleSubmit} className="meta-checker-form mb-8">
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
            <label className="block mb-1">Competitor URL:</label>
            <input
              type="url"
              value={compURL}
              onChange={(e) => setCompURL(e.target.value)}
              required
            />
          </div>

          <div className="flex gap-4 mt-4">
            <button
              type="submit"
              className="compare-button"
              disabled={loading}
            >
              {loading ? 'Checking...' : 'Compare'}
            </button>

            <button
              type="button"
              className="compare-button"
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
                  <th className="border p-2 text-left">Competitor Page</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-2">Title</td>
                  <td className="border p-2">{results.my.title}</td>
                  <td className="border p-2">{results.comp.title}</td>
                </tr>
                <tr>
                  <td className="border p-2">Meta Description</td>
                  <td className="border p-2">{results.my.description}</td>
                  <td className="border p-2">{results.comp.description}</td>
                </tr>
                <tr>
                  <td className="border p-2">Meta Keywords</td>
                  <td className="border p-2">{results.my.keywords}</td>
                  <td className="border p-2">{results.comp.keywords}</td>
                </tr>
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}
