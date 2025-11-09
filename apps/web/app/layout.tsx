import './globals.css';
import type { Metadata } from 'next';
import Link from 'next/link';
import I18nProvider from './i18n-provider';
import LanguageSwitcher from '../components/LanguageSwitcher';

export const metadata: Metadata = {
  title: 'Humana AI Avatar',
  description: 'AI avatar chatbot for human rights',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <I18nProvider>
        <div className="min-h-screen flex flex-col">
          <header className="w-full sticky top-0 z-30 glass border-b border-white/10">
            <nav className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
              <Link href="/" className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-brand-500" />
                <span className="font-semibold text-white">Humana</span>
              </Link>
              <div className="flex items-center gap-3 text-sm">
                <LanguageSwitcher />
                <Link href="/about" className="btn btn-secondary">About</Link>
                <Link href="/login" className="btn btn-primary">Login</Link>
              </div>
            </nav>
          </header>
          <main className="flex-1">{children}</main>
          <footer className="py-8 text-center text-white/60 text-sm">
            © {new Date().getFullYear()} Humana
          </footer>
        </div>
        </I18nProvider>
      </body>
    </html>
  );
}
