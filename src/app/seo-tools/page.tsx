'use client';

// SEO Tools Landing Page

import Link from 'next/link';
import Navbar from '../../components/NavBar';
import Image from 'next/image';

const tools = [
  {
    title: 'Meta Checker',
    description: 'Analyze meta tags, Open Graph, Twitter Cards, and technical SEO elements. Compare against competitors.',
    href: '/meta-checker',
    icon: '🔍',
    features: ['Basic meta tags', 'Social sharing tags', 'Schema detection', 'Technical SEO audit']
  },
  {
    title: 'Keyword Analyser',
    description: 'Check keyword density, placement in title/H1/URL, and compare usage across pages.',
    href: '/keyword-analyser',
    icon: '🔑',
    features: ['Keyword density', 'Strategic placement', 'Competitor comparison', 'Content breakdown']
  },
  {
    title: 'Page Speed Checker',
    description: 'Analyze Core Web Vitals and performance metrics for both mobile and desktop.',
    href: '/page-speed',
    icon: '⚡',
    features: ['Performance scores', 'Core Web Vitals', 'Mobile & desktop', 'Optimization tips']
  },
  {
    title: 'Robots.txt Checker',
    description: 'Validate your robots.txt file and verify sitemap accessibility.',
    href: '/robots-checker',
    icon: '🤖',
    features: ['Robots.txt validation', 'Sitemap detection', 'Accessibility checks', 'Best practices']
  }
];

export default function SEOToolsPage() {
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

        <h1 className="meta-checker-heading">SEO Tools Suite</h1>
        <p className="text-center text-gray-300 mb-8 max-w-2xl mx-auto">
          Professional SEO analysis tools built for agencies and consultants. All tools are free to use for Tailor Made Analytics clients.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {tools.map((tool) => (
            <Link
              key={tool.href}
              href={tool.href}
              className="p-6 border border-gray-500 rounded-lg hover:border-[var(--accent-soft)] transition-all hover:shadow-lg hover:shadow-[var(--accent-soft)]/20 bg-gray-900/30"
            >
              <div className="flex items-start gap-4">
                <div className="text-4xl">{tool.icon}</div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold mb-2 text-[var(--accent-soft)]">{tool.title}</h2>
                  <p className="text-sm text-gray-300 mb-4">{tool.description}</p>
                  <ul className="space-y-1">
                    {tool.features.map((feature, i) => (
                      <li key={i} className="text-xs text-gray-400 flex items-center gap-2">
                        <span className="text-green-400">✓</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="border-t border-gray-700 pt-8">
          <h2 className="text-2xl font-bold mb-4">About These Tools</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm text-gray-300">
            <div>
              <h3 className="font-bold text-white mb-2">🎯 Built for Professionals</h3>
              <p>
                Each tool is designed to provide actionable insights quickly. Perfect for client audits,
                competitor analysis, and ongoing SEO monitoring.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-white mb-2">🔄 Regular Updates</h3>
              <p>
                We continuously improve these tools based on the latest SEO best practices and client feedback.
                All tools are in active development.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-white mb-2">📊 Data Privacy</h3>
              <p>
                All analysis is performed in real-time. We do not store your URLs or results.
                Usage is logged for development purposes only.
              </p>
            </div>
            <div>
              <h3 className="font-bold text-white mb-2">💡 More Coming Soon</h3>
              <p>
                Broken link checker, internal link analyzer, and more tools are in development.
                Have a suggestion? Let us know!
              </p>
            </div>
          </div>
        </div>

        <div className="mt-12 p-6 bg-[var(--deep-purple)] rounded-lg text-center">
          <h3 className="text-xl font-bold mb-2">Need a Custom Dashboard?</h3>
          <p className="text-sm text-gray-300 mb-4">
            Get a tailored analytics dashboard combining GA4, Search Console, and SEO metrics.
          </p>
          <Link
            href="/#testimonials"
            className="inline-block px-6 py-3 bg-[var(--accent-soft)] text-white rounded-lg hover:shadow-lg transition-all"
          >
            Learn More About Our Services
          </Link>
        </div>

        <div className="mt-8 text-center text-xs text-gray-500">
          <p>Built by Tailor Made Analytics | All tools are provided as-is in beta</p>
        </div>
      </div>
    </>
  );
}
