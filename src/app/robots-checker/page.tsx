'use client';

import { useState } from 'react';
import ToolPageShell from '../../components/ToolPageShell';
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

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>,
    useStealthMode = false
  ) {
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
        error: 'Failed to fetch results',
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
    <ToolPageShell
      eyebrow="SEO Tools / Robots & Sitemap"
      title="Robots & Sitemap Checker"
      lede="Reads your robots.txt, displays it in full, then walks every sitemap reference and confirms each one returns a 200."
    >
      <section className="tool-intro">
        <div>
          <h3>What it does</h3>
          <p>
            Fetches the robots.txt at the domain root, extracts every sitemap
            URL it references, then status-checks each sitemap to confirm it
            actually exists.
          </p>
        </div>
        <div>
          <h3>Why it matters</h3>
          <p>
            Robots.txt is search engines&rsquo; first stop on your site. A
            broken or missing sitemap reference can mean entire sections of
            your site go undiscovered for months.
          </p>
        </div>
      </section>

      <form onSubmit={handleSubmit} className="tool-form">
        <div>
          <label className="field-label">Domain</label>
          <input
            type="text"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            required
            placeholder="https://example.com"
            className="field"
          />
          <p
            className="label-mono"
            style={{
              marginTop: '0.4rem',
              textTransform: 'none',
              letterSpacing: '0.02em',
              fontSize: '12px',
            }}
          >
            Include the protocol (https://).
          </p>
        </div>

        <div className="actions">
          <button type="submit" disabled={loading} className="btn-ink">
            {loading ? 'Checking…' : 'Check robots.txt →'}
          </button>
        </div>
      </form>

      {botBlocked && (
        <div className="bot-blocked">
          <p className="brand-tag" style={{ color: 'var(--signal)' }}>
            Bot protection detected
          </p>
          <h3>The site is blocking automated requests.</h3>
          <p style={{ fontSize: '14px', color: 'var(--ink-soft)' }}>
            We can retry with a bot-friendly approach, but only if you have
            permission to scan this site.
          </p>
          <label>
            <input
              type="checkbox"
              checked={hasPermission}
              onChange={(e) => setHasPermission(e.target.checked)}
            />
            <span>I confirm I have permission from the site owner to scan this site.</span>
          </label>
          <div style={{ display: 'flex', gap: '0.75rem' }}>
            <button
              onClick={handleStealthRetry}
              disabled={!hasPermission || loading}
              className="btn-ink"
              type="button"
            >
              {loading ? 'Scanning…' : 'Retry with stealth mode →'}
            </button>
            <button
              onClick={() => setBotBlocked(false)}
              className="btn-ghost"
              type="button"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {results?.error && (
        <div className="recommendation bad" style={{ marginBottom: '2rem' }}>
          <p className="head">Couldn&rsquo;t fetch</p>
          <p>{results.error}</p>
        </div>
      )}

      {results && !results.error && (
        <div>
          <h2 className="tool-section-head">Robots.txt</h2>
          <div className="tool-tile" style={{ marginBottom: '2rem' }}>
            <div
              className="flex items-center gap-3"
              style={{ marginBottom: '1rem' }}
            >
              <span
                className={`status-pip ${results.robotsExists ? 'good' : 'bad'}`}
              >
                {results.robotsExists ? 'Found' : 'Missing'}
              </span>
              <span style={{ fontSize: '15px', color: 'var(--ink)' }}>
                {results.robotsExists
                  ? 'robots.txt found at the domain root'
                  : 'robots.txt not found'}
              </span>
            </div>

            {results.robotsExists && results.robotsContent && (
              <>
                <p className="brand-tag" style={{ marginBottom: '0.5rem' }}>
                  File contents
                </p>
                <pre className="tool-pre">{results.robotsContent}</pre>
              </>
            )}

            {!results.robotsExists && (
              <p style={{ fontSize: '14px', color: 'var(--ink-soft)', lineHeight: 1.55 }}>
                A robots.txt file helps search engines understand which pages
                to crawl. Add one at <span className="tool-code">{domain}/robots.txt</span>.
              </p>
            )}
          </div>

          <h2 className="tool-section-head">Sitemaps</h2>
          {results.sitemaps.length > 0 ? (
            <div className="flex flex-col gap-2" style={{ marginBottom: '2rem' }}>
              {results.sitemaps.map((sitemap, i) => (
                <div
                  key={i}
                  className="tool-tile"
                  style={{ padding: '1rem 1.25rem' }}
                >
                  <div
                    className="flex items-start gap-3"
                    style={{ flexWrap: 'wrap' }}
                  >
                    <span
                      className={`status-pip ${sitemap.exists ? 'good' : 'bad'}`}
                    >
                      {sitemap.exists ? `${sitemap.status} OK` : `${sitemap.status} Fail`}
                    </span>
                    <span
                      className="url-cell"
                      style={{ flex: 1, fontSize: '13px' }}
                    >
                      {sitemap.url}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="tool-tile" style={{ marginBottom: '2rem' }}>
              <p style={{ fontSize: '14px', color: 'var(--ink-soft)', lineHeight: 1.55 }}>
                No sitemaps referenced in robots.txt. Add a line like:{' '}
                <span className="tool-code">
                  Sitemap: https://yoursite.com/sitemap.xml
                </span>
              </p>
            </div>
          )}

          <div
            style={{
              padding: '1.25rem 1.5rem',
              background: 'var(--surface)',
              border: '1px solid var(--hairline)',
              borderRadius: 'var(--radius)',
              marginBottom: '2rem',
            }}
          >
            <p className="brand-tag" style={{ marginBottom: '0.75rem' }}>
              About robots.txt
            </p>
            <ul
              style={{
                fontSize: '13px',
                color: 'var(--ink-soft)',
                lineHeight: 1.55,
                display: 'flex',
                flexDirection: 'column',
                gap: '0.4rem',
              }}
            >
              <li>Lives at the root of your domain (example.com/robots.txt).</li>
              <li>Tells search engines which pages they can / cannot crawl.</li>
              <li>Should reference your XML sitemap(s).</li>
              <li>Not a security measure — don&rsquo;t use it to hide sensitive content.</li>
            </ul>
          </div>

          <div className="recommendations">
            <p className="brand-tag" style={{ marginBottom: '1.25rem' }}>
              Recommended next steps
            </p>

            {!results.robotsExists && (
              <div className="recommendation bad">
                <p className="head">Missing robots.txt</p>
                <p>
                  Create a robots.txt at the domain root. At minimum it should
                  reference your sitemap.
                </p>
              </div>
            )}

            {results.robotsExists && results.sitemaps.length === 0 && (
              <div className="recommendation warn">
                <p className="head">No sitemaps referenced</p>
                <p>
                  Add{' '}
                  <span className="tool-code">
                    Sitemap: https://yoursite.com/sitemap.xml
                  </span>{' '}
                  to robots.txt so search engines find every URL.
                </p>
              </div>
            )}

            {results.sitemaps.some((s) => !s.exists) && (
              <div className="recommendation bad">
                <p className="head">
                  Inaccessible sitemap
                  {results.sitemaps.filter((s) => !s.exists).length > 1 ? 's' : ''}
                </p>
                <p>
                  {results.sitemaps.filter((s) => !s.exists).length} sitemap
                  {results.sitemaps.filter((s) => !s.exists).length > 1 ? 's are' : ' is'}{' '}
                  returning errors. Verify the URL
                  {results.sitemaps.filter((s) => !s.exists).length > 1 ? 's' : ''} and
                  that the sitemap files exist.
                </p>
              </div>
            )}

            {results.robotsExists &&
              results.sitemaps.length > 0 &&
              results.sitemaps.every((s) => s.exists) && (
                <div className="recommendation good">
                  <p className="head">Configured correctly</p>
                  <p>
                    Robots.txt exists and every sitemap is accessible. Submit
                    your sitemap to Google Search Console to nudge indexing.
                  </p>
                </div>
              )}
          </div>

          <ShareResults toolName="Robots & Sitemap Checker" scannedUrl={domain} />
        </div>
      )}
    </ToolPageShell>
  );
}
