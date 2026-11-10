import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap", axes: ["opsz"] });

export const metadata = {
  title: "ASTRA — Built for the late shift",
  description: "ASTRA Drop 001. Three everyday caps for people who move after dark. Wear it out.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={inter.variable}>
      <body>{children}</body>
    </html>
  );
}
