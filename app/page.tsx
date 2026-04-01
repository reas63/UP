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
  const [file, setFile] = useState<any>(null);
  const [price, setPrice] = useState("");
  const [prompt, setPrompt] = useState("");
  const [pix, setPix] = useState<any>(null);

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
    if (!file) return;

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
        pago: false
      }
    ]);

    setFile(null);
    setPrice("");
    load();
  }

  // IA
  async function gerarIA() {
    const fakeImage = "https://picsum.photos/500?random=" + Math.random();

    await supabase.from("arts").insert([
      {
        title: prompt,
        image: fakeImage,
        price: 10,
        pago: false
      }
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
        title: art.title
      })
    });

    const data = await res.json();
    setPix(data);
  }

  return (
    <div style={{ background: "#F5F7FA", minHeight: "100vh", padding: 16 }}>

      <h1 style={{ textAlign: "center", color: "#1D3557" }}>
        UP Marketplace 🎨
      </h1>

      <Profile />

      {/* IA */}
      <input
        placeholder="Gerar arte IA"
        value={prompt}
        onChange={(e)=>setPrompt(e.target.value)}
      />
      <button onClick={gerarIA}>🤖 Gerar</button>

      {/* UPLOAD */}
      <input type="file" onChange={(e)=>setFile(e.target.files?.[0])}/>
      <input placeholder="Preço" onChange={(e)=>setPrice(e.target.value)}/>
      <button onClick={upload}>🚀 Upload</button>

      {/* PIX */}
      {pix && (
        <div>
          <h3>Pague com Pix</h3>
          <img src={`data:image/png;base64,${pix.qr}`} />
          <textarea value={pix.copiaecola} readOnly />
        </div>
      )}

      {/* FEED */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10 }}>

        {arts.map((art) => (
          <div key={art.id} style={{ background: "#fff", padding: 10 }}>

            <img src={art.image} style={{ width: "100%" }} />

            <p>R$ {art.price}</p>

            {/* DOWNLOAD BLOQUEADO */}
            {art.pago ? (
              <a href={art.image} download>⬇️ Download</a>
            ) : (
              <button onClick={()=>comprar(art)}>
                💰 Comprar via Pix
              </button>
            )}

            {/* DELETE */}
            <button
              onClick={async ()=>{
                await supabase.from("arts").delete().eq("id", art.id);
                load();
              }}
            >
              🗑️
            </button>

          </div>
        ))}

      </div>

    </div>
  );
}
