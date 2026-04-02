import { useState } from "react";
import { supabase } from "../utils/supabaseClient";

export default function Login() {
  const [email, setEmail] = useState("");

  const handleLogin = async () => {
    const { error } = await supabase.auth.signInWithOtp({
      email,
    });

    if (error) alert(error.message);
    else alert("Verifique seu email para login!");
  };

  return (
    <div className="p-4">
      <h1>Login</h1>
      <input
        type="email"
        placeholder="Seu email"
        onChange={(e) => setEmail(e.target.value)}
      />
      <button onClick={handleLogin}>Entrar</button>
    </div>
  );
}
