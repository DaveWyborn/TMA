import Link from 'next/link';
import NavBar from '../../components/NavBar';
import FooterSection from '../../components/FooterSection';

export const metadata = {
  title: 'SEO Tools | Tailor Made Analytics',
  description:
    'Free, no-login SEO tools — meta tags, keyword usage, page speed and robots/sitemap checks. Built by an analytics studio for marketers and agencies.',
};

const tools = [
  {
    num: '01',
    title: 'Meta Checker',
    blurb:
      'Pulls your title, description, Open Graph and Twitter Cards, schema and technical tags. Set a competitor URL alongside yours and see the gap.',
    href: '/meta-checker',
    features: [
      'Title, description, canonical, robots',
      'Open Graph + Twitter Card audit',
      'Schema detection',
      'Side-by-side competitor compare',
    ],
  },
  {
    num: '02',
    title: 'Keyword Analyser',
    blurb:
      'Counts a keyword across the page and tells you whether it lands where it matters — URL, title, H1, alt text. Density figure with sensible thresholds.',
    href: '/keyword-analyser',
    features: [
      'Density + total occurrences',
      'Placement check (URL, title, H1)',
      'Image alt text count',
      'Compare two URLs',
    ],
  },
  {
    num: '03',
    title: 'Page Speed',
    blurb:
      'Runs Google PageSpeed Insights for both mobile and desktop. Returns the score, the three Core Web Vitals, and the top opportunities to fix.',
    href: '/page-speed',
    features: [
      'Mobile + desktop scores',
      'LCP, FID, CLS measured',
      'Top opportunities listed',
      'Powered by Google PageSpeed API',
    ],
  },
  {
    num: '04',
    title: 'Robots & Sitemap',
    blurb:
      'Reads your robots.txt, validates the syntax and follows every sitemap reference to confirm it actually exists and returns a 200.',
    href: '/robots-checker',
    features: [
      'Robots.txt fetched and shown',
      'All sitemap URLs extracted',
      'Each sitemap status-checked',
      'Crawl-permission warnings',
    ],
  },
];

export default function SEOToolsPage() {
  return (
    <>
      <NavBar />

      <main
        className="px-6 md:px-12 pt-16 md:pt-24 pb-24"
        style={{ background: 'var(--paper)' }}
      >
        <div className="max-w-5xl">
          <p className="brand-tag" style={{ marginBottom: '1.5rem' }}>
            Tools <span className="dot">·</span> Free for everyone
          </p>
          <h1
            className="display"
            style={{
              fontSize: 'clamp(2.5rem, 6vw, 4.5rem)',
              marginBottom: '1.5rem',
            }}
          >
            Practical SEO tools that show you{' '}
            <span style={{ color: 'var(--signal)' }}>what&rsquo;s actually wrong</span>.
          </h1>
          <p
            style={{
              fontSize: '19px',
              maxWidth: '60ch',
              color: 'var(--ink-soft)',
              lineHeight: 1.55,
              marginBottom: '4rem',
            }}
          >
            No login. No trial. Run your URL through one of these and get a real
            answer in seconds — the same checks we run on every audit.
          </p>

          <div
            className="hairline"
            style={{ borderTop: '1px solid var(--hairline)' }}
          >
            {tools.map((t) => (
              <Link
                key={t.href}
                href={t.href}
                className="hairline group block py-10 md:py-12"
                style={{ borderBottom: '1px solid var(--hairline)' }}
              >
                <div className="grid grid-cols-1 md:grid-cols-12 gap-6 md:gap-10 items-start">
                  <div className="md:col-span-1">
                    <span
                      className="num-tag"
                      style={{ fontSize: '32px', display: 'block' }}
                    >
                      {t.num}
                    </span>
                  </div>

                  <div className="md:col-span-7">
                    <h2
                      className="display"
                      style={{
                        fontSize: 'clamp(1.75rem, 3.5vw, 2.5rem)',
                        marginBottom: '0.75rem',
                      }}
                    >
                      {t.title}
                    </h2>
                    <p
                      style={{
                        fontSize: '17px',
                        color: 'var(--ink-soft)',
                        lineHeight: 1.55,
                        marginBottom: '1.25rem',
                        maxWidth: '52ch',
                      }}
                    >
                      {t.blurb}
                    </p>
                    <span className="signal-link" style={{ fontSize: '15px' }}>
                      Run the check →
                    </span>
                  </div>

                  <div className="md:col-span-4">
                    <ul className="flex flex-col gap-2">
                      {t.features.map((f) => (
                        <li
                          key={f}
                          className="label-mono"
                          style={{
                            fontSize: '12px',
                            letterSpacing: '0.04em',
                            textTransform: 'none',
                            color: 'var(--ink-soft)',
                          }}
                        >
                          — {f}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          <div
            style={{
              marginTop: '6rem',
              padding: '3rem',
              background: 'var(--ink)',
              color: 'var(--paper)',
              borderRadius: 'var(--radius)',
            }}
          >
            <p
              className="brand-tag"
              style={{ color: 'var(--paper-on-ink)', marginBottom: '0.75rem' }}
            >
              Beyond the tools
            </p>
            <h2
              className="display"
              style={{
                fontSize: 'clamp(1.75rem, 3.5vw, 2.25rem)',
                marginBottom: '1rem',
                maxWidth: '32ch',
              }}
            >
              Need a dashboard that watches all of this for you?
            </h2>
            <p
              style={{
                color: 'var(--paper-on-ink)',
                fontSize: '16px',
                lineHeight: 1.55,
                maxWidth: '52ch',
                marginBottom: '1.75rem',
              }}
            >
              These tools answer point-in-time questions. The dashboards we
              build keep watching after you&rsquo;ve closed the tab — meta
              regressions, Core Web Vitals drift, broken sitemaps, all of it.
            </p>
            <Link href="/#contact" className="btn-ink on-ink">
              Talk to us →
            </Link>
          </div>
        </div>
      </main>

      <FooterSection />
    </>
  );
}
