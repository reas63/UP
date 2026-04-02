import { useState } from "react";
import { supabase } from "../utils/supabaseClient";

export default function Login() {
  const [email, setEmail] = useState("");

  async function login() {
    await supabase.auth.signInWithOtp({
      email,
    });

    alert("Verifique seu email");
  }

  return (
    <div style={{ padding: 20 }}>
      <h1>Login</h1>

      <input
        type="email"
        placeholder="Seu email"
        onChange={(e) => setEmail(e.target.value)}
      />

      <br /><br />

      <button onClick={login}>
        Entrar
      </button>
    </div>
  );
}
