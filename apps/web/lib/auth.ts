import { NextRequest } from 'next/server';
import { createClient } from '@supabase/supabase-js';

let supabaseAdmin: ReturnType<typeof createClient> | null = null;

function getSupabaseAdmin() {
  if (supabaseAdmin) return supabaseAdmin;
  
  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  
  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Supabase configuration missing:');
    console.error('SUPABASE_URL:', process.env.SUPABASE_URL ? 'SET' : 'NOT SET');
    console.error('NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL ? 'SET' : 'NOT SET');
    console.error('SUPABASE_SERVICE_ROLE_KEY:', process.env.SUPABASE_SERVICE_ROLE_KEY ? 'SET' : 'NOT SET');
    throw new Error('Supabase URL and Service Role Key must be configured');
  }
  
  supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  });
  
  return supabaseAdmin;
}

export async function verifySupabaseJwt(
  request: NextRequest
): Promise<{ status: number; error: string; message?: string } | null> {
  try {
    const authHeader = request.headers.get('authorization');
    const token = authHeader?.startsWith('Bearer ') ? authHeader.slice('Bearer '.length) : undefined;
    
    if (!token) {
      return { status: 401, error: 'missing_bearer_token' };
    }

    const supabase = getSupabaseAdmin();
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return { 
        status: 401, 
        error: 'invalid_token', 
        message: error?.message || 'User not found' 
      };
    }

    return null;
  } catch (err: any) {
    console.error('Authentication error:', err);
    return { 
      status: 401, 
      error: 'authentication_error', 
      message: err?.message || 'Unknown authentication error' 
    };
  }
}

