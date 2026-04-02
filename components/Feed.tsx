import React from "react";
import { ArtCard } from "./ArtCard";

type Art = {
  id: string;
  title: string;
  url: string;
  price: number;
};

type FeedProps = {
  arts: Art[];
  onDelete: (id: string) => void;
  onBuy: (id: string, price: number) => void;
};

export const Feed: React.FC<FeedProps> = ({
  arts,
  onDelete,
  onBuy,
}) => {
  return (
    <div className="flex flex-wrap">
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
};
