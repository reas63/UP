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
  const [loadingAI, setLoadingAI] = useState(false);

  // 🔥 carregar feed
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

  // 🚀 upload manual
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
        price: Number(price)
      }
    ]);

    setFile(null);
    setPrice("");
    load();
  }

  // 🤖 IA
  async function gerarIA() {
    if (!prompt) return;

    setLoadingAI(true);

    // 👉 aqui depois pode conectar Gemini real
    const fakeImage = "https://picsum.photos/500?random=" + Math.random();

    await supabase.from("arts").insert([
      {
        title: prompt,
        image: fakeImage,
        price: 10
      }
    ]);

    setPrompt("");
    setLoadingAI(false);
    load();
  }

  return (
    <div style={{
      background: "#F5F7FA",
      minHeight: "100vh",
      padding: 16
    }}>

      {/* HEADER */}
      <h1 style={{
        textAlign: "center",
        fontSize: 30,
        fontWeight: "bold",
        color: "#1D3557"
      }}>
        UP 🎨 Marketplace
      </h1>

      {/* PERFIL */}
      <Profile />

      {/* 🤖 IA */}
      <div style={{
        background: "#fff",
        padding: 15,
        borderRadius: 15,
        marginTop: 15
      }}>

        <input
          placeholder="Descreva a arte (ex: gato cyberpunk)"
          value={prompt}
          onChange={(e)=>setPrompt(e.target.value)}
          style={{
            width: "100%",
            padding: 10,
            borderRadius: 8,
            border: "1px solid #ddd"
          }}
        />

        <button
          onClick={gerarIA}
          style={{
            width: "100%",
            marginTop: 10,
            padding: 10,
            background: "#1D3557",
            color: "#fff",
            borderRadius: 10
          }}
        >
          {loadingAI ? "Gerando..." : "🤖 Gerar Arte IA"}
        </button>

      </div>

      {/* UPLOAD */}
      <div style={{
        background: "#fff",
        padding: 15,
        borderRadius: 15,
        marginTop: 15
      }}>

        <input type="file" onChange={(e)=>setFile(e.target.files?.[0])} />

        <input
          placeholder="Preço (R$)"
          onChange={(e)=>setPrice(e.target.value)}
          style={{
            marginTop: 8,
            width: "100%",
            padding: 10,
            borderRadius: 8,
            border: "1px solid #ddd"
          }}
        />

        <button
          onClick={upload}
          style={{
            width: "100%",
            marginTop: 10,
            padding: 12,
            background: "#E63946",
            color: "#fff",
            borderRadius: 10
          }}
        >
          🚀 Publicar Arte
        </button>

      </div>

      {/* FEED */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 14,
        marginTop: 20
      }}>

        {arts.map((art) => (
          <div key={art.id} style={{
            background: "#fff",
            borderRadius: 16,
            overflow: "hidden",
            boxShadow: "0 8px 20px rgba(0,0,0,0.06)"
          }}>

            <img
              src={art.image}
              style={{
                width: "100%",
                height: 160,
                objectFit: "cover"
              }}
            />

            <div style={{ padding: 10 }}>

              <p style={{
                fontWeight: "bold",
                color: "#1D3557"
              }}>
                {art.title}
              </p>

              <p style={{
                color: "#E63946",
                fontWeight: "bold"
              }}>
                R$ {art.price}
              </p>

              {/* AÇÕES */}
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: 8
              }}>

                {/* DOWNLOAD */}
                <a
                  href={art.image}
                  download
                  style={{
                    padding: 6,
                    borderRadius: 8,
                    background: "#eee",
                    textDecoration: "none"
                  }}
                >
                  ⬇️
                </a>

                {/* DELETE */}
                <button
                  onClick={async ()=>{
                    await supabase
                      .from("arts")
                      .delete()
                      .eq("id", art.id);
                    load();
                  }}
                  style={{
                    padding: 6,
                    borderRadius: 8,
                    background: "red",
                    color: "#fff"
                  }}
                >
                  🗑️
                </button>

              </div>

            </div>

          </div>
        ))}

      </div>

    </div>
  );
}
