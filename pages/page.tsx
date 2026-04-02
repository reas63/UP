// pages/page.tsx
import { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';

type Art = { id: number; image: string; price: number; created_at: string };

export default function Page() {
  const [arts, setArts] = useState<Art[]>([]);

  const fetchArts = async () => {
    const { data } = await supabase.from('arts').select('*').order('created_at', { ascending: false });
    if (data) setArts(data);
  };

  const deleteArt = async (id: number) => {
    await supabase.from('arts').delete().eq('id', id);
    fetchArts();
  };

  useEffect(() => { fetchArts(); }, []);

  return (
    <div className="feed">
      {arts.map((art) => (
        <div key={art.id} className="art-card">
          <img src={`https://YOUR_SUPABASE_BUCKET_URL/${art.image}`} alt="Arte" />
          <div className="price">
            R$ <input type="number" defaultValue={art.price} onBlur={async (e) => {
              await supabase.from('arts').update({ price: Number(e.target.value) }).eq('id', art.id);
            }} />
          </div>
          <button onClick={() => deleteArt(art.id)}>Delete</button>
          <a href={`https://YOUR_SUPABASE_BUCKET_URL/${art.image}`} download>Download</a>
        </div>
      ))}
    </div>
  );
}
