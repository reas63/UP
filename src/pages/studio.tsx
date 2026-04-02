import { useState } from "react";
import { supabase } from "../utils/supabaseClient";

export default function Studio() {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");

  async function uploadArt() {
    if (!file) return alert("Selecione uma imagem");

    const fileName = Date.now() + "-" + file.name;

    const { error } = await supabase.storage
      .from("UPBlog")
      .upload(fileName, file);

    if (error) return alert(error.message);

    const { data } = supabase.storage
      .from("UPBlog")
      .getPublicUrl(fileName);

    await supabase.from("arts").insert([
      {
        title,
        price: Number(price),
        url: data.publicUrl,
      },
    ]);

    alert("Upload feito!");
  }

  // 🤖 IA
  async function generateAI() {
    const res = await fetch("/api/gemini", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt: "arte digital moderna" }),
    });

    const data = await res.json();

    await supabase.from("arts").insert([
      {
        title: "Arte IA",
        price: 10,
        url: data.url,
      },
    ]);

    alert("Arte criada com IA!");
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Studio</h1>

      <input
        type="text"
        placeholder="Título"
        onChange={(e) => setTitle(e.target.value)}
      />

      <input
        type="number"
        placeholder="Preço"
        onChange={(e) => setPrice(e.target.value)}
      />

      <input
        type="file"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />

      <br /><br />

      <button onClick={uploadArt}>Enviar</button>

      <br /><br />

      <button onClick={generateAI}>
        Gerar com IA 🤖
      </button>
    </div>
  );
}
