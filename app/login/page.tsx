"use client";

import { useState } from "react";
import { signIn } from "@/services/auth";

export default function Login() {
  const [email, setEmail] = useState("");

  return (
    <div className="p-6 text-center">
      <h1 className="text-2xl font-bold">Entrar no UP</h1>

      <input
        className="border p-2 mt-4"
        placeholder="Seu email"
        onChange={(e)=>setEmail(e.target.value)}
      />

      <button
        className="bg-red-500 text-white px-4 py-2 mt-4"
        onClick={()=>signIn(email)}
      >
        Entrar
      </button>
    </div>
  );
}
