// pages/upload.tsx
import { useState } from 'react';
import { supabase } from '../supabaseClient';

export default function Upload() {
  const [file, setFile] = useState<File | null>(null);

  const handleUpload = async () => {
    if (!file) return;
    const fileName = `arts/${Date.now()}-${file.name}`;
    await supabase.storage.from('arts').upload(fileName, file);
    await supabase.from('arts').insert([{ image: fileName, price: 0 }]);
    alert('Upload concluído!');
  };

  return (
    <div>
      <input type="file" onChange={(e) => setFile(e.target.files![0])} />
      <button onClick={handleUpload}>Upload</button>
    </div>
  );
}
