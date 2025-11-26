import type { Metadata } from "next";
import { Inter } from "next/font/google"; // Using a professional font
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: {
    template: '%s | ABC Informatique',
    default: 'ABC Informatique - Leader du Matériel High-Tech en Algérie',
  },
  description: "Vente de PC Gamers, Smartphones, et accessoires informatiques. Livraison rapide sur 58 wilayas.",
  keywords: ["Informatique", "Algérie", "PC Gamer", "MacBook", "Tech", "Vente en ligne"],
  authors: [{ name: "ABC Informatique" }],
  icons: {
    icon: '/favicon.ico',
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className={`${inter.className} bg-slate-50 text-slate-900 antialiased`}>
        {children}
      </body>
    </html>
  );
}