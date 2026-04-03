import Link from "next/link"

export default function Home() {
  return (
    <main style={{ padding: 20 }}>
      <h1>🚀 UPBlog</h1>

      <p>Plataforma de vendas digitais com IA</p>

      <div style={{ marginTop: 20 }}>
        <Link href="/studio">
          <button>Ir para Studio</button>
        </Link>
      </div>

      <div style={{ marginTop: 10 }}>
        <Link href="/login">
          <button>Login</button>
        </Link>
      </div>
    </main>
  )
}
