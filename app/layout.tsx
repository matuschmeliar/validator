import "./globals.css";
import type { Metadata } from "next";
import { GeistSans } from "geist/font/sans";

export const metadata: Metadata = {
  title: "Idea Validator",
  description: "Validuj vizionárske idey proti 6-osému rubricu.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="sk" className={GeistSans.className}>
      <body>{children}</body>
    </html>
  );
}
