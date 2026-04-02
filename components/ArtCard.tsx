import React from "react";

type ArtCardProps = {
  id: string;
  title: string;
  url: string;
  price: number;
  onDelete: (id: string) => void;
  onBuy: (id: string, price: number) => void;
};

export const ArtCard: React.FC<ArtCardProps> = ({
  id,
  title,
  url,
  price,
  onDelete,
  onBuy,
}) => {
  return (
    <div className="border p-2 m-2 w-60">
      <img src={url} alt={title} className="w-full h-40 object-cover" />

      <h2>{title}</h2>
      <p>R$ {price}</p>

      <button
        onClick={() => onDelete(id)}
        className="bg-red-500 text-white p-1 m-1"
      >
        Delete
      </button>

      <a
        href={url}
        download
        className="bg-blue-500 text-white p-1 m-1 block text-center"
      >
        Download
      </a>

      <button
        onClick={() => onBuy(id, price)}
        className="bg-green-500 text-white p-1 m-1"
      >
        Comprar Pix
      </button>
    </div>
  );
};
