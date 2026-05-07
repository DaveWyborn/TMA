'use client';

// Meta Checker

import { useState } from 'react';
import Navbar from '../../components/NavBar';
import Image from 'next/image';
import ShareResults from '../../components/ShareResults';
import HelpTooltip from '../../components/HelpTooltip';

export default function MetaCheckerPage() {
  const [myURL, setMyURL] = useState('');
  const [compURL, setCompURL] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showLog, setShowLog] = useState(false);
  const [botBlocked, setBotBlocked] = useState(false);
  const [hasPermission, setHasPermission] = useState(false);

  async function handleSubmit(e, useStealthMode = false) {
    e.preventDefault();
    console.log('🔍 Form submitted', useStealthMode ? '(Stealth Mode)' : '');
    setLoading(true);
    setBotBlocked(false);
    setResults(null);

    try {
      const res = await fetch('/api/meta-checker', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ myURL, compURL, stealthMode: useStealthMode }),
      });

      const data = await res.json();
      console.log('✅ Final Results:', data);

      if (data.botBlocked) {
        setBotBlocked(true);
        setHasPermission(false);
      } else {
        setResults(data);
      }
    } catch (err) {
      console.error('❌ Fetch or parsing error:', err.message);
    } finally {
      setLoading(false);
    }
  }

  function handleStealthRetry(e) {
    e.preventDefault();
    if (hasPermission) {
      handleSubmit(e, true);
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

        <div className="mb-6 p-4 bg-gray-800/50 border border-gray-700 rounded-lg">
          <p className="text-sm text-gray-300 leading-relaxed">
            <strong className="text-white">What this tool does:</strong> Analyzes your page's meta tags, social sharing tags (Open Graph & Twitter Cards), technical SEO elements, and schema markup. Compare against competitors to identify gaps.
          </p>
          <p className="text-xs text-gray-400 mt-2">
            <strong>Why it matters:</strong> Meta tags control how your page appears in search results and social media. Missing or poorly optimized tags mean lost clicks and engagement.
          </p>
        </div>

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

            <h2 className="text-xl font-semibold mb-4 mt-8">Page Overview</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div className="p-4 border border-gray-500 rounded">
                <h3 className="font-bold mb-2">Your Page</h3>
                <ul className="space-y-1 text-sm">
                  <li>H1 Tags: <strong>{results.my.h1Count}</strong> {results.my.h1Count === 1 ? '✓' : results.my.h1Count === 0 ? '⚠️ Missing' : '⚠️ Multiple'}</li>
                  <li>H1 Text: {results.my.h1Text}</li>
                  <li>Total Images: <strong>{results.my.imageCount}</strong></li>
                  <li>Images without Alt: <strong>{results.my.imagesWithoutAlt}</strong> {results.my.imagesWithoutAlt > 0 ? '⚠️' : '✓'}</li>
                </ul>
              </div>
              {compURL && results.comp && (
                <div className="p-4 border border-gray-500 rounded">
                  <h3 className="font-bold mb-2">Competitor Page</h3>
                  <ul className="space-y-1 text-sm">
                    <li>H1 Tags: <strong>{results.comp.h1Count}</strong> {results.comp.h1Count === 1 ? '✓' : results.comp.h1Count === 0 ? '⚠️ Missing' : '⚠️ Multiple'}</li>
                    <li>H1 Text: {results.comp.h1Text}</li>
                    <li>Total Images: <strong>{results.comp.imageCount}</strong></li>
                    <li>Images without Alt: <strong>{results.comp.imagesWithoutAlt}</strong> {results.comp.imagesWithoutAlt > 0 ? '⚠️' : '✓'}</li>
                  </ul>
                </div>
              )}
            </div>

            <h2 className="text-xl font-semibold mb-2 mt-8 flex items-center">
              Open Graph Tags (Social Sharing)
              <HelpTooltip text="Open Graph tags control how your page appears when shared on Facebook, LinkedIn, and other social platforms. Without them, platforms use generic text and images." />
            </h2>
            <table className="w-full border border-gray-300 mb-6">
              <thead>
                <tr style={{ background: 'var(--deep-purple)', color: 'var(--light-text)' }}>
                  <th className="border p-2 text-left">Property</th>
                  <th className="border p-2 text-left">Your Page</th>
                  {compURL && results.comp && <th className="border p-2 text-left">Competitor Page</th>}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-2">og:title</td>
                  <td className="border p-2">{results.my.ogTitle}</td>
                  {compURL && results.comp && <td className="border p-2">{results.comp.ogTitle}</td>}
                </tr>
                <tr>
                  <td className="border p-2">og:description</td>
                  <td className="border p-2">{results.my.ogDescription}</td>
                  {compURL && results.comp && <td className="border p-2">{results.comp.ogDescription}</td>}
                </tr>
                <tr>
                  <td className="border p-2">og:image</td>
                  <td className="border p-2 break-all text-xs">{results.my.ogImage}</td>
                  {compURL && results.comp && <td className="border p-2 break-all text-xs">{results.comp.ogImage}</td>}
                </tr>
                <tr>
                  <td className="border p-2">og:type</td>
                  <td className="border p-2">{results.my.ogType}</td>
                  {compURL && results.comp && <td className="border p-2">{results.comp.ogType}</td>}
                </tr>
                <tr>
                  <td className="border p-2">og:url</td>
                  <td className="border p-2 break-all text-xs">{results.my.ogUrl}</td>
                  {compURL && results.comp && <td className="border p-2 break-all text-xs">{results.comp.ogUrl}</td>}
                </tr>
              </tbody>
            </table>

            <h2 className="text-xl font-semibold mb-2 mt-8 flex items-center">
              Twitter Cards
              <HelpTooltip text="Twitter Card tags determine how your content displays on Twitter/X. Large cards with images get significantly more engagement than plain text links." />
            </h2>
            <table className="w-full border border-gray-300 mb-6">
              <thead>
                <tr style={{ background: 'var(--deep-purple)', color: 'var(--light-text)' }}>
                  <th className="border p-2 text-left">Property</th>
                  <th className="border p-2 text-left">Your Page</th>
                  {compURL && results.comp && <th className="border p-2 text-left">Competitor Page</th>}
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border p-2">twitter:card</td>
                  <td className="border p-2">{results.my.twitterCard}</td>
                  {compURL && results.comp && <td className="border p-2">{results.comp.twitterCard}</td>}
                </tr>
                <tr>
                  <td className="border p-2">twitter:title</td>
                  <td className="border p-2">{results.my.twitterTitle}</td>
                  {compURL && results.comp && <td className="border p-2">{results.comp.twitterTitle}</td>}
                </tr>
                <tr>
                  <td className="border p-2">twitter:description</td>
                  <td className="border p-2">{results.my.twitterDescription}</td>
                  {compURL && results.comp && <td className="border p-2">{results.comp.twitterDescription}</td>}
                </tr>
                <tr>
                  <td className="border p-2">twitter:image</td>
                  <td className="border p-2 break-all text-xs">{results.my.twitterImage}</td>
                  {compURL && results.comp && <td className="border p-2 break-all text-xs">{results.comp.twitterImage}</td>}
                </tr>
              </tbody>
            </table>

            <h2 className="text-xl font-semibold mb-2 mt-8 flex items-center">
              Technical SEO
              <HelpTooltip text="Canonical URLs prevent duplicate content issues. Robots meta tags control indexing. Viewport settings ensure mobile responsiveness." />
            </h2>
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
                  <td className="border p-2">Canonical URL</td>
                  <td className="border p-2 break-all text-xs">{results.my.canonical}</td>
                  {compURL && results.comp && <td className="border p-2 break-all text-xs">{results.comp.canonical}</td>}
                </tr>
                <tr>
                  <td className="border p-2">Robots Meta</td>
                  <td className="border p-2">{results.my.robots}</td>
                  {compURL && results.comp && <td className="border p-2">{results.comp.robots}</td>}
                </tr>
                <tr>
                  <td className="border p-2">Viewport</td>
                  <td className="border p-2 text-xs">{results.my.viewport}</td>
                  {compURL && results.comp && <td className="border p-2 text-xs">{results.comp.viewport}</td>}
                </tr>
              </tbody>
            </table>

            <h2 className="text-xl font-semibold mb-2 mt-8 flex items-center">
              Schema Summary
              <HelpTooltip text="Schema markup is structured data that helps search engines understand your content type (article, product, organization, etc.). Can result in rich snippets in search results." />
            </h2>
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


          </div>
        )}

        {results && !compURL && (
          <>
            {/* Recommendations */}
            <div className="mt-12 p-6 bg-blue-900/20 border border-blue-600 rounded-lg">
              <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                <span>💡</span> Recommended Next Steps
              </h2>
              <div className="space-y-3 text-sm">
                {/* Check for missing/poor meta description */}
                {(!results.my.description || results.my.description === 'None' || results.my.description.length < 50) && (
                  <div className="p-3 bg-yellow-900/20 border-l-4 border-yellow-500">
                    <strong className="text-yellow-400">⚠ Meta Description</strong>
                    <p className="text-gray-300 mt-1">
                      {results.my.description === 'None'
                        ? 'Add a meta description (150-160 characters) to improve click-through rates from search results.'
                        : 'Your meta description is too short. Aim for 150-160 characters for optimal display in search results.'}
                    </p>
                  </div>
                )}

                {/* Check H1 count */}
                {results.my.h1Count === 0 && (
                  <div className="p-3 bg-red-900/20 border-l-4 border-red-500">
                    <strong className="text-red-400">✗ Missing H1 Tag</strong>
                    <p className="text-gray-300 mt-1">
                      Add one H1 tag to your page. This is critical for SEO and should contain your primary keyword.
                    </p>
                  </div>
                )}
                {results.my.h1Count > 1 && (
                  <div className="p-3 bg-yellow-900/20 border-l-4 border-yellow-500">
                    <strong className="text-yellow-400">⚠ Multiple H1 Tags</strong>
                    <p className="text-gray-300 mt-1">
                      You have {results.my.h1Count} H1 tags. Best practice is one per page. Consider restructuring as H2-H6.
                    </p>
                  </div>
                )}

                {/* Check Open Graph */}
                {(results.my.ogTitle === 'None' || results.my.ogImage === 'None') && (
                  <div className="p-3 bg-yellow-900/20 border-l-4 border-yellow-500">
                    <strong className="text-yellow-400">⚠ Social Sharing Tags</strong>
                    <p className="text-gray-300 mt-1">
                      Add Open Graph tags (og:title, og:description, og:image) to control how your page appears when shared on social media.
                    </p>
                  </div>
                )}

                {/* Check images without alt */}
                {results.my.imagesWithoutAlt > 0 && (
                  <div className="p-3 bg-yellow-900/20 border-l-4 border-yellow-500">
                    <strong className="text-yellow-400">⚠ Missing Alt Text</strong>
                    <p className="text-gray-300 mt-1">
                      {results.my.imagesWithoutAlt} image{results.my.imagesWithoutAlt > 1 ? 's are' : ' is'} missing alt text. Add descriptive alt text for accessibility and SEO.
                    </p>
                  </div>
                )}

                {/* Check canonical */}
                {results.my.canonical === 'None' && (
                  <div className="p-3 bg-blue-900/20 border-l-4 border-blue-500">
                    <strong className="text-blue-400">ℹ Canonical URL</strong>
                    <p className="text-gray-300 mt-1">
                      Consider adding a canonical URL to prevent duplicate content issues if this page is accessible via multiple URLs.
                    </p>
                  </div>
                )}

                {/* All good? */}
                {results.my.description && results.my.description !== 'None' && results.my.description.length >= 50 &&
                 results.my.h1Count === 1 &&
                 results.my.imagesWithoutAlt === 0 &&
                 results.my.ogTitle !== 'None' && results.my.ogImage !== 'None' && (
                  <div className="p-3 bg-green-900/20 border-l-4 border-green-500">
                    <strong className="text-green-400">✓ Looking Good!</strong>
                    <p className="text-gray-300 mt-1">
                      Your page has solid meta tag fundamentals. Consider testing with competitors to identify improvement opportunities.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Share Results */}
            <ShareResults toolName="Meta Checker" scannedUrl={myURL} />
          </>
        )}

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
                  <p><strong>Current Features:</strong></p>
                  <ul className="list-disc pl-6 mb-3">
                    <li>Basic meta tags (title, description)</li>
                    <li>Open Graph tags for social sharing (Facebook, LinkedIn)</li>
                    <li>Twitter Card tags</li>
                    <li>Technical SEO (canonical, robots, viewport)</li>
                    <li>Page overview (H1 count, images, alt text audit)</li>
                    <li>Schema detection (WebSite, Organization, Article, FAQPage)</li>
                    <li>Side-by-side competitor comparison</li>
                  </ul>
                  <p><strong>Coming Soon:</strong></p>
                  <ul className="list-disc pl-6">
                    <li>Schema validation</li>
                    <li>PDF export</li>
                    <li>Audit history</li>
                  </ul>
                  <p className="mt-4 italic text-xs">Built by Tailor Made Analytics — designed to help you see what your competitors aren't showing Google.</p>
                </div>
              )}
            </div>


      </div>


    </>
  );
}
