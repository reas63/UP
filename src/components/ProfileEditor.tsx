import React, { useState } from "react";
import { supabase } from "../utils/supabaseClient";

export const ProfileEditor = ({ user }: { user: any }) => {
  const [bio, setBio] = useState(user?.bio || "");
  const [avatar, setAvatar] = useState<File | null>(null);

  const handleSave = async () => {
    if (avatar) {
      const { data, error } = await supabase.storage
        .from("avatars")
        .upload(`public/${user.id}.png`, avatar, { upsert: true });
      if (error) console.error(error);
    }
    await supabase.from("profiles").update({ bio }).eq("id", user.id);
    alert("Perfil atualizado!");
  };

  return (
    <div>
      <input type="file" onChange={(e) => e.target.files && setAvatar(e.target.files[0])} />
      <textarea value={bio} onChange={(e) => setBio(e.target.value)} />
      <button onClick={handleSave}>Salvar</button>
    </div>
  );
};
