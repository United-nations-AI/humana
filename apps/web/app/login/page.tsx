"use client";

import { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  async function handleLogin() {
    if (!supabase) return alert('Supabase not configured');
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) return alert(error.message);
      window.location.href = '/chat';
    } finally {
      setLoading(false);
    }
  }
  async function handleMagicLink() {
    if (!supabase) return alert('Supabase not configured');
    setLoading(true);
    try {
      const redirectTo = typeof window !== 'undefined' ? `${window.location.origin}/chat` : undefined;
      const { error } = await supabase.auth.signInWithOtp({ email, options: { emailRedirectTo: redirectTo } });
      if (error) return alert(error.message);
      alert('Check your email for a login link');
    } finally {
      setLoading(false);
    }
  }
  return (
    <div className="max-w-md mx-auto px-4 pt-20 pb-10">
      <div className="glass rounded-2xl p-6">
        <h1 className="text-2xl font-semibold text-white">Login</h1>
        <p className="text-sm text-white/70 mt-1">Sign in to continue</p>
        <form className="mt-6 space-y-4" onSubmit={(e)=>{e.preventDefault(); handleLogin();}}>
          <div>
            <label className="block text-sm mb-1 text-white/90">Email</label>
            <input value={email} onChange={(e)=>setEmail(e.target.value)} type="email" className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 outline-none focus:border-brand-500 text-white placeholder:text-white/40" placeholder="you@example.com" />
          </div>
          <div>
            <label className="block text-sm mb-1 text-white/90">Password</label>
            <input value={password} onChange={(e)=>setPassword(e.target.value)} type="password" className="w-full px-3 py-2 rounded-xl bg-white/5 border border-white/10 outline-none focus:border-brand-500 text-white placeholder:text-white/40" placeholder="••••••••" />
          </div>
          <button className="btn btn-primary w-full" type="submit" disabled={loading}>{loading ? 'Please wait...' : 'Continue'}</button>
        </form>
        <div className="mt-3 text-center text-white/70 text-sm">
          Or <button onClick={handleMagicLink} className="underline text-brand-400 hover:text-brand-300">send a magic link</button>
        </div>
        <div className="mt-4 text-center text-white/70 text-sm">Social login coming soon</div>
      </div>
    </div>
  );
}
