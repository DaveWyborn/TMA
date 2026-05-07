'use client';

// Page Speed Checker

import { useState } from 'react';
import Navbar from '../../components/NavBar';
import Image from 'next/image';
import ShareResults from '../../components/ShareResults';

type PageSpeedResult = {
  mobile: {
    score: number;
    lcp: number;
    fid: number;
    cls: number;
    opportunities: Array<{ title: string; description: string }>;
  } | null;
  desktop: {
    score: number;
    lcp: number;
    fid: number;
    cls: number;
    opportunities: Array<{ title: string; description: string }>;
  } | null;
  error?: boolean;
  message?: string;
  details?: string;
  status?: number;
};

export default function PageSpeedPage() {
  const [url, setUrl] = useState('');
  const [results, setResults] = useState<PageSpeedResult | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setResults(null);

    try {
      const res = await fetch('/api/page-speed', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      });

      const data = await res.json();
      setResults(data);
    } catch (err) {
      console.error('Fetch error:', err);
      setResults({ mobile: null, desktop: null, error: true, message: 'Failed to fetch results' });
    } finally {
      setLoading(false);
    }
  }

  function getScoreColor(score: number) {
    if (score >= 90) return 'text-green-400';
    if (score >= 50) return 'text-yellow-400';
    return 'text-red-400';
  }

  function getMetricStatus(value: number, goodThreshold: number, needsWorkThreshold: number) {
    if (value <= goodThreshold) return { status: '✓ Good', color: 'text-green-400' };
    if (value <= needsWorkThreshold) return { status: '⚠ Needs Improvement', color: 'text-yellow-400' };
    return { status: '✗ Poor', color: 'text-red-400' };
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

        <h1 className="meta-checker-heading">Page Speed Checker</h1>

        <div className="mb-6 p-4 bg-gray-800/50 border border-gray-700 rounded-lg">
          <p className="text-sm text-gray-300 leading-relaxed">
            <strong className="text-white">What this tool does:</strong> Uses Google PageSpeed Insights API to measure your page load performance and Core Web Vitals (LCP, FID, CLS) on both mobile and desktop.
          </p>
          <p className="text-xs text-gray-400 mt-2">
            <strong>Why it matters:</strong> Page speed is a direct ranking factor. Slow pages have higher bounce rates and lower conversions. Core Web Vitals affect search rankings since 2021.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="dark-form mb-8">
          <div>
            <label className="block mb-1">Website URL:</label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              required
              placeholder="https://example.com"
              className="w-full border p-2"
            />
          </div>

          <button type="submit" disabled={loading} className="dark-button">
            {loading ? 'Analyzing... (this may take 30-60 seconds)' : 'Run Analysis'}
          </button>
        </form>

        {results?.error && (
          <div className="bg-red-900/30 border border-red-500 p-6 rounded mb-6">
            <h3 className="text-xl font-bold text-red-400 mb-3">⚠ Analysis Failed</h3>
            <p className="text-red-300 font-semibold mb-2">{results.message}</p>
            {results.details && (
              <p className="text-sm text-gray-300 mt-3 leading-relaxed">{results.details}</p>
            )}
            {results.status && (
              <p className="text-xs text-gray-400 mt-3">Error code: {results.status}</p>
            )}
            <div className="mt-4 p-3 bg-yellow-900/20 border-l-4 border-yellow-600">
              <p className="text-sm text-gray-300">
                <strong>💡 Tip:</strong> If the site is blocking Google&apos;s crawlers, you can use our <a href="/meta-checker" className="text-[var(--accent-soft)] underline">Meta Checker</a> or <a href="/keyword-analyser" className="text-[var(--accent-soft)] underline">Keyword Analyser</a> instead (they support stealth mode).
              </p>
            </div>
          </div>
        )}

        {results && !results.error && (results.mobile || results.desktop) && (
          <div className="meta-checker-results">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {/* Mobile Results */}
              {results.mobile && (
                <div className="p-4 border border-gray-500 rounded">
                  <h2 className="text-xl font-semibold mb-4">📱 Mobile</h2>
                  <div className={`text-5xl font-bold mb-4 ${getScoreColor(results.mobile.score)}`}>
                    {results.mobile.score}
                  </div>
                  <p className="text-sm text-gray-400 mb-4">Performance Score (0-100)</p>

                  <h3 className="font-bold mb-2 text-sm">Core Web Vitals</h3>
                  <div className="space-y-2 text-sm">
                    <div>
                      <div className="flex justify-between">
                        <span>Largest Contentful Paint (LCP):</span>
                        <strong>{results.mobile.lcp.toFixed(1)}s</strong>
                      </div>
                      <p className={`text-xs ${getMetricStatus(results.mobile.lcp, 2.5, 4).color}`}>
                        {getMetricStatus(results.mobile.lcp, 2.5, 4).status}
                      </p>
                    </div>
                    <div>
                      <div className="flex justify-between">
                        <span>First Input Delay (FID):</span>
                        <strong>{results.mobile.fid}ms</strong>
                      </div>
                      <p className={`text-xs ${getMetricStatus(results.mobile.fid, 100, 300).color}`}>
                        {getMetricStatus(results.mobile.fid, 100, 300).status}
                      </p>
                    </div>
                    <div>
                      <div className="flex justify-between">
                        <span>Cumulative Layout Shift (CLS):</span>
                        <strong>{results.mobile.cls.toFixed(3)}</strong>
                      </div>
                      <p className={`text-xs ${getMetricStatus(results.mobile.cls, 0.1, 0.25).color}`}>
                        {getMetricStatus(results.mobile.cls, 0.1, 0.25).status}
                      </p>
                    </div>
                  </div>

                  {results.mobile.opportunities.length > 0 && (
                    <>
                      <h3 className="font-bold mb-2 text-sm mt-4">Top Opportunities</h3>
                      <ul className="space-y-2 text-xs">
                        {results.mobile.opportunities.slice(0, 3).map((opp, i) => (
                          <li key={i} className="border-l-2 border-yellow-500 pl-2">
                            <strong>{opp.title}</strong>
                            <p className="text-gray-400 text-xs">{opp.description}</p>
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>
              )}

              {/* Desktop Results */}
              {results.desktop && (
                <div className="p-4 border border-gray-500 rounded">
                  <h2 className="text-xl font-semibold mb-4">🖥 Desktop</h2>
                  <div className={`text-5xl font-bold mb-4 ${getScoreColor(results.desktop.score)}`}>
                    {results.desktop.score}
                  </div>
                  <p className="text-sm text-gray-400 mb-4">Performance Score (0-100)</p>

                  <h3 className="font-bold mb-2 text-sm">Core Web Vitals</h3>
                  <div className="space-y-2 text-sm">
                    <div>
                      <div className="flex justify-between">
                        <span>Largest Contentful Paint (LCP):</span>
                        <strong>{results.desktop.lcp.toFixed(1)}s</strong>
                      </div>
                      <p className={`text-xs ${getMetricStatus(results.desktop.lcp, 2.5, 4).color}`}>
                        {getMetricStatus(results.desktop.lcp, 2.5, 4).status}
                      </p>
                    </div>
                    <div>
                      <div className="flex justify-between">
                        <span>First Input Delay (FID):</span>
                        <strong>{results.desktop.fid}ms</strong>
                      </div>
                      <p className={`text-xs ${getMetricStatus(results.desktop.fid, 100, 300).color}`}>
                        {getMetricStatus(results.desktop.fid, 100, 300).status}
                      </p>
                    </div>
                    <div>
                      <div className="flex justify-between">
                        <span>Cumulative Layout Shift (CLS):</span>
                        <strong>{results.desktop.cls.toFixed(3)}</strong>
                      </div>
                      <p className={`text-xs ${getMetricStatus(results.desktop.cls, 0.1, 0.25).color}`}>
                        {getMetricStatus(results.desktop.cls, 0.1, 0.25).status}
                      </p>
                    </div>
                  </div>

                  {results.desktop.opportunities.length > 0 && (
                    <>
                      <h3 className="font-bold mb-2 text-sm mt-4">Top Opportunities</h3>
                      <ul className="space-y-2 text-xs">
                        {results.desktop.opportunities.slice(0, 3).map((opp, i) => (
                          <li key={i} className="border-l-2 border-yellow-500 pl-2">
                            <strong>{opp.title}</strong>
                            <p className="text-gray-400 text-xs">{opp.description}</p>
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </div>
              )}
            </div>

            <div className="text-xs text-gray-400 mt-4 p-3 bg-gray-900/30 rounded">
              <p><strong>About Core Web Vitals:</strong></p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li><strong>LCP (Largest Contentful Paint)</strong>: How quickly main content loads. Good: ≤2.5s</li>
                <li><strong>FID (First Input Delay)</strong>: Page responsiveness to user interaction. Good: ≤100ms</li>
                <li><strong>CLS (Cumulative Layout Shift)</strong>: Visual stability. Good: ≤0.1</li>
              </ul>
            </div>

            {/* Recommendations */}
            <div className="mt-12 p-6 bg-blue-900/20 border border-blue-600 rounded-lg">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span>💡</span> Recommended Next Steps
              </h2>
              <div className="space-y-3 text-sm">
                {/* Check mobile score */}
                {results.mobile && results.mobile.score < 50 && (
                  <div className="p-3 bg-red-900/20 border-l-4 border-red-500">
                    <strong className="text-red-400">✗ Poor Mobile Performance</strong>
                    <p className="text-gray-300 mt-1">
                      Your mobile score is {results.mobile.score}/100. Focus on the opportunities listed above, particularly image optimization and JavaScript reduction.
                    </p>
                  </div>
                )}
                {results.mobile && results.mobile.score >= 50 && results.mobile.score < 90 && (
                  <div className="p-3 bg-yellow-900/20 border-l-4 border-yellow-500">
                    <strong className="text-yellow-400">⚠ Mobile Performance Needs Work</strong>
                    <p className="text-gray-300 mt-1">
                      Your mobile score is {results.mobile.score}/100. Review the opportunities above to improve load times.
                    </p>
                  </div>
                )}

                {/* Check LCP */}
                {results.mobile && results.mobile.lcp > 4 && (
                  <div className="p-3 bg-red-900/20 border-l-4 border-red-500">
                    <strong className="text-red-400">✗ Slow Content Load</strong>
                    <p className="text-gray-300 mt-1">
                      LCP is {results.mobile.lcp.toFixed(1)}s (should be under 2.5s). Optimize images, use a CDN, and improve server response times.
                    </p>
                  </div>
                )}

                {/* Check CLS */}
                {results.mobile && results.mobile.cls > 0.25 && (
                  <div className="p-3 bg-yellow-900/20 border-l-4 border-yellow-500">
                    <strong className="text-yellow-400">⚠ Layout Shifting Issues</strong>
                    <p className="text-gray-300 mt-1">
                      CLS is {results.mobile.cls.toFixed(3)} (should be under 0.1). Set explicit dimensions for images and reserve space for ads/embeds.
                    </p>
                  </div>
                )}

                {/* Desktop vs Mobile gap */}
                {results.mobile && results.desktop && (results.desktop.score - results.mobile.score) > 20 && (
                  <div className="p-3 bg-blue-900/20 border-l-4 border-blue-500">
                    <strong className="text-blue-400">ℹ Mobile-Desktop Gap</strong>
                    <p className="text-gray-300 mt-1">
                      Your desktop score ({results.desktop.score}) is significantly better than mobile ({results.mobile.score}). Prioritize mobile optimizations - Google uses mobile-first indexing.
                    </p>
                  </div>
                )}

                {/* All good? */}
                {results.mobile && results.mobile.score >= 90 && results.desktop && results.desktop.score >= 90 && (
                  <div className="p-3 bg-green-900/20 border-l-4 border-green-500">
                    <strong className="text-green-400">✓ Excellent Performance!</strong>
                    <p className="text-gray-300 mt-1">
                      Both mobile and desktop scores are strong. Monitor regularly to maintain performance as content grows.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Share Results */}
            <ShareResults toolName="Page Speed Checker" scannedUrl={url} />
          </div>
        )}
      </div>
    </>
  );
}
