import React from "react";
import ArtCard from "./ArtCard";

type Art = {
  id: string;
  title: string;
  url: string;
  price: number;
};

type Props = {
  arts: Art[];
  onDelete: (id: string) => void;
  onBuy: (price: number) => void;
};

export default function Feed({ arts, onDelete, onBuy }: Props) {
  return (
    <div>
      {arts.map((art) => (
        <ArtCard
          key={art.id}
          id={art.id}
          title={art.title}
          url={art.url}
          price={art.price}
          onDelete={onDelete}
          onBuy={onBuy}
        />
      ))}
    </div>
  );
}
