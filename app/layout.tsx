import "../styles/globals.css";

export const metadata = {
  title: "Gamble Site",
  description: "Landing page with Tailwind + Next.js",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
