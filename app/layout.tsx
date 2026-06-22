import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Club Mercalito",
  description: "Clientes, sucursales y campañas de WhatsApp para Club Mercalito."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  );
}
