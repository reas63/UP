"use client";

import { useState } from "react";

export default function ArtCard({ art }: any) {

  const [showPix, setShowPix] = useState(false);

  const pixKey = "reas63@hotmail.com";

  function gerarPixPayload() {
    const payload = `00020126360014BR.GOV.BCB.PIX0114${pixKey}520400005303986540${art.price}5802BR5920UP Digital Art6009Sao Paulo62070503***6304`;
    return payload;
  }

  return (
    <div style={{
      background: "#fff",
      borderRadius: 10,
      padding: 10,
      boxShadow: "0 2px 10px rgba(0,0,0,0.1)"
    }}>

      <img src={art.image} style={{ width: "100%" }} />

      <h2>{art.title}</h2>

      <p style={{ color: "#E63946", fontWeight: "bold" }}>
        R$ {art.price}
      </p>

      <button
        onClick={() => setShowPix(true)}
        style={{
          width: "100%",
          padding: 10,
          background: "#1D3557",
          color: "#fff",
          borderRadius: 8
        }}
      >
        Comprar
      </button>

      {showPix && (
        <div style={{ marginTop: 10 }}>

          <p><b>Pague com Pix:</b></p>

          <img
            src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${gerarPixPayload()}`}
          />

          <p style={{ fontSize: 12 }}>
            Chave: {pixKey}
          </p>

        </div>
      )}

    </div>
  );
}
async function pagarCartao() {
  const res = await fetch("/api/checkout", {
    method: "POST",
    body: JSON.stringify({
      title: art.title,
      price: art.price
    })
  });

  const data = await res.json();
  window.location.href = data.url;
}
<button onClick={pagarCartao}>
  Pagar com Cartão
</button>
