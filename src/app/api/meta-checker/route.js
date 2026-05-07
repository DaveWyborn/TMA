import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';

export async function POST(req) {
  const { myURL, compURL, stealthMode = false } = await req.json();

  async function fetchMeta(url) {
    try {
      // Use stealth mode headers if requested
      const headers = stealthMode
        ? {
            'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36',
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5',
            'Accept-Encoding': 'gzip, deflate, br',
            'DNT': '1',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1',
            'Sec-Fetch-Dest': 'document',
            'Sec-Fetch-Mode': 'navigate',
            'Sec-Fetch-Site': 'none',
            'Cache-Control': 'max-age=0'
          }
        : { 'User-Agent': 'TMA-SEO-Tools/1.0' };

      const response = await fetch(url, { headers });

      // Detect bot blocking
      if (response.status === 403 || response.status === 503) {
        const text = await response.text();
        if (text.includes('cloudflare') || text.includes('Access denied') || text.includes('bot')) {
          return { botBlocked: true };
        }
      }

      if (!response.ok) {
        console.error('Non-200 response:', response.status);
        return { error: `HTTP ${response.status}` };
      }

      const html = await response.text();
      const $ = cheerio.load(html);

      const schemaSummary = [];

      $('script[type="application/ld+json"]').each((i, el) => {
        const raw = $(el).text();
        try {
          if (raw && raw.trim().startsWith('{')) {
            const json = JSON.parse(raw.trim());
            const items = Array.isArray(json) ? json : [json];

            items.forEach(item => {
              const type = item['@type'] || 'Unknown';
              const summary = { type };

              // Add common fields per type
              if (type === 'WebSite' || type === 'Organization') {
                if (item.name) summary.name = item.name;
                if (item.url) summary.url = item.url;
              }
              if (type === 'Article') {
                if (item.headline) summary.headline = item.headline;
                if (item.author) summary.author = typeof item.author === 'string' ? item.author : item.author?.name;
                if (item.datePublished) summary.datePublished = item.datePublished;
              }
              if (type === 'FAQPage' && Array.isArray(item.mainEntity)) {
                summary.faqCount = item.mainEntity.length;
              }

              schemaSummary.push(summary);
            });
          }
        } catch (err) {
          console.warn(`⚠️ JSON-LD Parse Error [${url} block ${i}]:`, err.message);
        }
      });

      return {
        // Basic meta
        title: $('title').text() || 'None',
        description: $('meta[name="description"]').attr('content') || 'None',
        keywords: $('meta[name="keywords"]').attr('content') || 'None',

        // Open Graph
        ogTitle: $('meta[property="og:title"]').attr('content') || 'None',
        ogDescription: $('meta[property="og:description"]').attr('content') || 'None',
        ogImage: $('meta[property="og:image"]').attr('content') || 'None',
        ogType: $('meta[property="og:type"]').attr('content') || 'None',
        ogUrl: $('meta[property="og:url"]').attr('content') || 'None',

        // Twitter Cards
        twitterCard: $('meta[name="twitter:card"]').attr('content') || 'None',
        twitterTitle: $('meta[name="twitter:title"]').attr('content') || 'None',
        twitterDescription: $('meta[name="twitter:description"]').attr('content') || 'None',
        twitterImage: $('meta[name="twitter:image"]').attr('content') || 'None',

        // Technical SEO
        canonical: $('link[rel="canonical"]').attr('href') || 'None',
        robots: $('meta[name="robots"]').attr('content') || 'None',
        viewport: $('meta[name="viewport"]').attr('content') || 'None',

        // Counts
        h1Count: $('h1').length,
        h1Text: $('h1').first().text().trim() || 'None',
        imageCount: $('img').length,
        imagesWithoutAlt: $('img:not([alt])').length + $('img[alt=""]').length,

        schemaSummary: schemaSummary.length > 0 ? schemaSummary : [{ type: 'None' }],
      };
    } catch (err) {
      console.error('❌ Error fetching or parsing URL:', url, err.message);
      return { error: err.message };
    }
  }

  const my = await fetchMeta(myURL);
  const comp = compURL ? await fetchMeta(compURL) : null;

  // Check if bot blocked
  if (my?.botBlocked || comp?.botBlocked) {
    return NextResponse.json({
      botBlocked: true,
      message: 'Site appears to be blocking automated requests'
    });
  }

  // Check for errors
  if (my?.error) {
    return NextResponse.json({ error: my.error }, { status: 400 });
  }

  return NextResponse.json({ my, comp });
}
