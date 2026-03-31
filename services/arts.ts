import { supabase } from "@/lib/supabase";

export async function getArts() {
  const { data } = await supabase
    .from("arts")
    .select("*")
    .order("created_at", { ascending: false });

  return data;
}
