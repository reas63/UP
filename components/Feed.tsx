"use client";

import { useEffect, useState } from "react";
import { getArts } from "@/services/arts";
import ArtCard from "./ArtCard";

export default function Feed() {
  const [arts, setArts] = useState<any[]>([]);

  useEffect(() => {
    getArts().then(setArts);
  }, []);

  return (
    <div className="space-y-6">
      {arts.map((art) => (
        <ArtCard key={art.id} art={art} />
      ))}
    </div>
  );
}
