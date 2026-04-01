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
    const { data, error } = await supabase
      .from("arts")
      .select("*")
      .order("created_at", { ascending: false });

    if (!error) setArts(data || []);
  }

  useEffect(() => {
    load();
  }, []);

  // UPLOAD REAL
  async function upload() {
    if (!file) return alert("Escolha uma imagem");

    setLoading(true);

    const fileName = Date.now() + "-" + file.name;

    const { error: uploadError } = await supabase
      .storage
      .from("arts")
      .upload(fileName, file);

    if (uploadError) {
      alert("Erro upload");
      setLoading(false);
      return;
    }

    const { data } = supabase.storage
      .from("arts")
      .getPublicUrl(fileName);

    await supabase.from("arts").insert([
      {
        title: "Arte UP",
        image: data.publicUrl,
        price: Number(price),
        pago: false
      }
    ]);

    setFile(null);
    setPrice("");
    setLoading(false);
    load();
  }

  // IA (simples)
  async function gerarIA() {
    if (!prompt) return alert("Digite algo");

    setLoading(true);

    const image = "https://picsum.photos/500?random=" + Math.random();

    await supabase.from("arts").insert([
      {
        title: prompt,
        image,
        price: 10,
        pago: false
      }
    ]);

    setPrompt("");
    setLoading(false);
    load();
  }

  // PIX
  async function comprar(art: any) {
    try {
      const res = await fetch("/api/pix", {
        method: "POST",
        body: JSON.stringify({
          price: art.price,
          title: art.title
        })
      });

      const data = await res.json();
      setPix(data);

    } catch {
      alert("Erro Pix");
    }
  }

  return (
    <div style={{ padding: 15 }}>

      <h1>UP Marketplace 🎨</h1>

      <Profile />

      {/* IA */}
      <div>
        <input
          value={prompt}
          onChange={(e)=>setPrompt(e.target.value)}
          placeholder="Descreva a arte"
        />
        <button onClick={gerarIA}>
          {loading ? "..." : "Gerar IA"}
        </button>
      </div>

      {/* UPLOAD */}
      <div>
        <input type="file" onChange={(e)=>setFile(e.target.files?.[0] || null)} />
        <input placeholder="Preço" onChange={(e)=>setPrice(e.target.value)} />
        <button onClick={upload}>
          {loading ? "..." : "Upload"}
        </button>
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
              <a href={art.image} download>Download</a>
            ) : (
              <button onClick={()=>comprar(art)}>Comprar</button>
            )}

            <button
              onClick={async ()=>{
                await supabase.from("arts").delete().eq("id", art.id);
                load();
              }}
            >
              Deletar
            </button>

          </div>
        ))}
      </div>

    </div>
  );
}
