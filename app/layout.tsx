import "./globals.css";

export const metadata = {
  title: "Spin Wheel MemeCoin",
  description: "Fun spin game for MemeCoin fans 🚀",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-gray-900 text-white">{children}</body>
    </html>
  );
}
