"use client";

import { useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function Profile() {

  const [file, setFile] = useState<any>(null);
  const [photo, setPhoto] = useState("");

  async function uploadPhoto() {
    if (!file) return;

    const fileName = "profile-" + Date.now();

    await supabase.storage.from("arts").upload(fileName, file);

    const { data } = supabase.storage
      .from("arts")
      .getPublicUrl(fileName);

    setPhoto(data.publicUrl);
  }

  return (
    <div style={{
      background: "#fff",
      padding: 20,
      borderRadius: 16,
      textAlign: "center",
      marginTop: 15,
      boxShadow: "0 6px 15px rgba(0,0,0,0.05)"
    }}>

      {photo ? (
        <img
          src={photo}
          style={{
            width: 90,
            height: 90,
            borderRadius: "50%",
            objectFit: "cover"
          }}
        />
      ) : (
        <div style={{
          width: 90,
          height: 90,
          borderRadius: "50%",
          background: "#ddd",
          margin: "auto"
        }} />
      )}

      <input
        type="file"
        onChange={(e)=>setFile(e.target.files?.[0])}
        style={{ marginTop: 10 }}
      />

      <button
        onClick={uploadPhoto}
        style={{
          marginTop: 10,
          padding: 10,
          background: "#1D3557",
          color: "#fff",
          borderRadius: 10
        }}
      >
        Editar Foto
      </button>

    </div>
  );
}
