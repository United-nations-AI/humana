"use client";

import Link from 'next/link';
import { useState } from 'react';

export default function LandingPage() {
  const [imageError, setImageError] = useState(false);

  return (
    <section className="relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-4 pt-24 pb-16 grid md:grid-cols-2 gap-12 items-center">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-white/80 text-xs mb-4">
            Multilingual • Voice & Text • Avatar
          </div>
          <h1 className="text-4xl md:text-6xl font-bold leading-tight">
            Human rights AI avatar
            <span className="block text-brand-400">that speaks your language.</span>
          </h1>
          <p className="text-white/80 mt-5 max-w-prose">
            Chat naturally via voice or text with an AI trained to provide human rights information, guidance, and resources.
          </p>
          <div className="mt-8 flex gap-3">
            <Link href="/login" className="btn btn-primary">Login</Link>
            <Link href="/about" className="btn btn-secondary">Learn More</Link>
          </div>
        </div>
        <div className="glass rounded-2xl p-6">
          <div className="aspect-square rounded-xl overflow-hidden border border-white/10 bg-gradient-to-br from-brand-700/40 to-brand-400/20 flex items-center justify-center">
            {!imageError ? (
              <img 
                src="/humana-avatar.png" 
                alt="Humana AI Avatar" 
                className="w-full h-full object-contain"
                onError={() => setImageError(true)}
              />
            ) : (
              <div className="text-white/40 text-sm text-center px-4">
                Avatar image placeholder<br />
                <span className="text-xs">Place humana-avatar.png in /public</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
