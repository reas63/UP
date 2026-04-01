"use client";
import { useState, useEffect } from "react";

export default function Page() {
  const [arts, setArts] = useState<any[]>([]);
  const [prompt, setPrompt] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [price, setPrice] = useState("");

  useEffect(() => {
    fetch("/api/arts").then(res => res.json()).then(setArts);
  }, []);

  const generateImage = async () => {
    const res = await fetch("/api/gemini", { method: "POST", body: JSON.stringify({ prompt }), headers: { "Content-Type": "application/json" }});
    const data = await res.json();
    if (data.image) setImageUrl(data.image);
  };

  const uploadArt = async () => {
    if (!imageUrl || !price) return alert("Imagem e preço obrigatórios");
    const res = await fetch("/api/arts", { method: "POST", body: JSON.stringify({ user_id: 1, image_url: imageUrl, title: prompt, price }), headers: { "Content-Type": "application/json" }});
    const newArt = await res.json();
    setArts([newArt, ...arts]);
    setPrompt(""); setImageUrl(""); setPrice("");
  };

  const deleteArt = async (id: number) => {
    await fetch("/api/arts", { method: "DELETE", body: JSON.stringify({ id }), headers: { "Content-Type": "application/json" } });
    setArts(arts.filter(a => a.id !== id));
  };

  return (
    <div className="p-4">
      <div className="mb-4">
        <input value={prompt} onChange={e => setPrompt(e.target.value)} placeholder="Prompt IA" />
        <button onClick={generateImage}>Gerar Imagem IA</button>
        {imageUrl && <img src={imageUrl} alt="Preview IA" className="w-64" />}
        <input value={price} onChange={e => setPrice(e.target.value)} placeholder="Preço" />
        <button onClick={uploadArt}>Upload Arte</button>
      </div>

      <div className="grid grid-cols-3 gap-4">
        {arts.map(a => (
          <div key={a.id} className="border p-2">
            <img src={a.image_url} alt={a.title} />
            <p>{a.title}</p>
            <p>R$ {a.price}</p>
            <button onClick={() => deleteArt(a.id)}>Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}
