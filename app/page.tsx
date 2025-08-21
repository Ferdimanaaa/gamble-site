"use client";
import { useState } from "react";
import { Wheel } from "react-custom-roulette";

const data = [
  { option: "100 $MEME 🎉" },
  { option: "Meme NFT 🤯" },
  { option: "Try Again 😂" },
  { option: "50 $MEME 💰" },
  { option: "Golden Ticket 🎟️" },
  { option: "Zonk ❌" },
];

export default function Home() {
  const [mustSpin, setMustSpin] = useState(false);
  const [prizeNumber, setPrizeNumber] = useState(0);

  const handleSpinClick = () => {
    if (!mustSpin) {
      const newPrizeNumber = Math.floor(Math.random() * data.length);
      setPrizeNumber(newPrizeNumber);
      setMustSpin(true);
    }
  };

  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-6 text-center">
      <h1 className="text-4xl font-bold mb-6">🎰 Spin the Meme Wheel!</h1>

      <Wheel
        mustStartSpinning={mustSpin}
        prizeNumber={prizeNumber}
        data={data}
        backgroundColors={["#4ade80", "#f87171", "#60a5fa", "#facc15"]}
        textColors={["#000"]}
        onStopSpinning={() => setMustSpin(false)}
      />

      <button
        onClick={handleSpinClick}
        className="mt-8 px-6 py-3 bg-green-600 rounded-xl shadow-lg hover:bg-green-700 transition"
      >
        Spin Now!
      </button>

      {!mustSpin && prizeNumber !== null && (
        <p className="mt-4 text-lg">You won: {data[prizeNumber].option}</p>
      )}
    </main>
  );
}
