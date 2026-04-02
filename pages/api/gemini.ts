// pages/api/gemini.ts
import type { NextApiRequest, NextApiResponse } from 'next';
import { supabase } from '../../supabaseClient';

type Data = { fileName?: string; error?: string };

export default async function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Método não permitido' });

  const { prompt } = req.body;

  try {
    const response = await fetch('https://api.gemini.free/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${process.env.GEMINI_API_KEY}`,
      },
      body: JSON.stringify({ prompt }),
    });

    const data = await response.json();
    const base64 = data.image.split(',')[1];
    const buffer = Buffer.from(base64, 'base64');
    const fileName = `art-${Date.now()}.png`;

    await supabase.storage.from('arts').upload(fileName, buffer, { contentType: 'image/png' });
    const { error } = await supabase.from('arts').insert([{ image: fileName, price: 0 }]);
    if (error) throw error;

    res.status(200).json({ fileName });
  } catch (err: any) {
    res.status(500).json({ error: err.message });
  }
}
