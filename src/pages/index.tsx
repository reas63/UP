import React, { useEffect, useState } from "react";
import { Feed } from "../components/Feed";
import { supabase } from "../utils/supabaseClient";

export default function Home() {
  const [arts, setArts] = useState<any[]>([]);

  useEffect(() => {
    async function loadArts() {
      const { data } = await supabase.from("arts").select("*");
      setArts(data || []);
    }
    loadArts();
  }, []);

  const handleDelete = async (id: string) => {
    await supabase.from("arts").delete().eq("id", id);
    setArts(arts.filter((a) => a.id !== id));
  };

  const handleBuy = async (id: string, price: number) => {
    const { data } = await fetch("/api/pix", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: price, user: "UsuárioTeste" }),
    }).then(res => res.json());
    alert(data.message);
  };

  return <Feed arts={arts} onDelete={handleDelete} onBuy={handleBuy} />;
}
