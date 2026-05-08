'use client';

import { useState } from 'react';
import ToolPageShell from '../../components/ToolPageShell';
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

function StatTile({ label, summary }: { label: string; summary: SummaryData }) {
  const density = parseFloat(summary.density);
  const densityState =
    density < 0.5 ? 'warn' : density > 3 ? 'warn' : 'good';

  return (
    <div className="tool-tile">
      <h4>{label}</h4>
      <div className="stat-row">
        <span className="key">Keyword density</span>
        <span className="val">
          {summary.density}
          <span className={`status-pip ${densityState}`} style={{ marginLeft: '0.75rem' }}>
            {density < 0.5 ? 'Low' : density > 3 ? 'High' : 'OK'}
          </span>
        </span>
      </div>
      <div className="stat-row">
        <span className="key">Total occurrences</span>
        <span className="val">{summary.totalOccurrences}</span>
      </div>
      <div className="stat-row">
        <span className="key">Total words</span>
        <span className="val">{summary.wordCount}</span>
      </div>
      <div className="stat-row">
        <span className="key">In URL</span>
        <span className="val">
          <span className={`status-pip ${summary.inURL ? 'good' : 'bad'}`}>
            {summary.inURL ? 'Yes' : 'No'}
          </span>
        </span>
      </div>
      <div className="stat-row">
        <span className="key">In title</span>
        <span className="val">
          <span className={`status-pip ${summary.inTitle ? 'good' : 'bad'}`}>
            {summary.inTitle ? 'Yes' : 'No'}
          </span>
        </span>
      </div>
      <div className="stat-row">
        <span className="key">In H1</span>
        <span className="val">
          <span className={`status-pip ${summary.inH1 ? 'good' : 'bad'}`}>
            {summary.inH1 ? 'Yes' : 'No'}
          </span>
        </span>
      </div>
      <div className="stat-row">
        <span className="key">In image alts</span>
        <span className="val">{summary.imageAltCount}</span>
      </div>
    </div>
  );
}

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
    <ToolPageShell
      eyebrow="SEO Tools / Keyword Analyser"
      title="Keyword Analyser"
      lede="Counts a keyword across the page and tells you whether it lands where it actually matters — URL, title, H1, alt text. Compare two URLs side-by-side."
    >
      <section className="tool-intro">
        <div>
          <h3>What it does</h3>
          <p>
            Pick a keyword and a URL (and optionally a second URL). Returns
            density, total count, and whether the keyword appears in the
            ranking signals search engines weigh most heavily.
          </p>
        </div>
        <div>
          <h3>Why it matters</h3>
          <p>
            Strategic placement signals topic to search engines. Too little is
            a missed opportunity; too much reads as keyword stuffing. This
            tool gives you the placement audit a senior SEO would run first.
          </p>
        </div>
      </section>

      <form onSubmit={handleSubmit} className="tool-form">
        <div>
          <label className="field-label">Keyword</label>
          <input
            type="text"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            placeholder="e.g. ‘consent management’"
            required
            className="field"
          />
        </div>

        <div>
          <label className="field-label">URL 1</label>
          <input
            type="url"
            value={url1}
            onChange={(e) => setUrl1(e.target.value)}
            placeholder="https://yoursite.com/page"
            required
            className="field"
          />
        </div>

        <div>
          <label className="field-label">URL 2 (optional)</label>
          <input
            type="url"
            value={url2}
            onChange={(e) => setUrl2(e.target.value)}
            placeholder="https://competitor.com/page"
            className="field"
          />
        </div>

        <div className="actions">
          <button type="submit" disabled={loading} className="btn-ink">
            {loading ? 'Checking…' : 'Run check →'}
          </button>
        </div>
      </form>

      {results && results.tags && (
        <div>
          <h2 className="tool-section-head">
            Keyword summary
            <HelpTooltip text="Density is occurrences ÷ total words. Aim for 1–2% on primary keywords. Placement in URL, title and H1 are the strongest on-page ranking signals." />
          </h2>
          <div
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
            style={{ marginBottom: '1rem' }}
          >
            <StatTile label="URL 1" summary={results.url1Summary} />
            {url2 && results.url2Summary && (
              <StatTile label="URL 2" summary={results.url2Summary} />
            )}
          </div>

          <h2 className="tool-section-head">Detailed breakdown</h2>
          <table className="tool-table">
            <thead>
              <tr>
                <th style={{ width: '20%' }}>Tag</th>
                <th>Occurrences (URL 1)</th>
                {url2 && <th>Occurrences (URL 2)</th>}
              </tr>
            </thead>
            <tbody>
              {results.tags.map((tag) => (
                <tr key={tag.tag}>
                  <td className="label">{tag.tag}</td>
                  <td>
                    <span className="val">{tag.url1.count}</span>
                    {tag.url1.snippets.length > 0 && (
                      <ul
                        style={{
                          marginTop: '0.5rem',
                          paddingLeft: '1rem',
                          fontSize: '12px',
                          color: 'var(--ink-soft)',
                          listStyle: 'disc',
                        }}
                      >
                        {tag.url1.snippets.map((s, i) => (
                          <li key={i}>“{s}…”</li>
                        ))}
                      </ul>
                    )}
                  </td>
                  {url2 && tag.url2 && (
                    <td>
                      <span className="val">{tag.url2.count}</span>
                      {tag.url2.snippets.length > 0 && (
                        <ul
                          style={{
                            marginTop: '0.5rem',
                            paddingLeft: '1rem',
                            fontSize: '12px',
                            color: 'var(--ink-soft)',
                            listStyle: 'disc',
                          }}
                        >
                          {tag.url2.snippets.map((s, i) => (
                            <li key={i}>“{s}…”</li>
                          ))}
                        </ul>
                      )}
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>

          {!url2 && (
            <>
              <div className="recommendations">
                <p className="brand-tag" style={{ marginBottom: '1.25rem' }}>
                  Recommended next steps
                </p>

                {parseFloat(results.url1Summary.density) < 0.5 && (
                  <div className="recommendation warn">
                    <p className="head">Low keyword density</p>
                    <p>
                      Density is {results.url1Summary.density}. Increase usage
                      naturally throughout the content — aim for 1–2% on
                      primary keywords.
                    </p>
                  </div>
                )}

                {parseFloat(results.url1Summary.density) > 3 && (
                  <div className="recommendation warn">
                    <p className="head">High keyword density</p>
                    <p>
                      Density is {results.url1Summary.density}. This may read
                      as stuffing — pull it back to 1–2%.
                    </p>
                  </div>
                )}

                {!results.url1Summary.inURL && (
                  <div className="recommendation warn">
                    <p className="head">Keyword not in URL</p>
                    <p>
                      Include the keyword in the URL. URLs remain a strong
                      ranking signal, particularly for landing pages.
                    </p>
                  </div>
                )}

                {!results.url1Summary.inTitle && (
                  <div className="recommendation bad">
                    <p className="head">Keyword not in title</p>
                    <p>
                      Add the keyword to the page title near the beginning.
                      This is the single most impactful on-page change.
                    </p>
                  </div>
                )}

                {!results.url1Summary.inH1 && (
                  <div className="recommendation bad">
                    <p className="head">Keyword not in H1</p>
                    <p>
                      Add the keyword to the H1 heading. This helps search
                      engines confirm the page&rsquo;s primary topic.
                    </p>
                  </div>
                )}

                {results.url1Summary.imageAltCount === 0 && (
                  <div className="recommendation info">
                    <p className="head">No keyword in image alts</p>
                    <p>
                      Where it&rsquo;s genuinely descriptive, include the
                      keyword in image alt text — improves image-search
                      visibility.
                    </p>
                  </div>
                )}

                {results.url1Summary.inURL &&
                  results.url1Summary.inTitle &&
                  results.url1Summary.inH1 &&
                  parseFloat(results.url1Summary.density) >= 0.5 &&
                  parseFloat(results.url1Summary.density) <= 3 && (
                    <div className="recommendation good">
                      <p className="head">Strong placement</p>
                      <p>
                        Your keyword sits in every signal we check, with a
                        healthy density. Compare against a competitor URL to
                        find further opportunities.
                      </p>
                    </div>
                  )}
              </div>

              <ShareResults toolName="Keyword Analyser" scannedUrl={url1} />
            </>
          )}
        </div>
      )}
    </ToolPageShell>
  );
}
