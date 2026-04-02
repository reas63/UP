// pages/api/pix.ts
import type { NextApiRequest, NextApiResponse } from 'next';

type Data = { qrCodeUrl?: string; error?: string };

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método não permitido' });

  const { amount } = req.body;
  const qrCodeUrl = `https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=PIX:${amount}`;

  res.status(200).json({ qrCodeUrl });
}
