"use client";

import { useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function ArtCard({ art }: any) {

  const [price, setPrice] = useState(art.price);

  async function updatePrice() {
    await supabase
      .from("arts")
      .update({ price })
      .eq("id", art.id);

    alert("Preço atualizado!");
  }

  return (
    <div style={{
      background: "#fff",
      borderRadius: 10,
      padding: 10
    }}>

      <img src={art.image} style={{ width: "100%" }} />

      <input
        value={price}
        onChange={(e)=>setPrice(e.target.value)}
      />

      <button onClick={updatePrice}>
        Salvar Preço
      </button>

      <p style={{ color: "#E63946" }}>
        R$ {price}
      </p>

    </div>
  );
}
