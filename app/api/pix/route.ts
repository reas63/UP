import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { amount, description } = await req.json();

    if (!amount) return NextResponse.json({ error: "Valor não informado" }, { status: 400 });

    // Simulação de QR Code Pix (substitua pelo real se tiver integração oficial)
    const pixCode = `00020126360014BR.GOV.BCB.PIX0114+551199999999520400005303986540${amount}5802BR5913UP Marketplace6009Sao Paulo62070503***6304B14F`;

    return NextResponse.json({ pixCode, amount, description });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
