"use client";

import { useState } from "react";

export default function GeminiBox() {
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState("");

  async function generate() {
    const res = await fetch("/api/gemini", {
      method: "POST",
      body: JSON.stringify({ prompt })
    });

    const data = await res.json();
    setResult(data.text);
  }

  return (
    <div className="p-4 border rounded-xl">
      <textarea
        className="w-full border p-2"
        placeholder="Descreva sua arte..."
        onChange={(e)=>setPrompt(e.target.value)}
      />

      <button
        className="bg-red-500 text-white px-4 py-2 mt-2"
        onClick={generate}
      >
        Gerar com IA
      </button>

      <p className="mt-4">{result}</p>
    </div>
  );
}
