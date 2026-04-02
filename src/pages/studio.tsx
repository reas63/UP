import { useState } from "react";
import { supabase } from "../utils/supabaseClient";

export default function Studio() {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [loading, setLoading] = useState(false);

  // 📤 UPLOAD NORMAL
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

  // 🤖 GERAR IA REAL
  async function generateAI() {
    setLoading(true);

    try {
      const res = await fetch("/api/gemini", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          prompt: "arte digital moderna colorida estilo futurista",
        }),
      });

      const data = await res.json();

      if (!data.image) {
        setLoading(false);
        alert("Erro ao gerar imagem");
        return;
      }

      // converter base64 para arquivo
      const fileName = Date.now() + ".png";

      const blob = await fetch(
        `data:image/png;base64,${data.image}`
      ).then((r) => r.blob());

      // upload no Supabase
      const { error } = await supabase.storage
        .from("UPBlog")
        .upload(fileName, blob);

      if (error) {
        setLoading(false);
        alert(error.message);
        return;
      }

      const { data: publicUrl } = supabase.storage
        .from("UPBlog")
        .getPublicUrl(fileName);

      // salvar no banco
      await supabase.from("arts").insert([
        {
          title: "Arte IA",
          price: 10,
          url: publicUrl.publicUrl,
        },
      ]);

      setLoading(false);
      alert("Imagem IA criada e salva!");
    } catch (err) {
      setLoading(false);
      alert("Erro na IA");
    }
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Studio</h1>

      {/* INPUTS */}
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
        onChange={(e) =>
          setFile(e.target.files?.[0] || null)
        }
      />

      <br /><br />

      {/* BOTÕES */}
      <button onClick={uploadArt} disabled={loading}>
        {loading ? "Enviando..." : "Enviar Imagem"}
      </button>

      <br /><br />

      <button onClick={generateAI} disabled={loading}>
        {loading ? "Gerando..." : "Gerar Arte com IA 🤖"}
      </button>
    </div>
  );
}
