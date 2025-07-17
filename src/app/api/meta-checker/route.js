import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';

export async function POST(req) {
  const { myURL, compURL } = await req.json();

  async function fetchMeta(url) {
    try {
      const response = await fetch(url);
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
        title: $('title').text() || 'None',
        description: $('meta[name="description"]').attr('content') || 'None',
        keywords: $('meta[name="keywords"]').attr('content') || 'None',
        schemaSummary: schemaSummary.length > 0 ? schemaSummary : [{ type: 'None' }],
      };
    } catch (err) {
      console.error('❌ Error fetching or parsing URL:', url, err.message);
      return {
        title: 'Error',
        description: 'Error',
        keywords: 'Error',
        schemaSummary: [{ type: 'Error' }],
      };
    }
  }

  const my = await fetchMeta(myURL);
  const comp = compURL ? await fetchMeta(compURL) : null;

  return NextResponse.json({ my, comp });
}
