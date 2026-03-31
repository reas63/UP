"use client";

import { useEffect, useState } from "react";

export default function Home() {
  const [arts, setArts] = useState<any[]>([]);

  useEffect(() => {
    // simulação temporária (até conectar Supabase)
    setArts([
      {
        id: 1,
        title: "Arte Demo",
        image: "https://via.placeholder.com/300",
        price: 10
      }
    ]);
  }, []);

  return (
    <div style={{ padding: 16 }}>

      {/* HEADER */}
      <h1 style={{
        fontSize: 32,
        fontWeight: "bold",
        textAlign: "center",
        color: "#E63946"
      }}>
        UP 🚀
      </h1>

      {/* BOTÕES */}
      <div style={{
        display: "flex",
        gap: 10,
        marginTop: 20
      }}>
        <button style={{
          flex: 1,
          padding: 10,
          background: "#1D3557",
          color: "#fff",
          borderRadius: 8
        }}>
          Upload
        </button>

        <button style={{
          flex: 1,
          padding: 10,
          background: "#E63946",
          color: "#fff",
          borderRadius: 8
        }}>
          IA Gerar
        </button>
      </div>

      {/* FEED GRID */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 10,
        marginTop: 20
      }}>
        {arts.map((art) => (
          <div key={art.id} style={{
            background: "#fff",
            borderRadius: 10,
            boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
            padding: 10
          }}>
            <img
              src={art.image}
              style={{
                width: "100%",
                borderRadius: 8
              }}
            />

            <h2 style={{ fontSize: 16 }}>
              {art.title}
            </h2>

            <p style={{
              color: "#E63946",
              fontWeight: "bold"
            }}>
              R$ {art.price}
            </p>
          </div>
        ))}
      </div>

    </div>
  );
}
