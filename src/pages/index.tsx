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
  const [qr, setQr] = useState<string | null>(null);

  useEffect(() => {
    loadArts();
  }, []);

  async function loadArts() {
    const { data } = await supabase
      .from("arts")
      .select("*")
      .order("created_at", { ascending: false });

    setArts(data || []);
  }

  async function handleLike(artId: string) {
    await supabase.from("likes").insert([{ art_id: artId }]);
    alert("Curtido ❤️");
  }

  async function handleBuy(price: number, id: string) {
    const res = await fetch("/api/pix", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ amount: price }),
    });

    const data = await res.json();
    setQr(data.qr_code_base64);

    await supabase.from("sales").insert([
      {
        art_id: id,
        amount: price,
      },
    ]);
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>UPBlog</h1>

      {qr && (
        <div>
          <h3>Pague com Pix:</h3>
          <img src={`data:image/png;base64,${qr}`} width={200} />
        </div>
      )}

      {arts.map((art) => (
        <div key={art.id} style={{ marginBottom: 30 }}>
          <img src={art.url} width={250} />

          <h3>{art.title}</h3>
          <p>R$ {art.price}</p>

          <button onClick={() => handleBuy(art.price, art.id)}>
            Comprar
          </button>

          <button onClick={() => handleLike(art.id)}>
            ❤️ Curtir
          </button>
        </div>
      ))}
    </div>
  );
}
