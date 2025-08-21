"use client";
import { useEffect, useRef, useState } from "react";

export default function Home() {
  // ====== PRIZES & STATE ======
  const prizes = [
    "🐳 Whale Win!",
    "💰 2x Coin",
    "🍀 Lucky",
    "❌ Lose",
    "🌊 Splash!",
    "💀 Rug? lol",
    "🎟️ Golden",
    "😅 Try Again",
  ];
  const slice = 360 / prizes.length;

  const [spinning, setSpinning] = useState(false);
  const [winner, setWinner] = useState(null); // index result
  const wheelRef = useRef(null);
  const particlesRef = useRef(null);

  // ====== PARTICLE BACKGROUND (Canvas, ringan) ======
  useEffect(() => {
    const canvas = particlesRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);

    const onResize = () => {
      w = (canvas.width = window.innerWidth);
      h = (canvas.height = window.innerHeight);
    };
    window.addEventListener("resize", onResize);

    const dots = Array.from({ length: 80 }).map(() => ({
      x: Math.random() * w,
      y: Math.random() * h,
      r: Math.random() * 2 + 0.7,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      a: Math.random() * 0.35 + 0.15,
    }));

    let raf;
    const loop = () => {
      ctx.clearRect(0, 0, w, h);
      dots.forEach((d) => {
        d.x += d.vx;
        d.y += d.vy;
        if (d.x < 0 || d.x > w) d.vx *= -1;
        if (d.y < 0 || d.y > h) d.vy *= -1;
        ctx.globalAlpha = d.a;
        ctx.beginPath();
        ctx.arc(d.x, d.y, d.r, 0, Math.PI * 2);
        ctx.fillStyle = "#93c5fd";
        ctx.fill();
      });
      raf = requestAnimationFrame(loop);
    };
    loop();

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  // ====== AUDIO FX (WebAudio, tanpa file) ======
  const audioCtxRef = useRef(null);
  const ensureAudio = () => {
    if (!audioCtxRef.current) {
      const Ctx = window.AudioContext || window.webkitAudioContext;
      audioCtxRef.current = new Ctx();
    }
    return audioCtxRef.current;
  };

  const sfxSpin = () => {
    const ctx = ensureAudio();
    const osc = ctx.createOscillator();
    const g = ctx.createGain();
    osc.type = "triangle";
    osc.frequency.setValueAtTime(200, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(600, ctx.currentTime + 0.35);
    g.gain.setValueAtTime(0.0001, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.2, ctx.currentTime + 0.05);
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.6);
    osc.connect(g).connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + 0.62);
  };

  const sfxWin = () => {
    const ctx = ensureAudio();
    const now = ctx.currentTime;
    const ping = (t, f) => {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = "sine";
      o.frequency.setValueAtTime(f, t);
      g.gain.setValueAtTime(0.0001, t);
      g.gain.exponentialRampToValueAtTime(0.22, t + 0.03);
      g.gain.exponentialRampToValueAtTime(0.0001, t + 0.22);
      o.connect(g).connect(ctx.destination);
      o.start(t);
      o.stop(t + 0.24);
    };
    ping(now, 880);
    ping(now + 0.14, 1320);
    ping(now + 0.28, 1760);
  };

  const sfxLose = () => {
    const ctx = ensureAudio();
    const o = ctx.createOscillator();
    const g = ctx.createGain();
    o.type = "sawtooth";
    o.frequency.setValueAtTime(440, ctx.currentTime);
    o.frequency.exponentialRampToValueAtTime(120, ctx.currentTime + 0.35);
    g.gain.setValueAtTime(0.15, ctx.currentTime);
    g.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.35);
    o.connect(g).connect(ctx.destination);
    o.start();
    o.stop(ctx.currentTime + 0.36);
  };

  // ====== SPIN LOGIC ======
  const isWinningLabel = (label) =>
    ["🐳 Whale Win!", "💰 2x Coin", "🌊 Splash!", "🎟️ Golden"].includes(label);

  const spin = () => {
    if (spinning) return;
    setSpinning(true);
    setWinner(null);
    sfxSpin();

    // pilih hasil
    const winIndex = Math.floor(Math.random() * prizes.length);

    // target derajat: beberapa putaran + posisi tengah slice pemenang di bawah pointer (atas)
    const fullTurns = 6;
    const targetDeg = 360 * fullTurns + (360 - (winIndex * slice + slice / 2));

    const el = wheelRef.current;
    el.style.transition = "transform 4s cubic-bezier(0.2, 0.9, 0.1, 1)";
    el.style.transform = `rotate(${targetDeg}deg)`;

    setTimeout(() => {
      setSpinning(false);
      setWinner(winIndex);

      // reset supaya tidak akumulatif
      const normalized = targetDeg % 360;
      el.style.transition = "none";
      el.style.transform = `rotate(${normalized}deg)`;

      // SFX hasil
      if (isWinningLabel(prizes[winIndex])) sfxWin();
      else sfxLose();
    }, 4000);
  };

  const isWin =
    winner !== null && isWinningLabel(prizes[winner]);

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* particles */}
      <canvas ref={particlesRef} className="fixed inset-0 pointer-events-none opacity-25" />

      {/* gradient overlay */}
      <div className="fixed inset-0 bg-gradient-to-br from-indigo-900/50 via-fuchsia-900/30 to-cyan-900/50" />

      <header className="relative z-10 flex items-center justify-between px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="text-3xl">🐳</div>
          <div className="font-extrabold tracking-wide text-white/90">
            WHALE<span className="text-emerald-400">SPIN</span>
          </div>
        </div>
        <div className="flex items-center gap-2 text-sm">
          <a className="badge" href="https://x.com" target="_blank">🐦 X</a>
          <a className="badge" href="https://t.me" target="_blank">💬 TG</a>
          <a className="badge" href="https://pump.fun" target="_blank">🚀 Pump</a>
          <a className="badge" href="https://dexscreener.com" target="_blank">📈 Dex</a>
        </div>
      </header>

      <main className="relative z-10 flex flex-col items-center justify-center px-6 pb-16 text-center">
        <h1 className="mt-4 text-4xl md:text-6xl font-extrabold drop-shadow-lg">
          Spin the <span className="text-emerald-400">Whale</span>
        </h1>
        <p className="mt-2 text-white/80">Arcade of fortune for degens & dreamers.</p>

        {/* Stage */}
        <div className="mt-10 flex flex-col md:flex-row items-center gap-10">
          {/* Wheel Area */}
          <div className="relative">
            {/* Pointer */}
            <div className="absolute -top-6 left-1/2 -translate-x-1/2 text-3xl drop-shadow-md">🔻</div>

            {/* Wheel */}
            <div
              ref={wheelRef}
              id="wheel"
              className="wheel neon-border w-72 h-72 md:w-[22rem] md:h-[22rem] rounded-full relative overflow-hidden"
              aria-label="Spin wheel"
              role="img"
            >
              {/* Shine */}
              <div className="absolute inset-0 rounded-full wheel-shine pointer-events-none" />
              {/* Labels (ring luar, mengikuti urutan slice) */}
              {prizes.map((label, i) => {
                const angle = i * slice + slice / 2;
                return (
                  <div
                    key={i}
                    className="absolute top-1/2 left-1/2 text-[11px] md:text-xs font-bold text-black/80"
                    style={{
                      transform: `rotate(${angle}deg) translate(7.5rem) rotate(${-angle}deg)`,
                    }}
                  >
                    {label}
                  </div>
                );
              })}
            </div>

            {/* Hub */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-12 h-12 md:w-14 md:h-14 rounded-full bg-yellow-300 shadow-inner border border-yellow-200" />
            </div>
          </div>

          {/* Panel */}
          <div className="w-full max-w-sm rounded-2xl bg-white/5 backdrop-blur p-5 border border-white/10 shadow-lg">
            <h2 className="text-xl font-bold">How to Play</h2>
            <ol className="mt-2 text-left text-sm text-white/80 list-decimal list-inside space-y-1">
              <li>Tap <b>Spin</b> and let the whale decide.</li>
              <li>Win labels glow, lose labels wobble.</li>
              <li>Share your luck on X / TG!</li>
            </ol>

            <button
              onClick={spin}
              disabled={spinning}
              className={`btn-primary w-full mt-5 ${
                spinning ? "opacity-60 cursor-not-allowed" : ""
              }`}
            >
              {spinning ? "Spinning..." : "Spin Now 🎰"}
            </button>

            {/* Result */}
            <div className="mt-5 min-h-[88px] flex flex-col items-center justify-center">
              {winner !== null && (
                <>
                  <div
                    className={`text-2xl md:text-3xl font-extrabold mb-2 ${
                      isWin ? "text-emerald-300 drop-shadow-[0_0_12px_rgba(16,185,129,0.6)]" : "text-rose-300"
                    }`}
                  >
                    {prizes[winner]}
                  </div>

                  {/* Whale mascot */}
                  <div
                    className={`text-[64px] md:text-[80px] select-none ${
                      isWin ? "animate-whale-pop" : "animate-whale-shake"
                    }`}
                    aria-hidden
                  >
                    🐳
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Social row */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-3">
          <a href="https://x.com" target="_blank" className="social">🐦 X / Twitter</a>
          <a href="https://t.me" target="_blank" className="social">💬 Telegram</a>
          <a href="https://pump.fun" target="_blank" className="social">🚀 Pump.fun</a>
          <a href="https://dexscreener.com" target="_blank" className="social">📈 Dexscreener</a>
        </div>
      </main>

      <footer className="relative z-10 py-8 text-center text-xs text-white/60">
        © {new Date().getFullYear()} WhaleSpin — for fun only.
      </footer>
    </div>
  );
}
