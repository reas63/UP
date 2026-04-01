import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const response = await fetch("https://api.mercadopago.com/v1/payments", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${process.env.MERCADO_PAGO_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        transaction_amount: Number(body.price),
        description: body.title,
        payment_method_id: "pix",
        payer: {
          email: "test@test.com",
        },
      }),
    });

    const data = await response.json();

    console.log("PIX RESPONSE:", data);

    if (!data.point_of_interaction) {
      return NextResponse.json({ error: data });
    }

    return NextResponse.json({
      copiaecola: data.point_of_interaction.transaction_data.qr_code,
      qr: data.point_of_interaction.transaction_data.qr_code_base64,
    });

  } catch (err) {
    return NextResponse.json({ error: "Erro interno Pix" });
  }
}
