"use client";

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Debug logging (only in development)
if (typeof window !== 'undefined' && process.env.NODE_ENV === 'development') {
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('Supabase configuration missing:', {
      hasUrl: !!supabaseUrl,
      hasKey: !!supabaseAnonKey,
      url: supabaseUrl ? 'SET' : 'MISSING',
      key: supabaseAnonKey ? 'SET' : 'MISSING'
    });
  }
}

export const supabase = (supabaseUrl && supabaseAnonKey)
  ? createClient(supabaseUrl, supabaseAnonKey)
  : undefined;

