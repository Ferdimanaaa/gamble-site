"use client";
import { useEffect, useRef, useState } from "react";

export default function Home() {
  // ====== STATE ======
  const prizes = [
    "🐳 Whale Win!",
    "💰 2x Coin",
    "🍀 Lucky",
    "❌ Lose",
    "🌊 Whale Splash!",
    "💀 Rug? LOL",
    "🎟️ Golden Ticket",
    "😅 Try Again",
  ];
  const slice = 360 / prizes.length;

  const [spinning, setSpinning] = useState(false);
  const [winner, setWinner] = useState(null); // index
  const wheelRef = useRef(null);
  const particlesRef = useRef(null);

  // ====== SIMPLE PARTICLES CANVAS ======
  useEffect(() => {
    const canvas = particlesRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);

    const onResize = () => {
      w = canvas.width = window.innerWidth;
      h = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", onResize);

    const dots = Array.from({ length: 60 }).map(() => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 2 + 0.5,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      alpha: Math.random() * 0.5 + 0.2,
    }));

    let raf;
    const loop = () => {
      ctx.clearRect(0, 0, w, h);
      dots.forEach((d) => {
        d.x += d.vx;
        d.y += d.vy;
        if (d.x < 0 || d.x > w) d.vx *= -1;
        if (d.y < 0 || d.y > h) d.vy *= -1;
        ctx.globalAlpha = d.alpha;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fillStyle = "#93c5fd"; // soft blue
        ctx.fill();
      });
      raf = requestAnimationFrame(loop);
    };
    loop();

    return () => {
      window.removeEventListener("resize", onResize);
      cancelAnimationFrame(raf);
    };
  }, []);

  // ====== AUDIO (Web Audio, tanpa file eksternal) ======
  const audioCtxRef = useRef(null);
  const ensureAudio = () => {
    if (!audioCtxRef.current) {
      const ctx = new (window.AudioContext || window.webkitAudioContext)();
      audioCtxRef.current = ctx;
    }
    return audioCtxRef.current;
  };

  const playSpinSound = () => {
    const ctx = ensureAudio();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(220, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(660, ctx.currentTime + 0.3);
    gain.gain.setValueAtTime(0.0001, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.2, ctx.currentTime + 0.05);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.6);
    osc.connect(gain).connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.65);
  };

  const playWinSound = () => {
    const ctx = ensureAudio();
    // koin jatuh: dua bip cepat
    const beep = (t0, f) => {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = "sine";
      o.frequency.setValueAtTime(f, t0);
      g.gain.setValueAtTime(0.0001, t0);
      g.gain.exponentialRampToValueAtTime(0.25, t0 + 0.03);
      g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.2);
      o.connect(g).connect(ctx.destination);
      o.start(t0);
      o.stop(t0 + 0.22);
    };
    const now = ctx.currentTime;
    beep(now, 880);
    beep(now + 0.15, 1320);
  };

  const playLoseSound = () => {
    const ctx = ensureAudio();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = "sawtooth";
    o.frequency.setValueAtTime(440, ctx.currentTime);
    o.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + 0.35);
    g.gain.setValueAtTime(0.2, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.35);
    o.connect(g).connect(ctx.destination);
    o.start();
    o.stop(ctx.currentTime + 0.36);
  };

  // ====== SPIN LOGIC ======
  const spin = () => {
    if (spinning) return;

    // start
    setSpinning(true);
    setWinner(null);
    playSpinSound();

    // pilih pemenang (index)
    const winIndex = Math.floor(Math.random() * prizes.length);

    // hitung rotasi supaya pointer di atas jatuh ke tengah slice pemenang
    const fullTurns = 6; // putaran penuh biar dramatis
    const targetDeg = 360 * fullTurns + (360 - (winIndex * slice + slice / 2));

    const el = wheelRef.current;
    el.style.transition = "transform 4s cubic-bezier(0.23, 1, 0.32, 1)";
    el.style.transform = `rotate(${targetDeg}deg)`;

    // selesai putar
    setTimeout(() => {
      setSpinning(false);
      setWinner(winIndex);
      // reset transform supaya rotasi tidak akumulatif
      el.style.transition = "none";
      const normalized = targetDeg % 360;
      el.style.transform = `rotate(${normalized}deg)`;

      // sound result
      if (["🐳 Whale Win!", "💰 2x Coin", "🌊 Whale Splash!", "🎟️ Golden Ticket"].includes(prizes[winIndex])) {
        playWinSound();
      } else {
        playLoseSound();
      }
    }, 4000);
  };

  const resultLabel = winner !== null ? prizes[winner] : null;
  const isWin =
    winner !== null &&
    ["🐳 Whale Win!", "💰 2x Coin", "🌊 Whale Splash!", "🎟️ Golden Ticket"].includes(prizes[winner]);

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Particles BG */}
      <canvas
        ref={particlesRef}
        className="pointer-events-none fixed inset-0 opacity-25"
      />

      <main className="relative z-10 flex flex-col items-center justify-center min-h-screen p-6 text-center">
        <h1 className="text-4xl md:text-5xl font-extrabold mb-2 drop-shadow-lg">
          🐳 Spin the Whale
        </h1>
        <p className="mb-8 text-base md:text-lg text-white/80">
          Try your luck — may the whale bless your bags.
        </p>

        {/* Wheel Zone */}
        <div className="relative mb-8">
          {/* Pointer */}
          <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-3xl drop-shadow">
            🔻
          </div>

          {/* Wheel */}
          <div
            ref={wheelRef}
            id="wheel"
            className="wheel shadow-2xl w-72 h-72 md:w-80 md:h-80 rounded-full border-[10px] border-yellow-400"
          />

          {/* Wheel hub */}
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-yellow-300 shadow-inner" />
          </div>
        </div>

        {/* Controls */}
        <button
          onClick={spin}
          disabled={spinning}
          className={`px-6 md:px-8 py-3 md:py-4 rounded-2xl font-bold text-lg md:text-xl transition
            ${spinning ? "bg-gray-600 cursor-not-allowed" : "bg-emerald-500 hover:bg-emerald-600"}
            shadow-[0_0_25px_rgba(16,185,129,0.5)]`}
        >
          {spinning ? "Spinning..." : "Spin Now 🎰"}
        </button>

        {/* Result + Whale mascot */}
        <div className="h-28 md:h-32 mt-6 md:mt-8 flex flex-col items-center justify-center">
          {resultLabel && (
            <>
              <div className="text-2xl md:text-3xl font-extrabold mb-3 animate-in fade-in zoom-in duration-300">
                {resultLabel}
              </div>

              {/* Whale mascot */}
              <div
                className={`text-[56px] md:text-[72px] ${
                  isWin ? "animate-whale-pop" : "animate-whale-shake"
                }`}
                aria-hidden
              >
                🐳
              </div>
            </>
          )}
        </div>

        {/* Social Links */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3 md:gap-4">
          <a
            href="https://x.com"
            target="_blank"
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 transition"
          >
            🐦 X (Twitter)
          </a>
          <a
            href="https://t.me"
            target="_blank"
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 transition"
          >
            💬 Telegram
          </a>
          <a
            href="https://pump.fun"
            target="_blank"
            className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 transition"
          >
            🚀 Pump.fun
          </a>
        </div>
      </main>
    </div>
  );
}
