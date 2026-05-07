'use client';

// Robots.txt & Sitemap Checker

import { useState } from 'react';
import Navbar from '../../components/NavBar';
import Image from 'next/image';
import ShareResults from '../../components/ShareResults';

type SitemapStatus = {
  url: string;
  exists: boolean;
  status: number;
};

type RobotsResult = {
  robotsExists: boolean;
  robotsContent: string | null;
  sitemaps: SitemapStatus[];
  error?: string;
};

export default function RobotsCheckerPage() {
  const [domain, setDomain] = useState('');
  const [results, setResults] = useState<RobotsResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [botBlocked, setBotBlocked] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>, useStealthMode = false) {
    e.preventDefault();
    setLoading(true);
    setBotBlocked(false);
    setResults(null);

    try {
      const res = await fetch('/api/robots-checker', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ domain, stealthMode: useStealthMode }),
      });

      const data = await res.json();

      if (data.botBlocked) {
        setBotBlocked(true);
        setHasPermission(false);
      } else {
        setResults(data);
      }
    } catch (err) {
      console.error('Fetch error:', err);
      setResults({
        robotsExists: false,
        robotsContent: null,
        sitemaps: [],
        error: 'Failed to fetch results'
      });
    } finally {
      setLoading(false);
    }
  }

  function handleStealthRetry(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    if (hasPermission) {
      const fakeEvent = { preventDefault: () => {} } as React.FormEvent<HTMLFormElement>;
      handleSubmit(fakeEvent, true);
    }
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

        <h1 className="meta-checker-heading">Robots.txt & Sitemap Checker</h1>

        <div className="mb-6 p-4 bg-gray-800/50 border border-gray-700 rounded-lg">
          <p className="text-sm text-gray-300 leading-relaxed">
            <strong className="text-white">What this tool does:</strong> Checks if your robots.txt file exists, displays its contents, extracts sitemap URLs, and verifies that sitemaps are accessible.
          </p>
          <p className="text-xs text-gray-400 mt-2">
            <strong>Why it matters:</strong> Robots.txt guides search engine crawlers. Missing or broken sitemaps mean search engines may not discover all your pages. This affects indexing and rankings.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="dark-form mb-8">
          <div>
            <label className="block mb-1">Domain:</label>
            <input
              type="text"
              value={domain}
              onChange={(e) => setDomain(e.target.value)}
              required
              placeholder="https://example.com"
              className="w-full border p-2"
            />
            <p className="text-xs text-gray-400 mt-1">Enter full domain including https://</p>
          </div>

          <button type="submit" disabled={loading} className="dark-button">
            {loading ? 'Checking...' : 'Check Robots.txt'}
          </button>
        </form>

        {botBlocked && (
          <div className="mt-6 p-6 bg-yellow-900/20 border-2 border-yellow-600 rounded-lg">
            <h3 className="text-xl font-bold text-yellow-400 mb-3">⚠ Bot Protection Detected</h3>
            <p className="text-sm text-gray-300 mb-4">
              It looks like the page is blocking bots. We can try again using a bot-friendly approach, but we need to check you have permission to scan the site first.
            </p>
            <div className="mb-4">
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasPermission}
                  onChange={(e) => setHasPermission(e.target.checked)}
                  className="mt-1 w-4 h-4"
                />
                <span className="text-sm text-gray-300">
                  I confirm I have permission from the site owner to scan this site
                </span>
              </label>
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleStealthRetry}
                disabled={!hasPermission || loading}
                className="px-6 py-2 bg-[var(--accent-soft)] text-white rounded hover:opacity-90 transition-opacity disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Scanning...' : 'Scan with Stealth Mode'}
              </button>
              <button
                onClick={() => setBotBlocked(false)}
                className="px-6 py-2 bg-gray-700 text-white rounded hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        {results?.error && (
          <div className="bg-red-900/30 border border-red-500 p-4 rounded mb-6">
            <p className="text-red-300">{results.error}</p>
          </div>
        )}

        {results && !results.error && (
          <div className="meta-checker-results">
            {/* Robots.txt Status */}
            <div className="mb-8 p-4 border border-gray-500 rounded">
              <h2 className="text-xl font-semibold mb-4">Robots.txt Status</h2>
              <div className="flex items-center gap-2 mb-4">
                <span className={`text-2xl ${results.robotsExists ? 'text-green-400' : 'text-red-400'}`}>
                  {results.robotsExists ? '✓' : '✗'}
                </span>
                <span className="text-lg">
                  {results.robotsExists
                    ? 'robots.txt file found'
                    : 'robots.txt file not found'}
                </span>
              </div>

              {results.robotsExists && results.robotsContent && (
                <div>
                  <h3 className="font-bold mb-2">File Contents:</h3>
                  <pre className="bg-black/40 p-4 rounded text-xs overflow-x-auto max-h-96 overflow-y-auto border border-gray-600">
                    {results.robotsContent}
                  </pre>
                </div>
              )}

              {!results.robotsExists && (
                <div className="text-sm text-gray-300 mt-4 p-3 bg-yellow-900/20 border border-yellow-700 rounded">
                  <p><strong>⚠ Warning:</strong> No robots.txt file found.</p>
                  <p className="mt-2">
                    A robots.txt file helps search engines understand which pages to crawl.
                    Consider adding one at {domain}/robots.txt
                  </p>
                </div>
              )}
            </div>

            {/* Sitemaps */}
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Sitemaps</h2>
              {results.sitemaps.length > 0 ? (
                <div className="space-y-3">
                  {results.sitemaps.map((sitemap, i) => (
                    <div
                      key={i}
                      className={`p-4 border rounded ${
                        sitemap.exists
                          ? 'border-green-500 bg-green-900/10'
                          : 'border-red-500 bg-red-900/10'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        <span className={`text-xl ${sitemap.exists ? 'text-green-400' : 'text-red-400'}`}>
                          {sitemap.exists ? '✓' : '✗'}
                        </span>
                        <div className="flex-1">
                          <p className="font-mono text-sm break-all">{sitemap.url}</p>
                          <p className="text-xs text-gray-400 mt-1">
                            Status: {sitemap.status} {sitemap.exists ? '(Accessible)' : '(Not Found)'}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-gray-300 p-4 bg-gray-900/30 border border-gray-600 rounded">
                  <p>No sitemaps found in robots.txt file.</p>
                  <p className="mt-2 text-xs">
                    Add a sitemap to your robots.txt with: <code className="bg-black/40 px-1 py-0.5 rounded">Sitemap: https://yoursite.com/sitemap.xml</code>
                  </p>
                </div>
              )}
            </div>

            {/* Info Box */}
            <div className="text-xs text-gray-400 p-3 bg-gray-900/30 rounded">
              <p><strong>About robots.txt:</strong></p>
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Located at the root of your domain (e.g., example.com/robots.txt)</li>
                <li>Tells search engines which pages they can/cannot crawl</li>
                <li>Should reference your XML sitemap(s)</li>
                <li>Not a security measure - do not rely on it to hide sensitive content</li>
              </ul>
            </div>

            {/* Recommendations */}
            <div className="mt-12 p-6 bg-blue-900/20 border border-blue-600 rounded-lg">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span>💡</span> Recommended Next Steps
              </h2>
              <div className="space-y-3 text-sm">
                {/* No robots.txt */}
                {!results.robotsExists && (
                  <div className="p-3 bg-red-900/20 border-l-4 border-red-500">
                    <strong className="text-red-400">✗ Missing robots.txt</strong>
                    <p className="text-gray-300 mt-1">
                      Create a robots.txt file at your domain root. At minimum, it should reference your sitemap. This helps search engines discover your content efficiently.
                    </p>
                  </div>
                )}

                {/* No sitemaps */}
                {results.robotsExists && results.sitemaps.length === 0 && (
                  <div className="p-3 bg-yellow-900/20 border-l-4 border-yellow-500">
                    <strong className="text-yellow-400">⚠ No Sitemaps Found</strong>
                    <p className="text-gray-300 mt-1">
                      Add your XML sitemap URL to robots.txt using: <code className="bg-black/40 px-1 py-0.5 rounded">Sitemap: https://yoursite.com/sitemap.xml</code>
                    </p>
                  </div>
                )}

                {/* Broken sitemaps */}
                {results.sitemaps.some(s => !s.exists) && (
                  <div className="p-3 bg-red-900/20 border-l-4 border-red-500">
                    <strong className="text-red-400">✗ Inaccessible Sitemap{results.sitemaps.filter(s => !s.exists).length > 1 ? 's' : ''}</strong>
                    <p className="text-gray-300 mt-1">
                      {results.sitemaps.filter(s => !s.exists).length} sitemap{results.sitemaps.filter(s => !s.exists).length > 1 ? 's are' : ' is'} returning 404 errors. Verify the URL{results.sitemaps.filter(s => !s.exists).length > 1 ? 's are' : ' is'} correct and the sitemap{results.sitemaps.filter(s => !s.exists).length > 1 ? 's exist' : ' exists'}.
                    </p>
                  </div>
                )}

                {/* All good? */}
                {results.robotsExists && results.sitemaps.length > 0 && results.sitemaps.every(s => s.exists) && (
                  <div className="p-3 bg-green-900/20 border-l-4 border-green-500">
                    <strong className="text-green-400">✓ robots.txt Configured Correctly!</strong>
                    <p className="text-gray-300 mt-1">
                      Your robots.txt file exists and all sitemaps are accessible. Ensure it is submitted to Google Search Console for optimal indexing.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Share Results */}
            <ShareResults toolName="Robots.txt Checker" scannedUrl={domain} />
          </div>
        )}
      </div>
    </>
  );
}
