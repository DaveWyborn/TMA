'use client';

import { useState } from 'react';
import ToolPageShell from '../../components/ToolPageShell';
import ShareResults from '../../components/ShareResults';

type DeviceResult = {
  score: number;
  lcp: number;
  fid: number;
  cls: number;
  opportunities: Array<{ title: string; description: string }>;
};

type PageSpeedResult = {
  mobile: DeviceResult | null;
  desktop: DeviceResult | null;
  error?: boolean;
  message?: string;
  details?: string;
  status?: number;
};

function scoreState(score: number): 'good' | 'warn' | 'bad' {
  if (score >= 90) return 'good';
  if (score >= 50) return 'warn';
  return 'bad';
}

function metricState(value: number, good: number, ok: number): 'good' | 'warn' | 'bad' {
  if (value <= good) return 'good';
  if (value <= ok) return 'warn';
  return 'bad';
}

function DeviceTile({ label, data }: { label: string; data: DeviceResult }) {
  const lcpState = metricState(data.lcp, 2.5, 4);
  const fidState = metricState(data.fid, 100, 300);
  const clsState = metricState(data.cls, 0.1, 0.25);
  const overallState = scoreState(data.score);

  return (
    <div className="tool-tile">
      <div
        className="flex items-baseline justify-between"
        style={{ marginBottom: '1rem' }}
      >
        <h4 style={{ marginBottom: 0 }}>{label}</h4>
        <span className={`status-pip ${overallState}`}>
          {overallState === 'good'
            ? 'Healthy'
            : overallState === 'warn'
              ? 'Needs work'
              : 'Poor'}
        </span>
      </div>

      <div className="flex items-baseline gap-3" style={{ marginBottom: '0.25rem' }}>
        <span className="score-numeral">{data.score}</span>
        <span className="denom" style={{ fontFamily: 'JetBrains Mono, monospace' }}>
          / 100
        </span>
      </div>
      <p
        className="label-mono"
        style={{ marginBottom: '1.5rem' }}
      >
        Performance score
      </p>

      <p
        className="brand-tag"
        style={{ marginBottom: '0.75rem' }}
      >
        Core Web Vitals
      </p>
      <div style={{ marginBottom: '1.25rem' }}>
        <div className="stat-row">
          <span className="key">LCP</span>
          <span className="val">
            {data.lcp.toFixed(1)}s
            <span className={`status-pip ${lcpState}`} style={{ marginLeft: '0.75rem' }}>
              {lcpState === 'good' ? 'Good' : lcpState === 'warn' ? 'Watch' : 'Poor'}
            </span>
          </span>
        </div>
        <div className="stat-row">
          <span className="key">FID</span>
          <span className="val">
            {data.fid}ms
            <span className={`status-pip ${fidState}`} style={{ marginLeft: '0.75rem' }}>
              {fidState === 'good' ? 'Good' : fidState === 'warn' ? 'Watch' : 'Poor'}
            </span>
          </span>
        </div>
        <div className="stat-row">
          <span className="key">CLS</span>
          <span className="val">
            {data.cls.toFixed(3)}
            <span className={`status-pip ${clsState}`} style={{ marginLeft: '0.75rem' }}>
              {clsState === 'good' ? 'Good' : clsState === 'warn' ? 'Watch' : 'Poor'}
            </span>
          </span>
        </div>
      </div>

      {data.opportunities.length > 0 && (
        <>
          <p
            className="brand-tag"
            style={{ marginBottom: '0.75rem' }}
          >
            Top opportunities
          </p>
          <ul style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {data.opportunities.slice(0, 3).map((opp, i) => (
              <li
                key={i}
                style={{
                  borderLeft: '2px solid var(--hairline)',
                  paddingLeft: '0.85rem',
                }}
              >
                <p
                  style={{ fontSize: '14px', fontWeight: 500, marginBottom: '0.2rem' }}
                >
                  {opp.title}
                </p>
                <p style={{ fontSize: '13px', color: 'var(--ink-soft)', lineHeight: 1.45 }}>
                  {opp.description}
                </p>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}

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
      setResults({
        mobile: null,
        desktop: null,
        error: true,
        message: 'Failed to fetch results',
      });
    } finally {
      setLoading(false);
    }
  }

  return (
    <ToolPageShell
      eyebrow="SEO Tools / Page Speed"
      title="Page Speed Checker"
      lede="Runs Google PageSpeed Insights on mobile and desktop. Returns the score, the three Core Web Vitals, and the top opportunities to fix."
    >
      <section className="tool-intro">
        <div>
          <h3>What it does</h3>
          <p>
            Hits Google&rsquo;s PageSpeed API for both mobile and desktop, then
            renders the headline score, LCP / FID / CLS, and the highest-impact
            opportunities Lighthouse would suggest.
          </p>
        </div>
        <div>
          <h3>Why it matters</h3>
          <p>
            Page speed is a confirmed ranking factor and a brutal conversion
            tax. Slow pages bounce. Mobile is indexed first, so a strong
            desktop score is no consolation if mobile is dragging.
          </p>
        </div>
      </section>

      <form onSubmit={handleSubmit} className="tool-form">
        <div>
          <label className="field-label">Website URL</label>
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            required
            placeholder="https://example.com"
            className="field"
          />
        </div>

        <div className="actions">
          <button type="submit" disabled={loading} className="btn-ink">
            {loading ? 'Analysing… (30–60s)' : 'Run analysis →'}
          </button>
        </div>
      </form>

      {results?.error && (
        <div className="bot-blocked">
          <p className="brand-tag" style={{ color: 'var(--signal)' }}>
            Analysis failed
          </p>
          <h3>{results.message}</h3>
          {results.details && (
            <p style={{ fontSize: '14px', color: 'var(--ink-soft)', marginBottom: '0.75rem' }}>
              {results.details}
            </p>
          )}
          {results.status && (
            <p className="label-mono" style={{ marginBottom: '1rem' }}>
              Error code: {results.status}
            </p>
          )}
          <p style={{ fontSize: '14px', color: 'var(--ink-soft)' }}>
            If the site is blocking Google&rsquo;s crawler, try the{' '}
            <a href="/meta-checker" className="signal-link">
              Meta Checker
            </a>{' '}
            or{' '}
            <a href="/keyword-analyser" className="signal-link">
              Keyword Analyser
            </a>{' '}
            — both support stealth mode.
          </p>
        </div>
      )}

      {results && !results.error && (results.mobile || results.desktop) && (
        <div>
          <h2 className="tool-section-head">Performance</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {results.mobile && <DeviceTile label="Mobile" data={results.mobile} />}
            {results.desktop && <DeviceTile label="Desktop" data={results.desktop} />}
          </div>

          <div
            style={{
              marginTop: '2rem',
              padding: '1.25rem 1.5rem',
              background: 'var(--surface)',
              border: '1px solid var(--hairline)',
              borderRadius: 'var(--radius)',
            }}
          >
            <p className="brand-tag" style={{ marginBottom: '0.75rem' }}>
              About Core Web Vitals
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
              <li>
                <strong>LCP</strong> — Largest Contentful Paint. How fast the
                main content loads. Good ≤ 2.5s.
              </li>
              <li>
                <strong>FID</strong> — First Input Delay. Responsiveness to
                user interaction. Good ≤ 100ms.
              </li>
              <li>
                <strong>CLS</strong> — Cumulative Layout Shift. Visual
                stability. Good ≤ 0.1.
              </li>
            </ul>
          </div>

          <div className="recommendations">
            <p className="brand-tag" style={{ marginBottom: '1.25rem' }}>
              Recommended next steps
            </p>

            {results.mobile && results.mobile.score < 50 && (
              <div className="recommendation bad">
                <p className="head">Poor mobile performance</p>
                <p>
                  Mobile score is {results.mobile.score}/100. Focus on the
                  opportunities listed — image optimisation and JavaScript
                  reduction are the usual culprits.
                </p>
              </div>
            )}

            {results.mobile &&
              results.mobile.score >= 50 &&
              results.mobile.score < 90 && (
                <div className="recommendation warn">
                  <p className="head">Mobile performance needs work</p>
                  <p>
                    Mobile score is {results.mobile.score}/100. Review the
                    opportunities above to lift load times.
                  </p>
                </div>
              )}

            {results.mobile && results.mobile.lcp > 4 && (
              <div className="recommendation bad">
                <p className="head">Slow content load</p>
                <p>
                  LCP is {results.mobile.lcp.toFixed(1)}s (target ≤ 2.5s).
                  Optimise images, use a CDN, and improve server response
                  times.
                </p>
              </div>
            )}

            {results.mobile && results.mobile.cls > 0.25 && (
              <div className="recommendation warn">
                <p className="head">Layout shifts</p>
                <p>
                  CLS is {results.mobile.cls.toFixed(3)} (target ≤ 0.1). Set
                  explicit dimensions on images and reserve space for ads or
                  embeds.
                </p>
              </div>
            )}

            {results.mobile &&
              results.desktop &&
              results.desktop.score - results.mobile.score > 20 && (
                <div className="recommendation info">
                  <p className="head">Mobile–desktop gap</p>
                  <p>
                    Desktop ({results.desktop.score}) is well ahead of mobile (
                    {results.mobile.score}). Google indexes mobile first —
                    prioritise mobile fixes.
                  </p>
                </div>
              )}

            {results.mobile &&
              results.mobile.score >= 90 &&
              results.desktop &&
              results.desktop.score >= 90 && (
                <div className="recommendation good">
                  <p className="head">Excellent performance</p>
                  <p>
                    Both scores are strong. Monitor regularly to keep the
                    numbers up as content grows.
                  </p>
                </div>
              )}
          </div>

          <ShareResults toolName="Page Speed Checker" scannedUrl={url} />
        </div>
      )}
    </ToolPageShell>
  );
}
