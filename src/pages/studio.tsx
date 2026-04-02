import { useState } from "react";
import { supabase } from "../utils/supabaseClient";
import { generateImage } from "../utils/generateImage";

export default function Studio() {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [prompt, setPrompt] = useState("");
  const [generatedUrl, setGeneratedUrl] = useState("");

  const uploadArt = async () => {
    if (!file) return alert("Selecione uma imagem");

    const fileName = `${Date.now()}-${file.name}`;

    const { error } = await supabase.storage
      .from("arts-bucket")
      .upload(fileName, file);

    if (error) return alert(error.message);

    const { data } = supabase.storage
      .from("arts-bucket")
      .getPublicUrl(fileName);

    await supabase.from("arts").insert([
      {
        title,
        price: parseFloat(price),
        image_url: data.publicUrl,
      },
    ]);

    alert("Arte enviada!");
  };

  const gerarImagem = async () => {
    const url = await generateImage(prompt);
    setGeneratedUrl(url);
  };

  return (
    <div className="p-4">
      <h1>Studio</h1>

      <h2>Upload de Arte</h2>
      <input type="text" placeholder="Título" onChange={(e) => setTitle(e.target.value)} />
      <input type="number" placeholder="Preço" onChange={(e) => setPrice(e.target.value)} />
      <input type="file" onChange={(e) => setFile(e.target.files?.[0] || null)} />
      <button onClick={uploadArt}>Enviar</button>

      <h2>Gerar com IA</h2>
      <input type="text" placeholder="Prompt" onChange={(e) => setPrompt(e.target.value)} />
      <button onClick={gerarImagem}>Gerar</button>

      {generatedUrl && <img src={generatedUrl} alt="IA" />}
    </div>
  );
}
