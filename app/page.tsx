"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import Profile from "@/components/Profile";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function Home() {
  const [arts, setArts] = useState<any[]>([]);
  const [file, setFile] = useState<File | null>(null);
  const [price, setPrice] = useState("");
  const [prompt, setPrompt] = useState("");
  const [pix, setPix] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  async function load() {
    const { data } = await supabase
      .from("arts")
      .select("*")
      .order("created_at", { ascending: false });

    setArts(data || []);
  }

  useEffect(() => {
    load();
  }, []);

  // UPLOAD
  async function upload() {
    if (!file) return alert("Escolha uma imagem");

    const fileName = Date.now() + "-" + file.name;

    await supabase.storage.from("arts").upload(fileName, file);

    const { data } = supabase.storage
      .from("arts")
      .getPublicUrl(fileName);

    await supabase.from("arts").insert([
      {
        title: "Arte UP",
        image: data.publicUrl,
        price: Number(price),
        pago: false,
      },
    ]);

    setFile(null);
    setPrice("");
    load();
  }

  // IA
  async function gerarIA() {
    if (!prompt) return alert("Digite algo");

    const image =
      "https://source.unsplash.com/500x500/?" + prompt;

    await supabase.from("arts").insert([
      {
        title: prompt,
        image,
        price: 10,
        pago: false,
      },
    ]);

    setPrompt("");
    load();
  }

  // PIX
  async function comprar(art: any) {
    const res = await fetch("/api/pix", {
      method: "POST",
      body: JSON.stringify({
        price: art.price,
        title: art.title,
      }),
    });

    const data = await res.json();

    if (data.error) {
      alert("Erro Pix");
      return;
    }

    setPix(data);
  }

  // DELETE
  async function deletar(art: any) {
    const path = art.image.split("/").pop();

    await supabase.storage.from("arts").remove([path]);

    await supabase.from("arts").delete().eq("id", art.id);

    load();
  }

  return (
    <div style={{ padding: 15 }}>
      <h1>UP Marketplace 🎨</h1>

      <Profile />

      {/* IA */}
      <div>
        <input
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Descreva a arte"
        />
        <button onClick={gerarIA}>Gerar IA</button>
      </div>

      {/* UPLOAD */}
      <div>
        <input
          type="file"
          onChange={(e) =>
            setFile(e.target.files?.[0] || null)
          }
        />
        <input
          placeholder="Preço"
          onChange={(e) => setPrice(e.target.value)}
        />
        <button onClick={upload}>Upload</button>
      </div>

      {/* PIX */}
      {pix && (
        <div>
          <h3>Pague com Pix</h3>
          <img src={`data:image/png;base64,${pix.qr}`} />
          <textarea value={pix.copiaecola} readOnly />
        </div>
      )}

      {/* FEED */}
      <div style={{ marginTop: 20 }}>
        {arts.map((art) => (
          <div key={art.id} style={{ marginBottom: 20 }}>
            <img src={art.image} width="100%" />

            <p>R$ {art.price}</p>

            {art.pago ? (
              <a href={art.image} download>
                Download
              </a>
            ) : (
              <button onClick={() => comprar(art)}>
                Comprar
              </button>
            )}

            <button onClick={() => deletar(art)}>
              Deletar
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
