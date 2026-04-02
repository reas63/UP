import { useState } from "react";
import { supabase } from "../utils/supabaseClient";

export default function Studio() {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);

  // 📤 UPLOAD MANUAL
  async function uploadArt() {
    if (!file) return alert("Selecione uma imagem");

    setLoading(true);

    const fileName = Date.now() + "-" + file.name;

    const { error } = await supabase.storage
      .from("UPBlog")
      .upload(fileName, file);

    if (error) {
      setLoading(false);
      alert(error.message);
      return;
    }

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

    setLoading(false);
    alert("Upload feito!");
  }

  // 🤖 GERAR ARTE COM GEMINI (GRÁTIS)
  async function generateAI() {
    if (!prompt) return alert("Digite um prompt");

    setLoading(true);

    try {
      const res = await fetch("/api/gemini", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();

      if (!data.url) {
        setLoading(false);
        alert("Erro ao gerar imagem");
        return;
      }

      await supabase.from("arts").insert([
        {
          title: prompt,
          price: 10,
          url: data.url,
        },
      ]);

      setLoading(false);
      alert("Arte criada com IA!");
    } catch (err) {
      setLoading(false);
      alert("Erro na IA");
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Studio</h1>

      {/* INPUTS MANUAL */}
      <h3>Upload Manual</h3>

      <input
        type="text"
        placeholder="Título"
        onChange={(e) => setTitle(e.target.value)}
      />

      <br /><br />

      <input
        type="number"
        placeholder="Preço"
        onChange={(e) => setPrice(e.target.value)}
      />

      <br /><br />

      <input
        type="file"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />

      <br /><br />

      <button onClick={uploadArt} disabled={loading}>
        {loading ? "Enviando..." : "Enviar Imagem"}
      </button>

      <hr style={{ margin: "30px 0" }} />

      {/* IA */}
      <h3>Gerar com IA 🤖</h3>

      <input
        type="text"
        placeholder="Ex: gato astronauta estilo neon"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        style={{ width: "100%" }}
      />

      <br /><br />

      <button onClick={generateAI} disabled={loading}>
        {loading ? "Gerando..." : "Gerar Arte com IA"}
      </button>
    </div>
  );
}
