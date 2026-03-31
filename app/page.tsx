"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

import ArtCard from "@/components/ArtCard";
import Upload from "@/components/Upload";
import GeminiBox from "@/components/GeminiBox";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function Home() {

  const [arts, setArts] = useState<any[]>([]);
  const [editing, setEditing] = useState(false);

  const [profile, setProfile] = useState({
    name: "Artista UP",
    bio: "Minha arte digital",
    photo: "https://via.placeholder.com/100"
  });

  // 🔥 carregar dados reais do banco
  useEffect(() => {
    async function load() {
      const { data } = await supabase
        .from("arts")
        .select("*")
        .order("created_at", { ascending: false });

      setArts(data || []);
    }

    load();
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

      {/* PERFIL */}
      <div style={{ textAlign: "center", marginTop: 20 }}>
        <img
          src={profile.photo}
          style={{
            width: 80,
            height: 80,
            borderRadius: "50%"
          }}
        />

        <h2>{profile.name}</h2>
        <p>{profile.bio}</p>

        <button
          onClick={() => setEditing(!editing)}
          style={{
            background: "#1D3557",
            color: "#fff",
            padding: 8,
            borderRadius: 8
          }}
        >
          Editar Perfil
        </button>

        {editing && (
          <div style={{ marginTop: 10 }}>
            <input
              placeholder="Nome"
              onChange={(e) =>
                setProfile({ ...profile, name: e.target.value })
              }
            />

            <input
              placeholder="Bio"
              onChange={(e) =>
                setProfile({ ...profile, bio: e.target.value })
              }
            />

            <input
              placeholder="URL da foto"
              onChange={(e) =>
                setProfile({ ...profile, photo: e.target.value })
              }
            />

            <button
              onClick={() => setEditing(false)}
              style={{
                background: "#E63946",
                color: "#fff",
                padding: 8,
                marginTop: 5
              }}
            >
              Salvar
            </button>
          </div>
        )}
      </div>

      {/* UPLOAD REAL */}
      <div style={{ marginTop: 20 }}>
        <Upload />
      </div>

      {/* IA */}
      <div style={{ marginTop: 20 }}>
        <GeminiBox />
      </div>

      {/* FEED */}
      <div style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: 10,
        marginTop: 20
      }}>
        {arts.map((art) => (
          <ArtCard key={art.id} art={art} />
        ))}
      </div>

    </div>
  );
}
