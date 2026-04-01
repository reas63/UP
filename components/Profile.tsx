"use client";

import { useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function Profile() {
  const [file, setFile] = useState<File | null>(null);
  const [photo, setPhoto] = useState("");
  const [bio, setBio] = useState("");

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
    <div style={{ marginBottom: 20 }}>
      <h3>Perfil</h3>

      {photo && (
        <img
          src={photo}
          width={80}
          style={{ borderRadius: "50%" }}
        />
      )}

      <input
        type="file"
        onChange={(e) =>
          setFile(e.target.files?.[0] || null)
        }
      />

      <button onClick={uploadPhoto}>
        Editar Foto
      </button>

      <textarea
        placeholder="Sua bio"
        value={bio}
        onChange={(e) => setBio(e.target.value)}
      />
    </div>
  );
}
