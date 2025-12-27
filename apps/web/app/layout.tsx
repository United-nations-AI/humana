import './globals.css';
import type { Metadata } from 'next';
import Link from 'next/link';
import I18nProvider from './i18n-provider';
import LanguageSwitcher from '../components/LanguageSwitcher';

export const metadata: Metadata = {
  title: 'AIHRP - Artificial Intelligence for Human Rights Advocacy',
  description: 'Transformative platform empowering Human Rights organizations and advocates worldwide through cutting-edge AI technology',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <I18nProvider>
        <div className="min-h-screen flex flex-col">
          <header className="w-full sticky top-0 z-30 glass border-b border-white/10">
            <nav className="max-w-6xl mx-auto px-4 py-4 flex items-center justify-between">
              <Link href="/" className="flex items-center gap-3 group">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rights-primary to-rights-accent flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                  <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-white text-lg leading-none">AIHRP</span>
                  <span className="text-xs text-white/60 leading-none">Human Rights AI</span>
                </div>
              </Link>
              <div className="flex items-center gap-3 text-sm">
                <LanguageSwitcher />
                <Link href="/about" className="btn btn-secondary">About</Link>
                <Link href="/login" className="btn btn-primary">Login</Link>
              </div>
            </nav>
          </header>
          <main className="flex-1">{children}</main>
          <footer className="py-10 text-center border-t border-white/10 mt-auto">
            <div className="max-w-6xl mx-auto px-4">
              <div className="flex flex-col md:flex-row items-center justify-center gap-4 mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded bg-gradient-to-br from-rights-primary to-rights-accent"></div>
                  <span className="font-semibold text-white">AIHRP</span>
                </div>
                <span className="text-white/40">•</span>
                <span className="text-white/80 text-sm">Artificial Intelligence for Human Rights Advocacy and Analysis Program</span>
              </div>
              <p className="text-white/60 text-sm mb-4">
                Empowering advocates worldwide through cutting-edge AI technology
              </p>
              <div className="flex items-center justify-center gap-6 text-sm">
                <Link href="/terms" className="text-white/60 hover:text-rights-primary-light underline transition-colors">
                  Terms & Conditions
                </Link>
                <Link href="/about" className="text-white/60 hover:text-rights-primary-light underline transition-colors">
                  About
                </Link>
              </div>
              <p className="text-white/40 text-xs mt-6">
                © {new Date().getFullYear()} AIHRP. All rights reserved.
              </p>
            </div>
          </footer>
        </div>
        </I18nProvider>
      </body>
    </html>
  );
}
