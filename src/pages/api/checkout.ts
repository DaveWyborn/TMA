// /pages/api/checkout.ts

import type { NextApiRequest, NextApiResponse } from 'next';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  
});

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { name, company, email, website, tier, siteType } = req.body;

  if (!name || !email || !website || !tier || !siteType) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  // Define your dynamic pricing in pennies
const pricing = {
  "Small Business": { marketing: 29, ecommerce: 39 },
  "Growing Business": { marketing: 49, ecommerce: 69 },
  "Established Business": { marketing: 69, ecommerce: 99 },
} as const;

type TierKey = keyof typeof pricing;
type SiteType = keyof (typeof pricing)[TierKey];

const { tier, siteType } = req.body as {
  tier: TierKey;
  siteType: SiteType;
};

const unitAmount = pricing[tier][siteType] ?? 0;

  if (!unitAmount) {
    return res.status(400).json({ error: 'Invalid pricing tier or site type' });
  }

  const session = await stripe.checkout.sessions.create({
    mode: 'subscription',
    payment_method_types: ['card'],
    customer_email: email,
    line_items: [
      {
        price_data: {
          currency: 'gbp',
          unit_amount: unitAmount,
          product_data: {
            name: `${tier} - ${siteType} Package`,
          },
          recurring: { interval: 'month' },
        },
        quantity: 1,
      },
    ],
    metadata: {
      name,
      company: company || '',
      website,
      tier,
      siteType,
    },
    success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/success`,
    cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/buy-now`,
  });

  return res.status(200).json({ url: session.url });
}