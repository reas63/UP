import { NextResponse } from "next/server";

export async function POST(req: Request) {

  const { price, title } = await req.json();

  const response = await fetch("https://api.mercadopago.com/v1/payments", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${process.env.MERCADO_PAGO_TOKEN}`,
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      transaction_amount: Number(price),
      description: title,
      payment_method_id: "pix",
      payer: {
        email: "cliente@up.com"
      }
    })
  });

  const data = await response.json();

  return NextResponse.json({
    copiaecola: data.point_of_interaction.transaction_data.qr_code,
    qr: data.point_of_interaction.transaction_data.qr_code_base64
  });
}
