import "./globals.css";

export const metadata = {
  title: "ASTRA — Built for the late shift",
  description: "ASTRA Drop 001. Three everyday caps for people who move after dark. Wear it out.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
