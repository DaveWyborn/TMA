import { NextResponse } from 'next/server';
import * as cheerio from 'cheerio';

export async function POST(req) {
  const { myURL, compURL } = await req.json();

  async function fetchMeta(url) {
    try {
      const response = await fetch(url);
      const html = await response.text();
      const $ = cheerio.load(html);

      return {
        title: $('title').text() || 'None',
        description: $('meta[name=\"description\"]').attr('content') || 'None',
        keywords: $('meta[name=\"keywords\"]').attr('content') || 'None',
      };
    } catch (error) {
      return { title: 'Error', description: 'Error', keywords: 'Error' };
    }
  }

  const my = await fetchMeta(myURL);
  const comp = await fetchMeta(compURL);

  return NextResponse.json({ my, comp });
}
