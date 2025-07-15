import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';

export async function POST(req) {
  const { keyword, url1, url2 } = await req.json();

  async function checkKeyword(url) {
    try {
      const res = await fetch(url);
      const html = await res.text();
      const $ = cheerio.load(html);
      const keywordLower = keyword.toLowerCase();

      const tags = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p', 'li', 'a', 'strong', 'em', 'span'];

      const tagResults = {};

      tags.forEach((tag) => {
        let count = 0;
        let snippets = [];

        $(tag).each((_, el) => {
          const text = $(el).text();
          const textLower = text.toLowerCase();

          if (textLower.includes(keywordLower)) {
            const matches = textLower.match(new RegExp(keywordLower, 'g')) || [];
            count += matches.length;

            if (snippets.length < 3) {
              snippets.push(text.trim().slice(0, 120)); // Shorten snippet to 120 chars
            }
          }
        });

        tagResults[tag.toUpperCase()] = { count, snippets };
      });

      return tagResults;
    } catch {
      return null;
    }
  }

  const url1Results = await checkKeyword(url1);
  const url2Results = url2 ? await checkKeyword(url2) : null;

  const combined = Object.keys(url1Results).map((tag) => ({
    tag,
    url1: {
      count: url1Results[tag].count,
      snippets: url1Results[tag].snippets,
    },
    url2: url2Results
      ? {
          count: url2Results[tag].count,
          snippets: url2Results[tag].snippets,
        }
      : null,
  }));

  return NextResponse.json({ tags: combined });
}
