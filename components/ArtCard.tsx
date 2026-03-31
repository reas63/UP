"use client";

export default function ArtCard({ art }: any) {

  async function buyStripe() {
    const res = await fetch("/api/checkout", {
      method: "POST",
      body: JSON.stringify({
        title: art.title,
        price: art.price
      })
    });

    const data = await res.json();
    window.location.href = data.url;
  }

  async function buyPix() {
    const res = await fetch("/api/pix", {
      method: "POST",
      body: JSON.stringify({ price: art.price })
    });

    const data = await res.json();
    alert("Pix: " + data.qrCode);
  }

  return (
    <div className="bg-white shadow-lg rounded-xl p-4">

      <img src={art.image} className="rounded-lg mb-4"/>

      <h2 className="text-xl font-bold">{art.title}</h2>

      <p className="text-sm">{art.description}</p>

      <p className="text-red-500 font-bold text-lg mt-2">
        R$ {art.price}
      </p>

      <div className="mt-4 space-y-2">
        <button
          className="bg-blue-500 text-white w-full py-2 rounded"
          onClick={buyStripe}
        >
          Comprar com Cartão
        </button>

        <button
          className="bg-green-500 text-white w-full py-2 rounded"
          onClick={buyPix}
        >
          Comprar com Pix
        </button>
      </div>

    </div>
  );
}
