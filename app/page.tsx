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

  async function comprar(art: any) {
    alert("Pagamento via Pix:\nreas63@hotmail.com");
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

      {/* UPLOAD */}
      <div style={{
        background: "#fff",
        padding: 15,
        borderRadius: 15,
        marginTop: 15,
        boxShadow: "0 6px 15px rgba(0,0,0,0.05)"
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
            borderRadius: 10,
            fontWeight: "bold"
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
            boxShadow: "0 8px 20px rgba(0,0,0,0.06)",
            transition: "0.2s"
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
                fontWeight: "bold",
                fontSize: 16
              }}>
                R$ {art.price}
              </p>

              {/* AÇÕES */}
              <div style={{
                display: "flex",
                justifyContent: "space-between",
                marginTop: 8
              }}>

                <button style={{
                  padding: 6,
                  borderRadius: 8,
                  background: "#eee"
                }}>
                  ❤️
                </button>

                <button
                  onClick={()=>comprar(art)}
                  style={{
                    padding: 6,
                    borderRadius: 8,
                    background: "#1D3557",
                    color: "#fff"
                  }}
                >
                  💰 Comprar
                </button>

              </div>

            </div>

          </div>
        ))}

      </div>

    </div>
  );
}
