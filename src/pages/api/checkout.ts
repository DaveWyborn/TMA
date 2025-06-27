// src/pages/api/checkout.ts

import type { NextApiRequest, NextApiResponse } from 'next';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'POST') {
    // TODO: Add your Stripe checkout session logic here
    // Example: create session, return URL

    return res.status(200).json({ success: true, message: 'Checkout session created' });
  } else {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ message: 'Method Not Allowed' });
  }
}