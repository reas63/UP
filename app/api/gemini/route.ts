import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { prompt } = await req.json();

    if (!prompt) return NextResponse.json({ error: "Prompt não informado" }, { status: 400 });

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) return NextResponse.json({ error: "Chave Gemini não configurada" }, { status: 500 });

    // Requisição simulando Gemini gratuito
    const res = await fetch("https://api.gemini.fake/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
      body: JSON.stringify({ prompt }),
    });

    const data = await res.json();

    if (!data.image) return NextResponse.json({ error: "Erro ao gerar imagem" }, { status: 500 });

    return NextResponse.json({ image: data.image });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
