import "./globals.css";
import Link from "next/link";
import type { Metadata } from "next";
import { readSessionEmail } from "@/lib/auth";
import { LogoutButton } from "@/components/LogoutButton";

export const metadata: Metadata = {
  title: "Idea Validator",
  description: "Validuj vizionárske idey proti 6-osému rubricu.",
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const email = await readSessionEmail();
  return (
    <html lang="sk">
      <body className="font-sans">
        <header className="border-b border-[var(--border)] px-6 py-3 flex items-center justify-between">
          <nav className="flex items-center gap-6 text-sm">
            <Link href="/" className="font-semibold">Idea Validator</Link>
            <Link href="/" className="text-[var(--muted)] hover:text-white">Idey</Link>
            <Link href="/reports" className="text-[var(--muted)] hover:text-white">Reporty</Link>
            <Link href="/ideas/new" className="text-[var(--accent)]">+ Pridať</Link>
          </nav>
          <div className="flex items-center gap-3 text-xs text-[var(--muted)]">
            {email && <span>{email}</span>}
            {email && <LogoutButton />}
          </div>
        </header>
        <main className="max-w-5xl mx-auto px-6 py-8">{children}</main>
      </body>
    </html>
  );
}
