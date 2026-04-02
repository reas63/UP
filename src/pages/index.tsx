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
  const [qrCode, setQrCode] = useState<string | null>(null);

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

  async function handleBuy(price: number, artId: string) {
    const res = await fetch("/api/pix", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ amount: price }),
    });

    const data = await res.json();

    if (data.qr_code_base64) {
      setQrCode(data.qr_code_base64);
    } else {
      alert("Erro ao gerar Pix");
    }

    // salvar venda
    await supabase.from("sales").insert([
      {
        art_id: artId,
        amount: price,
      },
    ]);
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Feed de Artes</h1>

      {/* QR CODE */}
      {qrCode && (
        <div style={{ marginBottom: 20 }}>
          <h3>Pague com Pix:</h3>
          <img
            src={`data:image/png;base64,${qrCode}`}
            width={200}
          />
        </div>
      )}

      {arts.map((art) => (
        <div
          key={art.id}
          style={{
            border: "1px solid #ccc",
            margin: 10,
            padding: 10,
          }}
        >
          <img src={art.url} width={200} />

          <h3>{art.title}</h3>
          <p>R$ {art.price}</p>

          <button onClick={() => handleDelete(art.id)}>
            Delete
          </button>

          <button onClick={() => handleBuy(art.price, art.id)}>
            Comprar Pix
          </button>
        </div>
      ))}
    </div>
  );
}
