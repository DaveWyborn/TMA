import { NextResponse } from 'next/server';

export async function POST(req) {
  const { domain, stealthMode = false } = await req.json();

  try {
    // Ensure domain has protocol
    let cleanDomain = domain.trim();
    if (!cleanDomain.startsWith('http://') && !cleanDomain.startsWith('https://')) {
      cleanDomain = 'https://' + cleanDomain;
    }

    // Remove trailing slash
    cleanDomain = cleanDomain.replace(/\/$/, '');

    // Use stealth mode headers if requested
    const headers = stealthMode
      ? {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
          'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
          'Accept-Language': 'en-US,en;q=0.5'
        }
      : { 'User-Agent': 'TMA-SEO-Tools/1.0' };

    // Check robots.txt
    const robotsUrl = `${cleanDomain}/robots.txt`;
    const robotsRes = await fetch(robotsUrl, { headers });

    // Detect bot blocking
    if (robotsRes.status === 403 || robotsRes.status === 503) {
      const text = await robotsRes.text();
      if (text.includes('cloudflare') || text.includes('Access denied') || text.includes('bot')) {
        return NextResponse.json({
          botBlocked: true,
          message: 'Site appears to be blocking automated requests'
        });
      }
    }

    const robotsExists = robotsRes.ok;
    let robotsContent = null;
    const sitemaps = [];

    if (robotsExists) {
      robotsContent = await robotsRes.text();

      // Extract sitemap URLs from robots.txt
      const sitemapRegex = /^Sitemap:\s*(.+)$/gim;
      let match;
      while ((match = sitemapRegex.exec(robotsContent)) !== null) {
        sitemaps.push(match[1].trim());
      }
    }

    // Check each sitemap
    const sitemapStatus = await Promise.all(
      sitemaps.map(async (url) => {
        try {
          const res = await fetch(url, {
            method: 'HEAD',
            headers
          });
          return {
            url,
            exists: res.ok,
            status: res.status
          };
        } catch {
          return {
            url,
            exists: false,
            status: 0
          };
        }
      })
    );

    return NextResponse.json({
      robotsExists,
      robotsContent,
      sitemaps: sitemapStatus
    });
  } catch (err) {
    console.error('Error checking robots.txt:', err);
    return NextResponse.json({
      error: 'Failed to check robots.txt. Please verify the domain is accessible.'
    });
  }
}
