import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Quizzou - Ne lisez plus. Maîtrisez.",
  description: "Transformez instantanément n'importe quel cours en quiz interactif.",
  icons: {
    icon: "/logo.png",
    apple: "/logo.png",
  },
  openGraph: {
    title: "Quizzou - Ne lisez plus. Maîtrisez.",
    description: "Transformez instantanément n'importe quel cours en quiz interactif.",
    url: "https://quizzou.vercel.app",
    siteName: "Quizzou",
    images: [
      {
        url: "/quizzou.jpeg", // Must be an absolute URL in production, but root relative works for Vercel
        width: 1200,
        height: 630,
        alt: "Quizzou Logo",
      },
    ],
    locale: "fr_FR",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr" className="light" suppressHydrationWarning>
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className={`${inter.variable} bg-white font-display text-black antialiased`}>
        {children}
      </body>
    </html>
  );
}
