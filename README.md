🚀 UPBlog

Plataforma moderna para criação, venda e compartilhamento de artes digitais com inteligência artificial.

---

🌟 Funcionalidades

- 🎨 Geração de imagens com IA (Gemini)
- 🛒 Venda de artes digitais
- 💰 Pagamentos via Pix
- 📸 Feed de artes públicas
- 👤 Sistema de usuários
- ⚡ Deploy automático com Vercel
- 🗄️ Banco de dados com Supabase

---

🛠️ Tecnologias

- Next.js 14 (App Router)
- React 18
- Supabase
- API Gemini (Google AI)
- Vercel

---

📁 Estrutura do Projeto

app/
 ├── page.tsx
 ├── layout.tsx
 ├── studio/
 │    └── page.tsx
 ├── login/
 │    └── page.tsx

lib/
 └── supabaseClient.ts

public/
 ├── icon.png
 └── manifest.json

---

⚙️ Configuração

1. Variáveis de Ambiente

Adicione no Vercel:

NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=

---

2. Instalar dependências

npm install

---

3. Rodar local

npm run dev

---

🚀 Deploy

O projeto está configurado para deploy automático na Vercel.

A cada commit no GitHub, o deploy será atualizado automaticamente.

---

📌 Observações Importantes

- NÃO usar "pages/" (usar apenas "app/")
- APIs devem ficar em "app/api/"
- Imagens devem ficar em "public/"
- Sempre fazer commit após alterações

---

👨‍💻 Autor

Projeto criado por Ricardo Elias

---

🔥 Status

🟡 Em desenvolvimento
🚀 Em breve versão completa com IA + vendas reais
