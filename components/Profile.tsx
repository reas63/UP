"use client";

import { useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function Profile() {
  const [name, setName] = useState("Artista UP");
  const [bio, setBio] = useState("Minha arte digital");
  const [photo, setPhoto] = useState("");
  const [file, setFile] = useState<any>(null);

  async function uploadPhoto() {
    if (!file) return;

    const fileName = "profile-" + Date.now();

    await supabase.storage
      .from("arts")
      .upload(fileName, file);

    const { data } = supabase.storage
      .from("arts")
      .getPublicUrl(fileName);

    setPhoto(data.publicUrl);
  }

  return (
    <div style={{ textAlign: "center", marginTop: 20 }}>

      {photo && (
        <img
          src={photo}
          style={{
            width: 80,
            height: 80,
            borderRadius: "50%"
          }}
        />
      )}

      <h2>{name}</h2>
      <p>{bio}</p>

      <input
        placeholder="Nome"
        onChange={(e) => setName(e.target.value)}
      />

      <input
        placeholder="Bio"
        onChange={(e) => setBio(e.target.value)}
      />

      <input
        type="file"
        onChange={(e) => setFile(e.target.files?.[0])}
      />

      <button onClick={uploadPhoto}>
        Salvar Foto
      </button>

    </div>
  );
}
