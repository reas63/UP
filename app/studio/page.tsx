"use client"

import { useState } from "react"

export default function Studio() {
  const [prompt, setPrompt] = useState("")
  const [image, setImage] = useState("")

  const gerarImagem = async () => {
    try {
      const res = await fetch("/api/gemini", {
        method: "POST",
        body: JSON.stringify({ prompt }),
      })

      const data = await res.json()
      setImage(data.url)
    } catch (e) {
      alert("Erro ao gerar imagem")
    }
  }

  return (
    <main style={{ padding: 20 }}>
      <h1>🎨 Studio IA</h1>

      <textarea
        placeholder="Descreva a imagem..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        style={{ width: "100%", height: 100 }}
      />

      <br /><br />

      <button onClick={gerarImagem}>Gerar Imagem</button>

      {image && (
        <div style={{ marginTop: 20 }}>
          <img src={image} style={{ width: "100%" }} />
        </div>
      )}
    </main>
  )
}
