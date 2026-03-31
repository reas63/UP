"use client";

import { useState } from "react";

export default function ArtCard({ art }: any) {

  const [showPix, setShowPix] = useState(false);

  const pixKey = "reas63@hotmail.com";

  function gerarPix() {
    setShowPix(true);
  }

  return (
    <div style={{
      background: "#fff",
      borderRadius: 10,
      padding: 10,
      boxShadow: "0 2px 10px rgba(0,0,0,0.1)"
    }}>

      <img
        src={art.image}
        style={{
          width: "100%",
          borderRadius: 8
        }}
      />

      <h2>{art.title}</h2>

      <p style={{
        color: "#E63946",
        fontWeight: "bold"
      }}>
        R$ {art.price}
      </p>

      <button
        onClick={gerarPix}
        style={{
          marginTop: 10,
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

          <p><b>Pague via Pix:</b></p>

          <p>{pixKey}</p>

          <img
            src={`https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${pixKey}`}
          />

        </div>
      )}

    </div>
  );
}
