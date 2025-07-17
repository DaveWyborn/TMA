import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';

export async function POST(req) {
  const { myURL, compURL } = await req.json();

  async function fetchMeta(url) {
    try {
      const response = await fetch(url);
      const html = await response.text();
      const $ = cheerio.load(html);

      const schemaTypes = [];

      $('script[type="application/ld+json"]').each((i, el) => {
        const raw = $(el).text(); // .text() is more reliable than .html()
        console.log(`📦 Raw Schema Block [${i}]:\n`, raw);

        try {
          if (raw && raw.trim().startsWith('{')) {
            const json = JSON.parse(raw.trim());
            if (Array.isArray(json)) {
              json.forEach(item => item['@type'] && schemaTypes.push(item['@type']));
            } else if (json['@type']) {
              schemaTypes.push(json['@type']);
            }
          }
        } catch (err) {
          console.warn(`⚠️ JSON-LD Parse Error [${url} block ${i}]:`, err.message);
        }
      });

      return {
        title: $('title').text() || 'None',
        description: $('meta[name="description"]').attr('content') || 'None',
        keywords: $('meta[name="keywords"]').attr('content') || 'None',
        schema: schemaTypes.length > 0 ? [...new Set(schemaTypes)] : ['None'],
      };
    } catch (err) {
      console.error('❌ Error fetching or parsing URL:', url, err.message);
      return {
        title: 'Error',
        description: 'Error',
        keywords: 'Error',
        schema: ['Error'],
      };
    }
  }

  const my = await fetchMeta(myURL);
  const comp = compURL ? await fetchMeta(compURL) : null;

  return NextResponse.json({ my, comp });
}
