import localFont from "next/font/local";
import { Archivo, Inter } from "next/font/google";
import "./globals.css";

const anton = localFont({
  src: "./fonts/anton.woff2",
  variable: "--font-anton",
  display: "swap",
  adjustFontFallback: false,
});

const archivo = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--font-archivo",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
  axes: ["opsz"],
});

export const metadata = {
  title: "ASTRA — Built for the late shift",
  description: "ASTRA Drop 001. Three everyday caps for people who move after dark. Wear it out.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${anton.variable} ${archivo.variable} ${inter.variable}`} suppressHydrationWarning>
      <body suppressHydrationWarning>{children}</body>
    </html>
  );
}
