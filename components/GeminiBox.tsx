"use client";

import { useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function GeminiBox() {
  const [prompt, setPrompt] = useState("");
  const [loading, setLoading] = useState(false);

  async function generate() {
    if (!prompt) return;

    setLoading(true);

    const res = await fetch("/api/gemini", {
      method: "POST",
      body: JSON.stringify({ prompt })
    });

    const data = await res.json();

    // salvar no banco
    await supabase.from("arts").insert([
      {
        title: prompt,
        image: data.image,
        price: 30
      }
    ]);

    setLoading(false);
    alert("Arte criada!");
    location.reload();
  }

  return (
    <div style={{ marginTop: 10 }}>
      <input
        placeholder="Descreva a arte (ex: gato cyberpunk)"
        onChange={(e)=>setPrompt(e.target.value)}
        style={{ width: "100%", padding: 8 }}
      />

      <button
        onClick={generate}
        style={{
          marginTop: 5,
          width: "100%",
          padding: 10,
          background: "#E63946",
          color: "#fff",
          borderRadius: 8
        }}
      >
        {loading ? "Gerando..." : "Gerar IA"}
      </button>
    </div>
  );
}
