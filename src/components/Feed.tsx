import React from "react";
import { ArtCard } from "./ArtCard";

type Art = {
  id: string;
  title: string;
  imageUrl: string;
  price: number;
};

type FeedProps = {
  arts: Art[];
  onDelete: (id: string) => void;
  onBuy: (id: string, price: number) => void;
};

export const Feed: React.FC<FeedProps> = ({ arts, onDelete, onBuy }) => (
  <div className="flex flex-wrap overflow-y-auto max-h-screen">
    {arts.map((art) => (
      <ArtCard key={art.id} {...art} onDelete={onDelete} onBuy={onBuy} />
    ))}
  </div>
);
