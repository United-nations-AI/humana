"use client";

import { useState } from 'react';
import { supabase } from '../../lib/supabaseClient';
import Link from 'next/link';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [isSignUp, setIsSignUp] = useState(false);
  const [magicLinkSent, setMagicLinkSent] = useState(false);

  async function handleLogin() {
    if (!acceptedTerms) {
      alert('Please accept the Terms and Conditions to continue');
      return;
    }
    if (!supabase) {
      alert('Supabase not configured. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables.');
      return;
    }
    if (!email.trim()) {
      alert('Please enter your email address');
      return;
    }
    if (!password.trim() && !isSignUp) {
      alert('Please enter your password');
      return;
    }
    if (isSignUp && password.length < 6) {
      alert('Password must be at least 6 characters long');
      return;
    }
    setLoading(true);
    try {
      if (isSignUp) {
        // Sign up new user
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: typeof window !== 'undefined' ? `${window.location.origin}/chat` : undefined,
          }
        });
        if (error) {
          alert(error.message);
          return;
        }
        alert('Account created! Please check your email to verify your account, then you can login.');
        setIsSignUp(false);
        setPassword('');
      } else {
        // Sign in existing user
      const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) {
          if (error.message.includes('Invalid login credentials')) {
            alert('Invalid credentials. If you are a new user, please use "Sign Up" or use the magic link option below.');
          } else {
            alert(error.message);
          }
          return;
        }
      window.location.href = '/chat';
      }
    } catch (err: any) {
      alert(err?.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  async function handleMagicLink() {
    if (!acceptedTerms) {
      alert('Please accept the Terms and Conditions to continue');
      return;
    }
    if (!supabase) {
      alert('Supabase not configured. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables.');
      return;
    }
    if (!email.trim()) {
      alert('Please enter your email address');
      return;
    }
    setLoading(true);
    try {
      const redirectTo = typeof window !== 'undefined' ? `${window.location.origin}/chat` : undefined;
      const { error } = await supabase.auth.signInWithOtp({ 
        email, 
        options: { 
          emailRedirectTo: redirectTo,
          shouldCreateUser: true, // Automatically create user if they don't exist
        } 
      });
      if (error) {
        alert(error.message);
        return;
      }
      setMagicLinkSent(true);
      alert('Check your email for a login link. Click the link to sign in (new users will be automatically created).');
    } catch (err: any) {
      alert(err?.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto px-4 pt-20 pb-10">
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-rights-primary to-rights-accent mb-4 shadow-lg shadow-rights-primary/30">
          <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-rights-primary-light to-rights-accent bg-clip-text text-transparent mb-2">
          {isSignUp ? 'Join AIHRP' : 'Welcome to AIHRP'}
        </h1>
        <p className="text-white/70">{isSignUp ? 'Create your account to get started' : 'Sign in to access the platform'}</p>
      </div>
      <div className="glass rounded-2xl p-8 border border-white/10 shadow-2xl">
        
        {magicLinkSent ? (
          <div className="mt-6 p-4 bg-rights-accent/20 border border-rights-accent/50 rounded-xl">
            <p className="text-white text-sm flex items-start gap-2">
              <span className="text-rights-accent-light">✓</span>
              <span>Magic link sent! Check your email (<strong>{email}</strong>) and click the link to sign in.</span>
            </p>
            <button 
              onClick={() => setMagicLinkSent(false)} 
              className="mt-3 text-rights-accent-light hover:text-rights-accent text-sm underline transition-colors"
            >
              Send another link
            </button>
          </div>
        ) : (
          <>
        <form className="mt-6 space-y-4" onSubmit={(e)=>{e.preventDefault(); handleLogin();}}>
          <div>
            <label className="block text-sm mb-1 text-white/90">Email</label>
                <input 
                  value={email} 
                  onChange={(e)=>setEmail(e.target.value)} 
                  type="email" 
                  className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 outline-none focus:border-rights-primary-light focus:ring-2 focus:ring-rights-primary/30 text-white placeholder:text-white/40 transition-all" 
                  placeholder="you@example.com" 
                  required 
                />
          </div>
              {!isSignUp && (
          <div>
            <label className="block text-sm mb-1 text-white/90">Password</label>
                  <input 
                    value={password} 
                    onChange={(e)=>setPassword(e.target.value)} 
                    type="password" 
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 outline-none focus:border-rights-primary-light focus:ring-2 focus:ring-rights-primary/30 text-white placeholder:text-white/40 transition-all" 
                    placeholder="••••••••" 
                    required 
                  />
                </div>
              )}
              {isSignUp && (
                <div>
                  <label className="block text-sm mb-1 text-white/90">Password (min. 6 characters)</label>
                  <input 
                    value={password} 
                    onChange={(e)=>setPassword(e.target.value)} 
                    type="password" 
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 outline-none focus:border-rights-primary-light focus:ring-2 focus:ring-rights-primary/30 text-white placeholder:text-white/40 transition-all" 
                    placeholder="••••••••" 
                    required 
                    minLength={6}
                  />
          </div>
              )}
          <div className="flex items-start gap-2">
            <input
              type="checkbox"
              id="terms"
              checked={acceptedTerms}
              onChange={(e) => setAcceptedTerms(e.target.checked)}
              className="mt-1 w-4 h-4 rounded border-white/20 bg-white/5 text-rights-primary-light focus:ring-rights-primary-light focus:ring-2"
              required
            />
            <label htmlFor="terms" className="text-sm text-white/80">
              I agree to the{' '}
              <Link href="/terms" className="text-rights-primary-light hover:text-rights-accent-light underline transition-colors">
                Terms and Conditions
              </Link>
            </label>
          </div>
          <button className="btn btn-primary w-full" type="submit" disabled={loading || !acceptedTerms}>
                {loading ? 'Please wait...' : (isSignUp ? 'Create Account' : 'Sign In')}
          </button>
        </form>
            <div className="mt-4 text-center text-white/70 text-sm">
              {isSignUp ? (
                <>
                  Already have an account?{' '}
                  <button onClick={() => setIsSignUp(false)} className="underline text-rights-primary-light hover:text-rights-accent-light transition-colors">
                    Sign In
                  </button>
                </>
              ) : (
                <>
                  Don't have an account?{' '}
                  <button onClick={() => setIsSignUp(true)} className="underline text-rights-primary-light hover:text-rights-accent-light transition-colors">
                    Sign Up
                  </button>
                </>
              )}
            </div>
            <div className="mt-4 text-center">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-white/10"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-3 bg-rights-bg text-white/60 rounded-full">Or</span>
                </div>
              </div>
              <button 
                onClick={handleMagicLink} 
                className="mt-4 w-full btn btn-secondary" 
                disabled={loading || !acceptedTerms}
              >
                {loading ? 'Sending...' : '📧 Sign in with Magic Link'}
              </button>
              <p className="mt-2 text-xs text-white/50 text-center">
                Magic link works for both new and existing users
              </p>
        </div>
        <div className="mt-4 text-center text-white/70 text-sm">Social login coming soon</div>
          </>
        )}
      </div>
    </div>
  );
}
