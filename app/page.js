"use client";
import { useState } from "react";

export default function Home() {
  const [spinning, setSpinning] = useState(false);
  const [result, setResult] = useState(null);

  const prizes = ["🐳 Whale Win!", "💀 Lose", "💰 2x Coin", "🔥 Rugged", "🌊 Whale Splash!"];

  const spinWheel = () => {
    if (spinning) return;
    setSpinning(true);
    setResult(null);

    const wheel = document.getElementById("wheel");
    const randomDeg = 720 + Math.floor(Math.random() * 360);
    wheel.style.transform = `rotate(${randomDeg}deg)`;

    setTimeout(() => {
      const prize = prizes[Math.floor(Math.random() * prizes.length)];
      setResult(prize);
      setSpinning(false);
    }, 4000);
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-6 text-center bg-gradient-to-r from-purple-800 via-black to-blue-900 text-white">
      <h1 className="text-5xl font-bold mb-6 drop-shadow-lg">🐳 Spin the Whale</h1>
      <p className="mb-8 text-lg text-gray-300">Try your luck and see if the whale blesses you.</p>

      {/* Wheel */}
      <div className="relative w-64 h-64 mb-8">
        <div
          id="wheel"
          className="absolute w-full h-full rounded-full border-[10px] border-yellow-400 flex items-center justify-center text-2xl font-bold transition-transform duration-[4000ms] ease-out bg-gradient-to-tr from-blue-400 via-pink-400 to-purple-500"
        >
          🎰
        </div>
        <div className="absolute top-[-20px] left-1/2 transform -translate-x-1/2 text-3xl">🔻</div>
      </div>

      <button
        onClick={spinWheel}
        disabled={spinning}
        className={`px-8 py-4 rounded-2xl shadow-lg font-bold text-xl ${
          spinning ? "bg-gray-600 cursor-not-allowed" : "bg-green-600 hover:bg-green-700"
        }`}
      >
        {spinning ? "Spinning..." : "Spin Now"}
      </button>

      {result && (
        <div className="mt-8 text-3xl font-extrabold animate-bounce">{result}</div>
      )}

      {/* Footer */}
      <footer className="mt-16 space-x-6 text-gray-400">
        <a href="https://x.com" target="_blank" className="hover:text-white">🐦 Twitter</a>
        <a href="https://t.me" target="_blank" className="hover:text-white">💬 Telegram</a>
        <a href="https://pump.fun" target="_blank" className="hover:text-white">🚀 Pump.fun</a>
      </footer>
    </main>
  );
}
