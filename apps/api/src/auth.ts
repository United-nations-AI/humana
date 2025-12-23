import type { HttpRequest, HttpResponseInit } from '@azure/functions';
import { createClient } from '@supabase/supabase-js';

let supabaseAdmin: ReturnType<typeof createClient> | null = null;

function getSupabaseAdmin() {
  if (supabaseAdmin) return supabaseAdmin;
  
  // Try SUPABASE_URL first, fallback to NEXT_PUBLIC_SUPABASE_URL (for docker-compose)
  const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
  console.log('SUPABASE_URL', process.env.SUPABASE_URL);
  console.log('NEXT_PUBLIC_SUPABASE_URL', process.env.NEXT_PUBLIC_SUPABASE_URL);
  console.log('supabaseUrl', supabaseUrl);
  console.log('supabaseServiceKey', supabaseServiceKey);
  if (!supabaseUrl || !supabaseServiceKey) {
    console.error('Supabase configuration missing. SUPABASE_URL (or NEXT_PUBLIC_SUPABASE_URL) and SUPABASE_SERVICE_ROLE_KEY must be set.');
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
  request: HttpRequest | any
): Promise<HttpResponseInit | null> {
  try {
    const authHeader = request.headers?.get
      ? request.headers.get('authorization')
      : request.headers?.authorization;
    
    const auth = authHeader || '';
    const token = auth.startsWith('Bearer ') ? auth.slice('Bearer '.length) : undefined;
    
    if (!token) {
      return { status: 401, jsonBody: { error: 'missing_bearer_token' } };
    }

    const supabase = getSupabaseAdmin();
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return { 
        status: 401, 
        jsonBody: { 
          error: 'invalid_token', 
          message: error?.message || 'User not found' 
        } 
      };
    }

    // Attach user to request for handlers to use
    (request as any).user = user;
    return null;
  } catch (err: any) {
    console.error('Authentication error:', err);
    return { 
      status: 401, 
      jsonBody: { 
        error: 'authentication_error', 
        message: err?.message || 'Unknown authentication error' 
      } 
    };
  }
}
