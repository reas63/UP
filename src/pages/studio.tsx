import { useState } from "react";
import { supabase } from "../utils/supabaseClient";

export default function Studio() {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [price, setPrice] = useState("");

  const uploadArt = async () => {
    if (!file) return alert("Selecione uma imagem");

    const fileName = `${Date.now()}-${file.name}`;

    const { error } = await supabase.storage
      .from("UPBlog") // <-- SEU BUCKET
      .upload(fileName, file);

    if (error) return alert(error.message);

    const { data } = supabase.storage
      .from("UPBlog")
      .getPublicUrl(fileName);

    await supabase.from("arts").insert([
      {
        title,
        price: parseFloat(price),
        url: data.publicUrl, // <-- CORRIGIDO
      },
    ]);

    alert("Arte enviada!");
  };

  return (
    <div className="p-4">
      <h1>Studio</h1>

      <input
        type="text"
        placeholder="Título"
        onChange={(e) => setTitle(e.target.value)}
      />

      <input
        type="number"
        placeholder="Preço"
        onChange={(e) => setPrice(e.target.value)}
      />

      <input
        type="file"
        onChange={(e) => setFile(e.target.files?.[0] || null)}
      />

      <button onClick={uploadArt}>Enviar</button>
    </div>
  );
}
