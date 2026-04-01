"use client";

import { useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function Upload({ reload }: any) {

  const [file, setFile] = useState<any>(null);
  const [price, setPrice] = useState("");

  async function upload() {
    if (!file) return;

    const fileName = Date.now() + "-" + file.name;

    await supabase.storage
      .from("arts")
      .upload(fileName, file);

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

    alert("Upload feito!");
    reload();
  }

  return (
    <div style={{ marginTop: 20 }}>

      <input type="file" onChange={(e)=>setFile(e.target.files?.[0])}/>

      <input
        placeholder="Preço"
        onChange={(e)=>setPrice(e.target.value)}
      />

      <button onClick={upload}>
        Enviar Arte
      </button>

    </div>
  );
}
