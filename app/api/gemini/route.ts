export async function POST(req: Request) {
  const { prompt } = await req.json();

  // API de imagem (exemplo usando pollinations - grátis)
  const imageUrl = `https://image.pollinations.ai/prompt/${encodeURIComponent(prompt)}`;

  return Response.json({
    image: imageUrl
  });
}
