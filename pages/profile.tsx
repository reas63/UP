// pages/profile.tsx
import { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';

type User = { id: string };

export default function Profile({ user }: { user: User }) {
  const [bio, setBio] = useState('');
  const [avatar, setAvatar] = useState<string | null>(null);

  const fetchProfile = async () => {
    const { data } = await supabase.from('profiles').select('*').eq('id', user.id).single();
    if (data) {
      setBio(data.bio);
      setAvatar(data.avatar_url);
    }
  };

  const updateProfile = async () => {
    await supabase.from('profiles').update({ bio, avatar_url: avatar }).eq('id', user.id);
    alert('Perfil atualizado!');
  };

  useEffect(() => { fetchProfile(); }, []);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const file = e.target.files[0];
    const fileName = `avatars/${user.id}-${Date.now()}`;
    await supabase.storage.from('avatars').upload(fileName, file);
    setAvatar(`https://YOUR_SUPABASE_BUCKET_URL/${fileName}`);
  };

  return (
    <div>
      <img src={avatar || '/default-avatar.png'} alt="Avatar" width={100} />
      <input type="file" onChange={handleFileChange} />
      <textarea value={bio} onChange={(e) => setBio(e.target.value)} />
      <button onClick={updateProfile}>Salvar</button>
    </div>
  );
}
