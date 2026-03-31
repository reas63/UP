import "./globals.css";

export const metadata = {
  title: "UP",
  description: "UP - Digital Art Marketplace"
};

export default function RootLayout({ children }: any) {
  return (
    <html lang="pt-br">
      <body>{children}</body>
    </html>
  );
}
