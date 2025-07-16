import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';

export async function POST(req) {
  const { keyword, url1, url2 } = await req.json();

  const ELEMENT_LIMIT = 3000;
  const TAGS = ['h1', 'h2', 'h3', 'h4', 'p', 'li'];

  async function fetchWithTimeout(url, timeout = 8000) {
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);

    try {
      const res = await fetch(url, { signal: controller.signal });
      clearTimeout(id);
      return res;
    } catch (err) {
      clearTimeout(id);
      console.error(`Fetch error for ${url}:`, err.message || err);
      return null;
    }
  }

  async function checkKeyword(url) {
    try {
      const res = await fetchWithTimeout(url);
      if (!res || !res.ok) {
        console.error(`Non-200 response from ${url}`);
        return null;
      }

      const html = await res.text();
      const $ = cheerio.load(html);
      const keywordLower = keyword.toLowerCase();

      let processedCount = 0;
      let hitLimit = false;
      const tagResults = {};

      for (const tag of TAGS) {
        let count = 0;
        let snippets = [];

        const elements = $(tag);
        for (let i = 0; i < elements.length; i++) {
          if (processedCount >= ELEMENT_LIMIT) {
            hitLimit = true;
            break;
          }

          const el = elements[i];
          const text = $(el).text().toLowerCase();

          if (text.includes(keywordLower)) {
            const matches = text.match(new RegExp(keywordLower, 'g')) || [];
            count += matches.length;

            if (snippets.length < 3) {
              snippets.push($(el).text().trim().slice(0, 120));
            }
          }

          processedCount++;
        }

        tagResults[tag.toUpperCase()] = { count, snippets };
        if (hitLimit) break;
      }

      return { results: tagResults, hitLimit };
    } catch (err) {
      console.error(`Error processing ${url}:`, err.message || err);
      return null;
    }
  }

  const [url1Data, url2Data] = await Promise.all([
    checkKeyword(url1),
    url2 ? checkKeyword(url2) : Promise.resolve(null),
  ]);

  if (!url1Data) {
    return NextResponse.json({ error: 'Failed to analyze URL 1' }, { status: 500 });
  }

  const combined = Object.keys(url1Data.results).map((tag) => ({
    tag,
    url1: {
      count: url1Data.results[tag].count,
      snippets: url1Data.results[tag].snippets,
    },
    url2: url2Data
      ? {
          count: url2Data.results[tag].count,
          snippets: url2Data.results[tag].snippets,
        }
      : null,
  }));

  const limitHit = url1Data.hitLimit || (url2Data?.hitLimit ?? false);

  return NextResponse.json({
    tags: combined,
    ...(limitHit && { note: 'Limited to first 3,000 elements per page.' }),
  });
}
