import { useState } from "react";
import { supabase } from "../utils/supabaseClient";

export default function Profile() {
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");

  async function saveProfile() {
    const { data } = await supabase.auth.getUser();
    const user = data.user;

    if (!user) {
      alert("Faça login primeiro");
      return;
    }

    await supabase.from("profiles").upsert([
      {
        id: user.id,
        name,
        bio,
      },
    ]);

    alert("Perfil salvo!");
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Perfil</h1>

      <input
        type="text"
        placeholder="Nome"
        onChange={(e) => setName(e.target.value)}
      />

      <br /><br />

      <textarea
        placeholder="Bio"
        onChange={(e) => setBio(e.target.value)}
      />

      <br /><br />

      <button onClick={saveProfile}>
        Salvar Perfil
      </button>
    </div>
  );
}
