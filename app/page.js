"use client";
import { useState } from "react";

export default function Home() {
  const [result, setResult] = useState(null);
  const items = ["🐋 Whale", "💰 Jackpot", "🍀 Lucky", "❌ Lose"];

  const spinWheel = () => {
    const randomItem = items[Math.floor(Math.random() * items.length)];
    setResult(randomItem);
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-6 text-center">
      <h1 className="text-4xl font-bold mb-4">🐋 Spin the Whale</h1>
      <p className="mb-6 text-lg text-gray-300">
        A fun spin game for your memecoin site.
      </p>

      <button
        onClick={spinWheel}
        className="px-6 py-3 bg-blue-600 rounded-xl shadow-lg hover:bg-blue-700 transition"
      >
        Spin Now 🎰
      </button>

      {result && (
        <div className="mt-8 p-6 bg-gray-800 rounded-xl shadow-md">
          <h2 className="text-2xl font-semibold mb-4">Result:</h2>
          <p className="text-3xl">{result}</p>
        </div>
      )}
    </main>
  );
}
