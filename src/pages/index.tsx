import { useEffect, useState } from "react";
import Feed from "../components/Feed";
import { supabase } from "../utils/supabaseClient";

type Art = {
  id: string;
  title: string;
  url: string;
  price: number;
};

export default function Home() {
  const [arts, setArts] = useState<Art[]>([]);

  useEffect(() => {
    loadArts();
  }, []);

  async function loadArts() {
    const { data, error } = await supabase.from("arts").select("*");

    if (error) {
      console.error(error);
      return;
    }

    setArts(data || []);
  }

  async function handleDelete(id: string) {
    await supabase.from("arts").delete().eq("id", id);
    loadArts();
  }

  async function handleBuy(price: number) {
    const res = await fetch("/api/pix", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ amount: price }),
    });

    const data = await res.json();
    alert(data.message);
  }

  return (
    <div>
      <h1>Feed de Artes</h1>
      <Feed arts={arts} onDelete={handleDelete} onBuy={handleBuy} />
    </div>
  );
}
