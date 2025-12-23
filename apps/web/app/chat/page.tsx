"use client";

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import AvatarCanvas from '../../components/AvatarCanvas';
import { supabase } from '../../lib/supabaseClient';

type ChatMessage = { role: 'user'|'assistant'|'system'; content: string };

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000';

export default function ChatPage() {
  const router = useRouter();
  const { i18n } = useTranslation('common');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language);
  const mediaRecorderRef = useRef<MediaRecorder|null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const audioRef = useRef<HTMLAudioElement|null>(null);

  // Listen for language changes
  useEffect(() => {
    const handleLanguageChange = (lng: string) => {
      setCurrentLanguage(lng);
    };
    i18n.on('languageChanged', handleLanguageChange);
    return () => {
      i18n.off('languageChanged', handleLanguageChange);
    };
  }, [i18n]);

  // Check authentication on mount and handle auth callbacks
  useEffect(() => {
    const checkAuth = async () => {
      if (!supabase) {
        alert('Supabase not configured. Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY environment variables.');
        router.push('/login');
        return;
      }
      
      // Handle auth callback from magic link or email verification
      // Check both hash fragments and query parameters
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const queryParams = new URLSearchParams(window.location.search);
      
      const accessToken = hashParams.get('access_token') || queryParams.get('access_token');
      const refreshToken = hashParams.get('refresh_token') || queryParams.get('refresh_token');
      const type = hashParams.get('type') || queryParams.get('type');
      
      if (accessToken && refreshToken) {
        // Set the session from URL (magic link or email verification callback)
        const { error: sessionError } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });
        
        if (sessionError) {
          console.error('Session error:', sessionError);
          router.push('/login');
          return;
        }
        
        // Clear URL hash and query params
        window.history.replaceState(null, '', window.location.pathname);
      }
      
      // Check current session
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error || !session) {
        router.push('/login');
      }
    };
    checkAuth();
  }, [router]);

  useEffect((): void => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
    }
  }, []);

  async function getAuthToken(): Promise<string | null> {
    if (!supabase) return null;
    const { data: { session } } = await supabase.auth.getSession();
    return session?.access_token || null;
  }

  async function callChat(userText: string) {
    const nextHistory: ChatMessage[] = [...messages, { role: 'user' as const, content: userText }];
    setMessages(nextHistory);
    setLoading(true);
    try {
      const token = await getAuthToken();
      if (!token) {
        throw new Error('Not authenticated');
      }

      const language = currentLanguage || i18n.language || 'en';
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      };

      const res = await fetch(`${API_BASE}/v1/chat`, {
        method: 'POST',
        headers,
        body: JSON.stringify({ 
          messages: nextHistory.map(m => ({ role: m.role, content: m.content })),
          language,
        })
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ error: 'unknown_error' }));
        throw new Error(errorData.error || `HTTP ${res.status}`);
      }

      const data = await res.json();
      const reply = data?.reply || '...';
      setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
      // Auto TTS playback
      void speak(reply);
    } catch (e: any) {
      console.error('Chat error:', e);
      const errorMessage = e?.message?.includes('authenticated') 
        ? 'Please login to continue'
        : e?.message || 'Sorry, something went wrong.';
      setMessages(prev => [...prev, { role: 'assistant', content: errorMessage }]);
    } finally {
      setLoading(false);
    }
  }

  function sendMessage() {
    if (!input.trim()) return;
    const text = input.trim();
    setInput('');
    void callChat(text);
  }

  async function startRecording() {
    if (isRecording) return;
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mr = new MediaRecorder(stream, { mimeType: 'audio/webm' });
      chunksRef.current = [];
      mr.ondataavailable = (e) => { if (e.data.size > 0) chunksRef.current.push(e.data); };
      mr.onstop = async () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        await transcribe(blob);
      };
      mediaRecorderRef.current = mr;
      mr.start();
      setIsRecording(true);
    } catch (err) {
      alert('Microphone access denied or not available.');
    }
  }

  function stopRecording() {
    if (!isRecording || !mediaRecorderRef.current) return;
    mediaRecorderRef.current.stop();
    mediaRecorderRef.current.stream.getTracks().forEach(t => t.stop());
    setIsRecording(false);
  }

  async function transcribe(blob: Blob) {
    try {
      const token = await getAuthToken();
      if (!token) {
        throw new Error('Not authenticated');
      }

      const form = new FormData();
      form.append('audio', blob, 'audio.webm');
      const res = await fetch(`${API_BASE}/v1/stt`, { 
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: form 
      });
      
      if (!res.ok) {
        const errorData = await res.json().catch(() => ({ error: 'unknown_error' }));
        throw new Error(errorData.error || `HTTP ${res.status}`);
      }

      const data = await res.json();
      const text = data?.text?.trim();
      if (text) {
        setInput('');
        await callChat(text);
      }
    } catch (e: any) {
      console.error('Transcribe error:', e);
      setMessages(prev => [...prev, { role: 'assistant', content: e?.message || 'Could not transcribe audio.' }]);
    }
  }

  async function speak(text: string) {
    try {
      const token = await getAuthToken();
      if (!token) {
        return; // Silently fail for TTS if not authenticated
      }

      const res = await fetch(`${API_BASE}/v1/tts`, {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ text, format: 'mp3' })
      });
      if (!res.ok) return;
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      if (audioRef.current) {
        audioRef.current.src = url;
        await audioRef.current.play().catch(()=>{});
      }
    } catch (_e) {
      // ignore tts errors silently
    }
  }

  return (
    <div className="max-w-6xl mx-auto px-4 pt-10 pb-6 grid md:grid-cols-[380px_1fr] gap-6">
      <div className="glass rounded-2xl p-4">
        <div className="aspect-square rounded-xl overflow-hidden">
          <AvatarCanvas audioElement={audioRef.current} />
        </div>
        <div className="mt-4 flex gap-2">
          <button className="btn btn-secondary w-full" type="button" onClick={isRecording ? stopRecording : startRecording}>
            {isRecording ? '⏹️ Stop' : '🎙️ Speak'}
          </button>
          <button className="btn btn-secondary w-full" type="button" onClick={() => messages.filter(m=>m.role==='assistant').slice(-1)[0]?.content && speak(messages.filter(m=>m.role==='assistant').slice(-1)[0].content)}>🔊 Listen</button>
        </div>
      </div>
      <div className="glass rounded-2xl p-4 flex flex-col min-h-[70vh]">
        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          {messages.length === 0 && (
            <div className="text-center text-white/60 text-sm mt-8">
              {currentLanguage === 'en' && 'Ask about human rights, protections, and resources.'}
              {currentLanguage === 'es' && 'Pregunta sobre derechos humanos, protecciones y recursos.'}
              {currentLanguage === 'fr' && 'Demandez des informations sur les droits de l\'homme, les protections et les ressources.'}
              {currentLanguage === 'ar' && 'اسأل عن حقوق الإنسان والحماية والموارد.'}
              {currentLanguage === 'ru' && 'Спросите о правах человека, защите и ресурсах.'}
              {currentLanguage === 'it' && 'Chiedi informazioni sui diritti umani, le protezioni e le risorse.'}
              {currentLanguage === 'ml' && 'മനുഷ്യാവകാശങ്ങൾ, സംരക്ഷണങ്ങൾ, വിഭവങ്ങൾ എന്നിവയെക്കുറിച്ച് ചോദിക്കുക.'}
              {currentLanguage === 'hi' && 'मानवाधिकार, सुरक्षा और संसाधनों के बारे में पूछें.'}
              {currentLanguage === 'sw' && 'Uliza kuhusu haki za binadamu, ulinzi, na rasilimali.'}
              {!['en', 'es', 'fr', 'ar', 'ru', 'it', 'ml', 'hi', 'sw'].includes(currentLanguage) && 'Ask about human rights, protections, and resources.'}
            </div>
          )}
          {messages.map((m, idx) => (
            <div key={idx} className={`max-w-[85%] rounded-2xl px-4 py-2 ${m.role === 'user' ? 'ml-auto bg-brand-600' : 'bg-white/10'}`}>
              {m.content}
            </div>
          ))}
          {loading && (
            <div className="max-w-[85%] rounded-2xl px-4 py-2 bg-white/10">
              <span className="text-white/60">...</span>
            </div>
          )}
        </div>
        <div className="mt-4 flex items-center gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !loading && sendMessage()}
            placeholder={
              currentLanguage === 'en' ? 'Type your message...' :
              currentLanguage === 'es' ? 'Escribe tu mensaje...' :
              currentLanguage === 'fr' ? 'Tapez votre message...' :
              currentLanguage === 'ar' ? 'اكتب رسالتك...' :
              currentLanguage === 'ru' ? 'Введите ваше сообщение...' :
              currentLanguage === 'it' ? 'Digita il tuo messaggio...' :
              currentLanguage === 'ml' ? 'നിങ്ങളുടെ സന്ദേശം ടൈപ്പ് ചെയ്യുക...' :
              currentLanguage === 'hi' ? 'अपना संदेश टाइप करें...' :
              currentLanguage === 'sw' ? 'Andika ujumbe wako...' :
              'Type your message...'
            }
            disabled={loading}
            className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 outline-none focus:border-brand-500 disabled:opacity-50"
          />
          <button className="btn btn-primary" onClick={sendMessage} disabled={loading}>
            {currentLanguage === 'en' ? 'Send' :
             currentLanguage === 'es' ? 'Enviar' :
             currentLanguage === 'fr' ? 'Envoyer' :
             currentLanguage === 'ar' ? 'إرسال' :
             currentLanguage === 'ru' ? 'Отправить' :
             currentLanguage === 'it' ? 'Invia' :
             currentLanguage === 'ml' ? 'അയയ്ക്കുക' :
             currentLanguage === 'hi' ? 'भेजें' :
             currentLanguage === 'sw' ? 'Tuma' :
             'Send'}
          </button>
        </div>
      </div>
    </div>
  );
}

