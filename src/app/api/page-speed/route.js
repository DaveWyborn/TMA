import { NextResponse } from 'next/server';

export async function POST(req) {
  const { url } = await req.json();

  // Google PageSpeed Insights API - no key needed for basic usage (rate limited)
  // For production, get free API key from: https://developers.google.com/speed/docs/insights/v5/get-started
  const apiKey = process.env.GOOGLE_PAGESPEED_API_KEY || '';

  async function fetchPageSpeed(strategy) {
    try {
      const apiUrl = `https://www.googleapis.com/pagespeedonline/v5/runPagespeed?url=${encodeURIComponent(url)}&strategy=${strategy}${apiKey ? `&key=${apiKey}` : ''}`;

      const res = await fetch(apiUrl, {
        signal: AbortSignal.timeout(60000) // 60 second timeout
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        console.error(`PageSpeed API error for ${strategy}:`, res.status, errorData);
        return {
          error: true,
          status: res.status,
          message: errorData.error?.message || `HTTP ${res.status}`
        };
      }

      const data = await res.json();

      // Extract performance score
      const score = Math.round(data.lighthouseResult.categories.performance.score * 100);

      // Extract Core Web Vitals from field data or lab data
      const metrics = data.lighthouseResult.audits;

      const lcp = metrics['largest-contentful-paint']?.numericValue / 1000 || 0; // Convert to seconds
      const fid = metrics['max-potential-fid']?.numericValue || 0; // Using max-potential-fid as proxy
      const cls = metrics['cumulative-layout-shift']?.numericValue || 0;

      // Extract top opportunities
      const opportunities = [];
      const opportunityAudits = [
        'render-blocking-resources',
        'unused-css-rules',
        'unused-javascript',
        'modern-image-formats',
        'offscreen-images',
        'unminified-css',
        'unminified-javascript'
      ];

      for (const auditId of opportunityAudits) {
        const audit = metrics[auditId];
        if (audit && audit.details && audit.details.overallSavingsMs > 100) {
          opportunities.push({
            title: audit.title,
            description: audit.description
          });
        }
      }

      // Sort by savings and take top ones
      opportunities.sort((a, b) => b.savings - a.savings);

      return {
        score,
        lcp,
        fid,
        cls,
        opportunities
      };
    } catch (err) {
      console.error(`Error fetching PageSpeed for ${strategy}:`, err.message);
      return {
        error: true,
        message: err.name === 'TimeoutError' ? 'Request timed out after 60 seconds' : err.message
      };
    }
  }

  // Fetch both mobile and desktop in parallel
  const [mobile, desktop] = await Promise.all([
    fetchPageSpeed('mobile'),
    fetchPageSpeed('desktop')
  ]);

  // Check for errors
  if (mobile?.error || desktop?.error) {
    const errorMsg = mobile?.message || desktop?.message || 'Unknown error';
    const status = mobile?.status || desktop?.status;

    return NextResponse.json({
      error: true,
      message: errorMsg,
      status,
      details: 'Google PageSpeed Insights could not analyze this page. This might be due to: site blocking Google\'s crawlers, the page being too slow to load, or rate limiting. Try again in a few minutes.'
    });
  }

  if (!mobile && !desktop) {
    return NextResponse.json({
      error: true,
      message: 'Failed to fetch PageSpeed data',
      details: 'No data returned from Google PageSpeed Insights. The URL might be inaccessible or rate limits may have been reached.'
    });
  }

  return NextResponse.json({
    mobile,
    desktop
  });
}
