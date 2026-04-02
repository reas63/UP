import React from "react";

type Props = {
  id: string;
  title: string;
  url: string;
  price: number;
  onDelete: (id: string) => void;
  onBuy: (price: number) => void;
};

export default function ArtCard({
  id,
  title,
  url,
  price,
  onDelete,
  onBuy,
}: Props) {
  return (
    <div style={{ border: "1px solid #ccc", padding: 10, margin: 10 }}>
      <img src={url} alt={title} width="100%" />

      <h3>{title}</h3>
      <p>R$ {price}</p>

      <button onClick={() => onDelete(id)}>Delete</button>

      <button onClick={() => onBuy(price)}>Comprar Pix</button>
    </div>
  );
}
