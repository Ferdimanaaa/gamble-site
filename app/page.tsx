export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen p-6 text-center">
      <h1 className="text-4xl font-bold mb-4">🎰 Gamble Site</h1>
      <p className="mb-6 text-lg text-gray-300">
        Welcome to your gambling-style landing page.
      </p>

      <a
        href="#play"
        className="px-6 py-3 bg-green-600 rounded-xl shadow-lg hover:bg-green-700 transition"
      >
        Start Playing
      </a>

      <div id="play" className="mt-10 p-6 bg-gray-800 rounded-xl shadow-md">
        <h2 className="text-2xl font-semibold mb-4">Mini Blackjack</h2>
        <p className="text-gray-400">Coming soon...</p>
      </div>
    </main>
  );
}
