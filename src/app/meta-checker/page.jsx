'use client';

import { useState } from 'react';

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

  return (
    <div className=\"p-8 max-w-2xl mx-auto\">
      <h1 className=\"text-3xl font-bold mb-2\">SEO Meta Checker</h1>
      <p className=\"mb-6 text-gray-700\">Use this tool to compare the page title, meta description, and keywords between your page and a competitor's page. Enter the URLs below and click Compare.</p>

      <form onSubmit={handleSubmit} className=\"space-y-4\">
        <div>
          <label>Your URL:</label>
          <input type=\"url\" value={myURL} onChange={e => setMyURL(e.target.value)} className=\"w-full border p-2\" required />
        </div>
        <div>
          <label>Competitor URL:</label>
          <input type=\"url\" value={compURL} onChange={e => setCompURL(e.target.value)} className=\"w-full border p-2\" required />
        </div>
        <button type=\"submit\" className=\"bg-blue-600 text-white px-4 py-2\">{loading ? 'Checking...' : 'Compare'}</button>
      </form>

      {results && (
        <div className=\"mt-8\">
          <h2 className=\"text-xl font-semibold mb-2\">Results</h2>
          <table className=\"w-full border\">
            <thead>
              <tr>
                <th className=\"border p-2\">Element</th>
                <th className=\"border p-2\">Your Page</th>
                <th className=\"border p-2\">Competitor Page</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className=\"border p-2\">Title</td>
                <td className=\"border p-2\">{results.my.title}</td>
                <td className=\"border p-2\">{results.comp.title}</td>
              </tr>
              <tr>
                <td className=\"border p-2\">Meta Description</td>
                <td className=\"border p-2\">{results.my.description}</td>
                <td className=\"border p-2\">{results.comp.description}</td>
              </tr>
              <tr>
                <td className=\"border p-2\">Meta Keywords</td>
                <td className=\"border p-2\">{results.my.keywords}</td>
                <td className=\"border p-2\">{results.comp.keywords}</td>
              </tr>
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
