"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabase";

export default function Upload() {
  const [file, setFile] = useState<any>(null);

  async function upload() {
    await supabase.storage
      .from("arts")
      .upload(`public/${file.name}`, file);

    alert("Upload feito!");
  }

  return (
    <div>
      <input type="file" onChange={(e)=>setFile(e.target.files?.[0])}/>
      <button onClick={upload}>Enviar</button>
    </div>
  );
}
