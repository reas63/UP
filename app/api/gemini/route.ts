import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { prompt } = body;

    if (!prompt) {
      return NextResponse.json({ error: "Prompt não informado" }, { status: 400 });
    }

    // Chamada Gemini gratuito (simulação)
    // Você precisa ter a chave GEMINI_API_KEY no .env
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json({ error: "Chave Gemini não configurada" }, { status: 500 });
    }

    // Exemplo de requisição simulando retorno do Gemini
    // Substitua aqui pela API real do Gemini, se tiver endpoint público gratuito
    const response = await fetch("https://api.gemini.fake/generate", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`,
      },
      body: JSON.stringify({ prompt }),
    });

    const data = await response.json();

    if (!data.image) {
      return NextResponse.json({ error: "Erro ao gerar imagem" }, { status: 500 });
    }

    // Retorna a URL da imagem gerada
    return NextResponse.json({ image: data.image });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
