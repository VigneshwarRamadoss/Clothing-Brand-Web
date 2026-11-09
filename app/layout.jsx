import "./globals.css";

export const metadata = {
  title: "ASTRA — Made to be worn",
  description: "ASTRA Drop 001. Three everyday caps. Less noise. More you.",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
