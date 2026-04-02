import { useEffect, useState } from "react";
import { supabase } from "../utils/supabaseClient";

type Art = {
  id: string;
  title: string;
  url: string;
  price: number;
};

export default function Home() {
  const [arts, setArts] = useState<Art[]>([]);

  useEffect(() => {
    loadArts();
  }, []);

  async function loadArts() {
    const { data } = await supabase.from("arts").select("*");
    setArts(data || []);
  }

  async function handleDelete(id: string) {
    await supabase.from("arts").delete().eq("id", id);
    loadArts();
  }

  return (
    <div style={styles.container}>
      
      {/* HEADER */}
      <div style={styles.header}>
        <img
          src="https://i.pravatar.cc/150"
          style={styles.avatar}
        />
        <h2>Meu Perfil</h2>
        <button style={styles.editBtn}>Editar Perfil</button>
      </div>

      {/* CARD ACERVO */}
      <div style={styles.card}>
        <div style={styles.cardHeader}>
          <h3>Meu Acervo</h3>
          <button style={styles.addBtn}>+</button>
        </div>

        <div style={styles.gallery}>
          {arts.slice(0, 2).map((art) => (
            <img key={art.id} src={art.url} style={styles.thumb} />
          ))}
        </div>
      </div>

      {/* FEED */}
      <div>
        <h3 style={{ marginTop: 20 }}>Artes com IA</h3>

        {arts.map((art) => (
          <div key={art.id} style={styles.artCard}>
            <img src={art.url} style={styles.artImage} />

            <div>
              <h4>{art.title}</h4>
              <p>R$ {art.price}</p>

              <button style={styles.buyBtn}>
                Comprar
              </button>

              <button
                style={styles.deleteBtn}
                onClick={() => handleDelete(art.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles: any = {
  container: {
    padding: 20,
    fontFamily: "sans-serif",
    background: "linear-gradient(180deg, #3a86ff, #ffffff)",
    minHeight: "100vh",
  },

  header: {
    textAlign: "center",
    color: "#fff",
  },

  avatar: {
    width: 100,
    borderRadius: "50%",
  },

  editBtn: {
    marginTop: 10,
    padding: 10,
    borderRadius: 20,
    background: "#1d4ed8",
    color: "#fff",
    border: "none",
  },

  card: {
    background: "#fff",
    borderRadius: 20,
    padding: 15,
    marginTop: 20,
  },

  cardHeader: {
    display: "flex",
    justifyContent: "space-between",
  },

  addBtn: {
    background: "#3a86ff",
    color: "#fff",
    borderRadius: "50%",
    width: 40,
    height: 40,
    border: "none",
  },

  gallery: {
    display: "flex",
    gap: 10,
    marginTop: 10,
  },

  thumb: {
    width: 100,
    borderRadius: 10,
  },

  artCard: {
    display: "flex",
    gap: 10,
    background: "#fff",
    marginTop: 10,
    padding: 10,
    borderRadius: 10,
  },

  artImage: {
    width: 100,
    borderRadius: 10,
  },

  buyBtn: {
    background: "orange",
    color: "#fff",
    border: "none",
    padding: 8,
    marginTop: 5,
  },

  deleteBtn: {
    background: "red",
    color: "#fff",
    border: "none",
    padding: 8,
    marginLeft: 5,
  },
};
