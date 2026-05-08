'use client';

import { useState } from 'react';
import ToolPageShell from '../../components/ToolPageShell';
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

      if (data.botBlocked) {
        setBotBlocked(true);
        setHasPermission(false);
      } else {
        setResults(data);
      }
    } catch (err) {
      console.error('Fetch or parsing error:', err.message);
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
    <ToolPageShell
      eyebrow="SEO Tools / Meta Checker"
      title="Meta Checker"
      lede="Title, description, Open Graph, Twitter Cards, schema and the technical tags Google reads first. Run yours, optionally next to a competitor, and see the gap."
    >
      <section className="tool-intro">
        <div>
          <h3>What it does</h3>
          <p>
            Pulls every meta tag we audit — basic, social, technical and
            schema — from your URL and a competitor&rsquo;s. Returns a
            side-by-side comparison and flags missing fundamentals.
          </p>
        </div>
        <div>
          <h3>Why it matters</h3>
          <p>
            Meta tags are the cheapest fix in SEO. Missing or weak tags lose
            click-through in search results and silently mangle every social
            share. This is the first thing we check on every audit.
          </p>
        </div>
      </section>

      <form onSubmit={handleSubmit} className="tool-form">
        <div>
          <label className="field-label">Your URL</label>
          <input
            type="url"
            value={myURL}
            onChange={(e) => setMyURL(e.target.value)}
            placeholder="https://yoursite.com/page"
            required
            className="field"
          />
        </div>

        <div>
          <label className="field-label">Competitor URL (optional)</label>
          <input
            type="url"
            value={compURL}
            onChange={(e) => setCompURL(e.target.value)}
            placeholder="https://competitor.com/page"
            className="field"
          />
        </div>

        <div className="actions">
          <button type="submit" className="btn-ink" disabled={loading}>
            {loading ? 'Checking…' : 'Run check →'}
          </button>
          <button type="button" className="btn-ghost" onClick={handleReset}>
            Reset
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

      {results && (
        <div className="meta-checker-results">
          <h2 className="tool-section-head">Meta tags</h2>
          <table className="tool-table">
            <thead>
              <tr>
                <th style={{ width: '24%' }}>Element</th>
                <th>Your page</th>
                {compURL && results.comp && <th>Competitor</th>}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="label">Title</td>
                <td>{results.my.title}</td>
                {compURL && results.comp && <td>{results.comp.title}</td>}
              </tr>
              <tr>
                <td className="label">Meta description</td>
                <td>{results.my.description}</td>
                {compURL && results.comp && <td>{results.comp.description}</td>}
              </tr>
              <tr>
                <td className="label">Meta keywords</td>
                <td>{results.my.keywords}</td>
                {compURL && results.comp && <td>{results.comp.keywords}</td>}
              </tr>
            </tbody>
          </table>

          <h2 className="tool-section-head">Page overview</h2>
          <div
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
            style={{ marginBottom: '1rem' }}
          >
            <div className="tool-tile">
              <h4>Your page</h4>
              <div className="stat-row">
                <span className="key">H1 tags</span>
                <span className="val">
                  {results.my.h1Count}
                  <span
                    className={`status-pip ${
                      results.my.h1Count === 1
                        ? 'good'
                        : results.my.h1Count === 0
                          ? 'bad'
                          : 'warn'
                    }`}
                    style={{ marginLeft: '0.75rem' }}
                  >
                    {results.my.h1Count === 1
                      ? 'OK'
                      : results.my.h1Count === 0
                        ? 'Missing'
                        : 'Multiple'}
                  </span>
                </span>
              </div>
              {results.my.h1Text && (
                <div className="stat-row">
                  <span className="key">H1 text</span>
                  <span className="val" style={{ textAlign: 'right', maxWidth: '60%' }}>
                    {results.my.h1Text}
                  </span>
                </div>
              )}
              <div className="stat-row">
                <span className="key">Total images</span>
                <span className="val">{results.my.imageCount}</span>
              </div>
              <div className="stat-row">
                <span className="key">Images without alt</span>
                <span className="val">
                  {results.my.imagesWithoutAlt}
                  <span
                    className={`status-pip ${results.my.imagesWithoutAlt > 0 ? 'warn' : 'good'}`}
                    style={{ marginLeft: '0.75rem' }}
                  >
                    {results.my.imagesWithoutAlt > 0 ? 'Action' : 'OK'}
                  </span>
                </span>
              </div>
            </div>

            {compURL && results.comp && (
              <div className="tool-tile">
                <h4>Competitor</h4>
                <div className="stat-row">
                  <span className="key">H1 tags</span>
                  <span className="val">{results.comp.h1Count}</span>
                </div>
                {results.comp.h1Text && (
                  <div className="stat-row">
                    <span className="key">H1 text</span>
                    <span className="val" style={{ textAlign: 'right', maxWidth: '60%' }}>
                      {results.comp.h1Text}
                    </span>
                  </div>
                )}
                <div className="stat-row">
                  <span className="key">Total images</span>
                  <span className="val">{results.comp.imageCount}</span>
                </div>
                <div className="stat-row">
                  <span className="key">Images without alt</span>
                  <span className="val">{results.comp.imagesWithoutAlt}</span>
                </div>
              </div>
            )}
          </div>

          <h2 className="tool-section-head">
            Open Graph
            <HelpTooltip text="Open Graph tags control how your page appears when shared on Facebook, LinkedIn and most other platforms. Without them, sharers see generic text and a guessed image." />
          </h2>
          <table className="tool-table">
            <thead>
              <tr>
                <th style={{ width: '24%' }}>Property</th>
                <th>Your page</th>
                {compURL && results.comp && <th>Competitor</th>}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="label">og:title</td>
                <td>{results.my.ogTitle}</td>
                {compURL && results.comp && <td>{results.comp.ogTitle}</td>}
              </tr>
              <tr>
                <td className="label">og:description</td>
                <td>{results.my.ogDescription}</td>
                {compURL && results.comp && <td>{results.comp.ogDescription}</td>}
              </tr>
              <tr>
                <td className="label">og:image</td>
                <td className="url-cell">{results.my.ogImage}</td>
                {compURL && results.comp && <td className="url-cell">{results.comp.ogImage}</td>}
              </tr>
              <tr>
                <td className="label">og:type</td>
                <td>{results.my.ogType}</td>
                {compURL && results.comp && <td>{results.comp.ogType}</td>}
              </tr>
              <tr>
                <td className="label">og:url</td>
                <td className="url-cell">{results.my.ogUrl}</td>
                {compURL && results.comp && <td className="url-cell">{results.comp.ogUrl}</td>}
              </tr>
            </tbody>
          </table>

          <h2 className="tool-section-head">
            Twitter Cards
            <HelpTooltip text="Twitter Card tags determine how your content displays on Twitter / X. Large image cards earn significantly more engagement than plain links." />
          </h2>
          <table className="tool-table">
            <thead>
              <tr>
                <th style={{ width: '24%' }}>Property</th>
                <th>Your page</th>
                {compURL && results.comp && <th>Competitor</th>}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="label">twitter:card</td>
                <td>{results.my.twitterCard}</td>
                {compURL && results.comp && <td>{results.comp.twitterCard}</td>}
              </tr>
              <tr>
                <td className="label">twitter:title</td>
                <td>{results.my.twitterTitle}</td>
                {compURL && results.comp && <td>{results.comp.twitterTitle}</td>}
              </tr>
              <tr>
                <td className="label">twitter:description</td>
                <td>{results.my.twitterDescription}</td>
                {compURL && results.comp && <td>{results.comp.twitterDescription}</td>}
              </tr>
              <tr>
                <td className="label">twitter:image</td>
                <td className="url-cell">{results.my.twitterImage}</td>
                {compURL && results.comp && <td className="url-cell">{results.comp.twitterImage}</td>}
              </tr>
            </tbody>
          </table>

          <h2 className="tool-section-head">
            Technical SEO
            <HelpTooltip text="Canonical URLs prevent duplicate-content issues. Robots meta controls indexing. Viewport ensures mobile responsiveness." />
          </h2>
          <table className="tool-table">
            <thead>
              <tr>
                <th style={{ width: '24%' }}>Element</th>
                <th>Your page</th>
                {compURL && results.comp && <th>Competitor</th>}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="label">Canonical</td>
                <td className="url-cell">{results.my.canonical}</td>
                {compURL && results.comp && (
                  <td className="url-cell">{results.comp.canonical}</td>
                )}
              </tr>
              <tr>
                <td className="label">Robots meta</td>
                <td>{results.my.robots}</td>
                {compURL && results.comp && <td>{results.comp.robots}</td>}
              </tr>
              <tr>
                <td className="label">Viewport</td>
                <td className="url-cell">{results.my.viewport}</td>
                {compURL && results.comp && (
                  <td className="url-cell">{results.comp.viewport}</td>
                )}
              </tr>
            </tbody>
          </table>

          <h2 className="tool-section-head">
            Schema summary
            <HelpTooltip text="Schema markup is structured data that tells search engines what your content is — article, product, organisation, etc. Earns rich snippets in search results." />
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { label: 'Your page', data: results.my.schemaSummary },
              { label: 'Competitor', data: results.comp?.schemaSummary || [] },
            ]
              .filter((section) => section.data && section.data.length > 0)
              .map((section, idx) => (
                <div key={idx} className="tool-tile">
                  <h4>{section.label}</h4>
                  {section.data.map((block, i) => (
                    <div
                      key={i}
                      style={{
                        paddingTop: '0.75rem',
                        borderTop: i > 0 ? '1px solid var(--hairline)' : 'none',
                        marginTop: i > 0 ? '0.75rem' : 0,
                      }}
                    >
                      <p
                        className="label-mono"
                        style={{
                          color: 'var(--ink)',
                          marginBottom: '0.5rem',
                        }}
                      >
                        {block.type}
                      </p>
                      <ul style={{ fontSize: '13px', lineHeight: 1.55 }}>
                        {Object.entries(block).map(([key, val]) =>
                          key !== 'type' ? (
                            <li key={key}>
                              <span className="key" style={{ color: 'var(--muted)' }}>
                                {key}:
                              </span>{' '}
                              <span>{val}</span>
                            </li>
                          ) : null
                        )}
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
          <div className="recommendations">
            <p className="brand-tag" style={{ marginBottom: '1.25rem' }}>
              Recommended next steps
            </p>

            {(!results.my.description ||
              results.my.description === 'None' ||
              results.my.description.length < 50) && (
              <div className="recommendation warn">
                <p className="head">Meta description</p>
                <p>
                  {results.my.description === 'None'
                    ? 'Add a meta description (150–160 characters) to lift click-through rates from search results.'
                    : 'Your meta description is too short. Aim for 150–160 characters for full display in search.'}
                </p>
              </div>
            )}

            {results.my.h1Count === 0 && (
              <div className="recommendation bad">
                <p className="head">Missing H1</p>
                <p>
                  Add a single H1 to the page. This is critical for SEO — it
                  should contain your primary keyword.
                </p>
              </div>
            )}

            {results.my.h1Count > 1 && (
              <div className="recommendation warn">
                <p className="head">Multiple H1 tags</p>
                <p>
                  You have {results.my.h1Count} H1 tags. Best practice is one
                  per page — restructure additional ones as H2–H6.
                </p>
              </div>
            )}

            {(results.my.ogTitle === 'None' || results.my.ogImage === 'None') && (
              <div className="recommendation warn">
                <p className="head">Social sharing tags</p>
                <p>
                  Add Open Graph tags (og:title, og:description, og:image) to
                  control how your page appears when shared on social.
                </p>
              </div>
            )}

            {results.my.imagesWithoutAlt > 0 && (
              <div className="recommendation warn">
                <p className="head">Missing alt text</p>
                <p>
                  {results.my.imagesWithoutAlt} image
                  {results.my.imagesWithoutAlt > 1 ? 's are' : ' is'} missing
                  alt text. Add descriptive alt copy for accessibility and SEO.
                </p>
              </div>
            )}

            {results.my.canonical === 'None' && (
              <div className="recommendation info">
                <p className="head">Canonical URL</p>
                <p>
                  Consider a canonical URL to prevent duplicate-content issues
                  if this page is reachable via multiple paths.
                </p>
              </div>
            )}

            {results.my.description &&
              results.my.description !== 'None' &&
              results.my.description.length >= 50 &&
              results.my.h1Count === 1 &&
              results.my.imagesWithoutAlt === 0 &&
              results.my.ogTitle !== 'None' &&
              results.my.ogImage !== 'None' && (
                <div className="recommendation good">
                  <p className="head">Looking good</p>
                  <p>
                    Your fundamentals are solid. Run it again with a competitor
                    URL to find sharper opportunities.
                  </p>
                </div>
              )}
          </div>

          <ShareResults toolName="Meta Checker" scannedUrl={myURL} />
        </>
      )}

      <div style={{ marginTop: '4rem' }}>
        <button
          className="signal-link"
          style={{
            fontSize: '13px',
            fontFamily: 'JetBrains Mono, ui-monospace, monospace',
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            background: 'transparent',
            border: 'none',
            cursor: 'pointer',
            padding: 0,
          }}
          onClick={() => setShowLog((prev) => !prev)}
        >
          {showLog ? 'Hide' : 'Show'} changelog &amp; beta notes
        </button>
        {showLog && (
          <div
            style={{
              marginTop: '1.25rem',
              padding: '1.5rem',
              background: 'var(--surface)',
              border: '1px solid var(--hairline)',
              borderRadius: 'var(--radius)',
              fontSize: '14px',
              lineHeight: 1.55,
              color: 'var(--ink)',
            }}
          >
            <p className="brand-tag" style={{ marginBottom: '0.75rem' }}>
              Meta Checker · Beta
            </p>
            <p style={{ marginBottom: '0.5rem' }}>
              <strong>Current features:</strong>
            </p>
            <ul style={{ paddingLeft: '1.25rem', marginBottom: '1rem' }}>
              <li>Basic meta (title, description)</li>
              <li>Open Graph + Twitter Cards</li>
              <li>Technical SEO (canonical, robots, viewport)</li>
              <li>Page overview (H1 count, images, alt audit)</li>
              <li>Schema detection (WebSite, Organization, Article, FAQPage)</li>
              <li>Side-by-side competitor comparison</li>
            </ul>
            <p style={{ marginBottom: '0.5rem' }}>
              <strong>Coming soon:</strong>
            </p>
            <ul style={{ paddingLeft: '1.25rem' }}>
              <li>Schema validation</li>
              <li>PDF export</li>
              <li>Audit history</li>
            </ul>
          </div>
        )}
      </div>
    </ToolPageShell>
  );
}
