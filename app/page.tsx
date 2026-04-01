"use client";

import { useState, useEffect } from "react";
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import Image from "next/image";

export default function HomePage() {
  const supabase = createClientComponentClient();
  const [feed, setFeed] = useState<any[]>([]);
  const [prompt, setPrompt] = useState("");
  const [perfil, setPerfil] = useState<any>({ foto: "", bio: "" });
  const [fotoPerfil, setFotoPerfil] = useState<File | null>(null);

  // Pega perfil e feed ao carregar
  useEffect(() => {
    carregarPerfil();
    carregarFeed();
  }, []);

  async function carregarPerfil() {
    const { data } = await supabase.from("perfil").select("*").single();
    if (data) setPerfil(data);
  }

  async function carregarFeed() {
    const { data } = await supabase.from("arts").select("*").order("created_at", { ascending: false });
    if (data) setFeed(data);
  }

  async function handleUploadFoto() {
    if (!fotoPerfil) return alert("Selecione uma imagem!");
    const arquivo = fotoPerfil;
    const nomeArquivo = `${Date.now()}_${arquivo.name}`;
    const { data: uploadData, error } = await supabase.storage
      .from("perfil")
      .upload(nomeArquivo, arquivo);

    if (error) return alert("Erro ao enviar foto: " + error.message);

    const urlFoto = supabase.storage.from("perfil").getPublicUrl(uploadData.path).publicUrl;

    await supabase.from("perfil").update({ foto: urlFoto }).eq("id", perfil.id);
    setPerfil({ ...perfil, foto: urlFoto });
    setFotoPerfil(null);
  }

  async function handleEditarBio() {
    const novaBio = prompt("Digite sua nova bio", perfil.bio);
    if (!novaBio) return;
    await supabase.from("perfil").update({ bio: novaBio }).eq("id", perfil.id);
    setPerfil({ ...perfil, bio: novaBio });
  }

  async function gerarArte() {
    if (!prompt) return alert("Digite um prompt para gerar arte!");
    const res = await fetch("/api/gemini", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });
    const data = await res.json();
    if (data.error) return alert("Erro: " + data.error);

    // Salva no feed
    const { error } = await supabase.from("arts").insert([
      {
        title: prompt,
        image: data.image,
        price: 10,
      },
    ]);
    if (error) return alert("Erro ao salvar no feed: " + error.message);
    setFeed([data, ...feed]);
    setPrompt("");
  }

  async function handleDelete(id: number) {
    const { error } = await supabase.from("arts").delete().eq("id", id);
    if (error) return alert("Erro ao deletar: " + error.message);
    setFeed(feed.filter((item) => item.id !== id));
  }

  async function handlePagamentoPix(art: any) {
    alert(`Simulação Pix: você pagaria R$ ${art.price} para comprar "${art.title}"`);
    // Aqui você pode chamar sua API real Pix
  }

  return (
    <div className="container mx-auto p-4">
      {/* Perfil */}
      <div className="flex items-center gap-4 mb-6">
        {perfil.foto && <Image src={perfil.foto} width={80} height={80} alt="Perfil" className="rounded-full" />}
        <div>
          <p className="font-bold">Bio: {perfil.bio}</p>
          <button onClick={handleEditarBio} className="bg-blue-500 text-white px-2 py-1 rounded">Editar Bio</button>
        </div>
        <div>
          <input type="file" onChange={(e) => setFotoPerfil(e.target.files?.[0] ?? null)} />
          <button onClick={handleUploadFoto} className="bg-green-500 text-white px-2 py-1 rounded">Editar Foto</button>
        </div>
      </div>

      {/* Gerar Arte */}
      <div className="flex gap-2 mb-6">
        <input
          type="text"
          placeholder="Digite o prompt da arte"
          className="border p-2 flex-1"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
        />
        <button onClick={gerarArte} className="bg-purple-500 text-white px-4 py-2 rounded">Gerar Arte</button>
      </div>

      {/* Feed de Artes */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 overflow-y-auto max-h-[600px]">
        {feed.map((arte) => (
          <div key={arte.id} className="border p-2 rounded relative">
            <Image src={arte.image} width={300} height={300} alt={arte.title} className="object-cover" />
            <p className="font-bold">{arte.title}</p>
            <p>Preço: R$ {arte.price}</p>
            <div className="flex gap-2 mt-2">
              <button onClick={() => handleDelete(arte.id)} className="bg-red-500 text-white px-2 py-1 rounded">Delete</button>
              <button onClick={() => handlePagamentoPix(arte)} className="bg-green-500 text-white px-2 py-1 rounded">Comprar Pix</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
