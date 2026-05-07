'use client';

// Keyword Analyser

import { useState } from 'react';
import Navbar from '../../components/NavBar';
import Image from 'next/image';
import ShareResults from '../../components/ShareResults';
import HelpTooltip from '../../components/HelpTooltip';

type KeywordResult = {
  tag: string;
  url1: { count: number; snippets: string[] };
  url2?: { count: number; snippets: string[] } | null;
};

type SummaryData = {
  density: string;
  totalOccurrences: number;
  wordCount: number;
  inURL: boolean;
  inTitle: boolean;
  inH1: boolean;
  imageAltCount: number;
};

type Results = {
  tags: KeywordResult[];
  url1Summary: SummaryData;
  url2Summary?: SummaryData | null;
  note?: string;
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

        <div className="mb-6 p-4 bg-gray-800/50 border border-gray-700 rounded-lg">
          <p className="text-sm text-gray-300 leading-relaxed">
            <strong className="text-white">What this tool does:</strong> Analyzes keyword usage across your page - density, placement in title/H1/URL, and distribution across headings and content. Compare against competitors.
          </p>
          <p className="text-xs text-gray-400 mt-2">
            <strong>Why it matters:</strong> Strategic keyword placement signals page topic to search engines. Too little = missed opportunity. Too much = keyword stuffing penalty.
          </p>
        </div>

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
    <h2 className="text-xl font-semibold mb-4 flex items-center">
      Keyword Summary
      <HelpTooltip text="Keyword density is the percentage of times your keyword appears compared to total words. Ideal range: 1-2% for primary keywords. Placement in URL, title, and H1 are critical ranking signals." />
    </h2>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
      <div className="p-4 border border-gray-500 rounded bg-gray-900/30">
        <h3 className="font-bold mb-3">URL 1</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Keyword Density:</span>
            <strong className="text-green-400">{results.url1Summary.density}</strong>
          </div>
          <div className="flex justify-between">
            <span>Total Occurrences:</span>
            <strong>{results.url1Summary.totalOccurrences}</strong>
          </div>
          <div className="flex justify-between">
            <span>Total Words:</span>
            <strong>{results.url1Summary.wordCount}</strong>
          </div>
          <div className="border-t border-gray-600 pt-2 mt-2">
            <div className="flex justify-between">
              <span>In URL:</span>
              <strong>{results.url1Summary.inURL ? '✓ Yes' : '✗ No'}</strong>
            </div>
            <div className="flex justify-between">
              <span>In Title:</span>
              <strong>{results.url1Summary.inTitle ? '✓ Yes' : '✗ No'}</strong>
            </div>
            <div className="flex justify-between">
              <span>In H1:</span>
              <strong>{results.url1Summary.inH1 ? '✓ Yes' : '✗ No'}</strong>
            </div>
            <div className="flex justify-between">
              <span>In Image Alts:</span>
              <strong>{results.url1Summary.imageAltCount}</strong>
            </div>
          </div>
        </div>
      </div>
      {url2 && results.url2Summary && (
        <div className="p-4 border border-gray-500 rounded bg-gray-900/30">
          <h3 className="font-bold mb-3">URL 2</h3>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Keyword Density:</span>
              <strong className="text-green-400">{results.url2Summary.density}</strong>
            </div>
            <div className="flex justify-between">
              <span>Total Occurrences:</span>
              <strong>{results.url2Summary.totalOccurrences}</strong>
            </div>
            <div className="flex justify-between">
              <span>Total Words:</span>
              <strong>{results.url2Summary.wordCount}</strong>
            </div>
            <div className="border-t border-gray-600 pt-2 mt-2">
              <div className="flex justify-between">
                <span>In URL:</span>
                <strong>{results.url2Summary.inURL ? '✓ Yes' : '✗ No'}</strong>
              </div>
              <div className="flex justify-between">
                <span>In Title:</span>
                <strong>{results.url2Summary.inTitle ? '✓ Yes' : '✗ No'}</strong>
              </div>
              <div className="flex justify-between">
                <span>In H1:</span>
                <strong>{results.url2Summary.inH1 ? '✓ Yes' : '✗ No'}</strong>
              </div>
              <div className="flex justify-between">
                <span>In Image Alts:</span>
                <strong>{results.url2Summary.imageAltCount}</strong>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>

    <h2 className="text-xl font-semibold mb-2 mt-8">Detailed Breakdown</h2>
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

    {/* Recommendations */}
    {!url2 && (
      <>
        <div className="mt-12 p-6 bg-blue-900/20 border border-blue-600 rounded-lg">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <span>💡</span> Recommended Next Steps
          </h2>
          <div className="space-y-3 text-sm">
            {/* Check keyword density */}
            {parseFloat(results.url1Summary.density) < 0.5 && (
              <div className="p-3 bg-yellow-900/20 border-l-4 border-yellow-500">
                <strong className="text-yellow-400">⚠ Low Keyword Density</strong>
                <p className="text-gray-300 mt-1">
                  Your keyword density is {results.url1Summary.density}. Consider increasing usage naturally throughout your content. Aim for 1-2% for primary keywords.
                </p>
              </div>
            )}
            {parseFloat(results.url1Summary.density) > 3 && (
              <div className="p-3 bg-yellow-900/20 border-l-4 border-yellow-500">
                <strong className="text-yellow-400">⚠ High Keyword Density</strong>
                <p className="text-gray-300 mt-1">
                  Your keyword density is {results.url1Summary.density}. This may appear as keyword stuffing. Consider reducing usage to 1-2%.
                </p>
              </div>
            )}

            {/* Check URL placement */}
            {!results.url1Summary.inURL && (
              <div className="p-3 bg-yellow-900/20 border-l-4 border-yellow-500">
                <strong className="text-yellow-400">⚠ Keyword Not in URL</strong>
                <p className="text-gray-300 mt-1">
                  Include your target keyword in the page URL for better SEO. URLs are a strong ranking signal.
                </p>
              </div>
            )}

            {/* Check title placement */}
            {!results.url1Summary.inTitle && (
              <div className="p-3 bg-red-900/20 border-l-4 border-red-500">
                <strong className="text-red-400">✗ Keyword Not in Title</strong>
                <p className="text-gray-300 mt-1">
                  Your keyword should appear in the page title. This is critical for SEO - add it near the beginning for maximum impact.
                </p>
              </div>
            )}

            {/* Check H1 placement */}
            {!results.url1Summary.inH1 && (
              <div className="p-3 bg-red-900/20 border-l-4 border-red-500">
                <strong className="text-red-400">✗ Keyword Not in H1</strong>
                <p className="text-gray-300 mt-1">
                  Include your target keyword in the H1 heading. This helps search engines understand your page topic.
                </p>
              </div>
            )}

            {/* Check image alt text */}
            {results.url1Summary.imageAltCount === 0 && (
              <div className="p-3 bg-blue-900/20 border-l-4 border-blue-500">
                <strong className="text-blue-400">ℹ Image Alt Text</strong>
                <p className="text-gray-300 mt-1">
                  Consider adding your keyword to relevant image alt text. This improves image search visibility.
                </p>
              </div>
            )}

            {/* All good? */}
            {results.url1Summary.inURL &&
             results.url1Summary.inTitle &&
             results.url1Summary.inH1 &&
             parseFloat(results.url1Summary.density) >= 0.5 &&
             parseFloat(results.url1Summary.density) <= 3 && (
              <div className="p-3 bg-green-900/20 border-l-4 border-green-500">
                <strong className="text-green-400">✓ Strong Keyword Optimization!</strong>
                <p className="text-gray-300 mt-1">
                  Your keyword placement is solid. Consider testing against competitors to identify additional opportunities.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Share Results */}
        <ShareResults toolName="Keyword Analyser" scannedUrl={url1} />
      </>
    )}
  </div>
)}
      </div>
    </>
  );
}
