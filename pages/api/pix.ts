import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const { amount } = req.body;

  const response = await fetch("https://api.mercadopago.com/v1/payments", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.MP_ACCESS_TOKEN}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      transaction_amount: amount,
      payment_method_id: "pix",
      payer: {
        email: "teste@email.com",
      },
    }),
  });

  const data = await response.json();

  res.status(200).json({
    qr_code: data.point_of_interaction?.transaction_data?.qr_code,
    qr_code_base64: data.point_of_interaction?.transaction_data?.qr_code_base64,
  });
}
