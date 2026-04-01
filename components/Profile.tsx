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

    const fileName = "profile-" + Date.now();

    await supabase.storage.from("arts").upload(fileName, file);

    const { data } = supabase.storage.from("arts").getPublicUrl(fileName);

    setPhoto(data.publicUrl);
  }

  return (
    <div>

      {photo && <img src={photo} style={{ width: 80, borderRadius: "50%" }} />}

      <input type="file" onChange={(e)=>setFile(e.target.files?.[0])} />

      <button onClick={uploadPhoto}>Foto</button>

    </div>
  );
}
