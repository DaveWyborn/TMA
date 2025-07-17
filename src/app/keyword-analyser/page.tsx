'use client';

import { useState } from 'react';
import Navbar from '../../components/NavBar';
import Image from 'next/image';

type KeywordResult = {
  tag: string;
  url1: { count: number; snippets: string[] };
  url2?: { count: number; snippets: string[] } | null;
};

type Results = {
  tags: KeywordResult[];
};

export default function KeywordAnalyserPage() {
  const [keyword, setKeyword] = useState('');
  const [url1, setUrl1] = useState('');
  const [url2, setUrl2] = useState('');
  const [results, setResults] = useState<Results | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    const res = await fetch('/api/keyword-analyser', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ keyword, url1, url2 }),
    });

    const data = await res.json();
    setResults(data);
    setLoading(false);
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

        <h1 className="meta-checker-heading">Keyword Analyser</h1>

        <form onSubmit={handleSubmit} className="dark-form">
          <div>
            <label className="block mb-1">Keyword:</label>
            <input
              type="text"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
              required
              className="w-full border p-2"
            />
          </div>

          <div>
            <label className="block mb-1">URL 1:</label>
            <input
              type="url"
              value={url1}
              onChange={(e) => setUrl1(e.target.value)}
              required
              className="w-full border p-2"
            />
          </div>

          <div>
            <label className="block mb-1">URL 2 (optional):</label>
            <input
              type="url"
              value={url2}
              onChange={(e) => setUrl2(e.target.value)}
              className="w-full border p-2"
            />
          </div>

          <button type="submit" disabled={loading} className="dark-button">
            {loading ? 'Checking...' : 'Run Check'}
          </button>
        </form>

        {results && results.tags && (
  <div className="keyword-analyser-results">
    <h2 className="text-xl font-semibold mb-2">Results</h2>
    <table className="w-full border border-gray-300">
      <thead>
        <tr className="bg-gray-700 text-white">
          <th className="border p-2 text-left">Tag</th>
          <th className="border p-2 text-left">Occurrences (URL 1)</th>
          {url2 && (
            <th className="border p-2 text-left">Occurrences (URL 2)</th>
          )}
        </tr>
      </thead>
      <tbody>
        {results.tags.map((tag) => (
          <tr key={tag.tag}>
            <td className="border p-2">{tag.tag}</td>
            <td className="border p-2">
              {tag.url1.count}
              {tag.url1.snippets.length > 0 && (
                <ul className="mt-2 list-disc list-inside text-xs">
                  {tag.url1.snippets.map((s, i) => (
                    <li key={i}>“{s}...”</li>
                  ))}
                </ul>
              )}
            </td>
            {url2 && tag.url2 && (
              <td className="border p-2">
                {tag.url2.count}
                {tag.url2.snippets.length > 0 && (
                  <ul className="mt-2 list-disc list-inside text-xs">
                    {tag.url2.snippets.map((s, i) => (
                      <li key={i}>“{s}...”</li>
                    ))}
                  </ul>
                )}
              </td>
            )}
          </tr>
        ))}
      </tbody>
    </table>
  </div>
)}
      </div>
    </>
  );
}
