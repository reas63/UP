import { useState } from "react";
import { supabase } from "../utils/supabaseClient";

export default function Studio() {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");
  const [prompt, setPrompt] = useState("");
  const [style, setStyle] = useState("realista");
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);

  const styles = [
    "realista", "anime", "pixel art", "cyberpunk", "futurista",
    "3D render", "cartoon", "minimalista", "vintage", "arte digital",
    "ilustração", "fantasia", "surrealismo", "neon", "dark",
    "steampunk", "NFT style", "logo design", "graffiti", "low poly",
    "watercolor", "oil painting", "cinematográfico", "arquitetura",
    "game art", "fantasia épica", "ultra realista", "design moderno"
  ];

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

  // 🤖 GERAR IA (PREVIEW)
  async function generateAI() {
    if (!prompt) return alert("Digite um prompt");

    setLoading(true);

    try {
      const finalPrompt = `${prompt}, estilo ${style}, alta qualidade, detalhado`;

      const res = await fetch("/api/gemini", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ prompt: finalPrompt }),
      });

      const data = await res.json();

      if (!data.url) {
        setLoading(false);
        alert("Erro ao gerar imagem");
        return;
      }

      setPreview(data.url);
      setLoading(false);
    } catch {
      setLoading(false);
      alert("Erro na IA");
    }
  }

  // 💾 SALVAR IA
  async function saveAI() {
    if (!preview) return alert("Gere uma imagem primeiro");

    setLoading(true);

    await supabase.from("arts").insert([
      {
        title: `${prompt} (${style})`,
        price: 10,
        url: preview,
      },
    ]);

    setLoading(false);
    setPreview(null);
    alert("Arte salva no feed!");
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>🎨 Studio Pro</h1>

      {/* UPLOAD */}
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
      <h3>🤖 Gerar Arte com IA</h3>

      <input
        type="text"
        placeholder="Ex: dragão futurista"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        style={{ width: "100%" }}
      />

      <br /><br />

      <select value={style} onChange={(e) => setStyle(e.target.value)}>
        {styles.map((s) => (
          <option key={s}>{s}</option>
        ))}
      </select>

      <br /><br />

      <button onClick={generateAI} disabled={loading}>
        {loading ? "Gerando..." : "Gerar Preview"}
      </button>

      <br /><br />

      {/* PREVIEW */}
      {preview && (
        <div>
          <h4>Preview:</h4>
          <img src={preview} width={250} />

          <br /><br />

          <button onClick={saveAI}>Salvar no Feed 💾</button>

          <button onClick={generateAI} style={{ marginLeft: 10 }}>
            🔄 Regenerar
          </button>
        </div>
      )}
    </div>
  );
}
