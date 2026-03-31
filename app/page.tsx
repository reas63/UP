"use client";

import { useState, useEffect } from "react";

export default function Home() {
  const [arts, setArts] = useState<any[]>([]);
  const [editing, setEditing] = useState(false);

  const [profile, setProfile] = useState({
    name: "Artista UP",
    bio: "Minha arte digital",
    photo: "https://via.placeholder.com/100"
  });

  useEffect(() => {
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

      {/* PERFIL */}
      <div style={{
        marginTop: 20,
        textAlign: "center"
      }}>
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
          style={{
            background: "#1D3557",
            color: "#fff",
            padding: 8,
            borderRadius: 8,
            marginTop: 5
          }}
          onClick={() => setEditing(!editing)}
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
              style={{
                background: "#E63946",
                color: "#fff",
                padding: 8,
                marginTop: 5
              }}
              onClick={() => setEditing(false)}
            >
              Salvar
            </button>

          </div>
        )}
      </div>

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

      {/* GRID */}
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
            <img src={art.image} style={{ width: "100%" }} />
            <h2>{art.title}</h2>
            <p style={{ color: "#E63946" }}>
              R$ {art.price}
            </p>
          </div>
        ))}
      </div>

    </div>
  );
}
