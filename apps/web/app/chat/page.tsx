"use client";

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useTranslation } from 'react-i18next';
import AvatarCanvas from '../../components/AvatarCanvas';
import { supabase } from '../../lib/supabaseClient';

type ChatMessage = { role: 'user'|'assistant'|'system'; content: string; file?: string };

// API routes are now relative paths (Next.js API routes for Vercel deployment)

export default function ChatPage() {
  const router = useRouter();
  const { i18n } = useTranslation('common');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [loading, setLoading] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder|null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const audioRef = useRef<HTMLAudioElement|null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Clear sessionStorage on mount (fresh start on refresh)
  useEffect(() => {
    sessionStorage.removeItem('chatMessages');
  }, []);

  // Save messages to sessionStorage whenever they change (for current session only)
  useEffect(() => {
    if (messages.length > 0) {
      sessionStorage.setItem('chatMessages', JSON.stringify(messages));
    }
  }, [messages]);

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
      
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const queryParams = new URLSearchParams(window.location.search);
      
      const accessToken = hashParams.get('access_token') || queryParams.get('access_token');
      const refreshToken = hashParams.get('refresh_token') || queryParams.get('refresh_token');
      
      if (accessToken && refreshToken) {
        const { error: sessionError } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });
        
        if (sessionError) {
          console.error('Session error:', sessionError);
          router.push('/login');
          return;
        }
        
        window.history.replaceState(null, '', window.location.pathname);
      }
      
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error || !session) {
        router.push('/login');
      }
    };
    checkAuth();
  }, [router]);

  useEffect(() => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
      audioRef.current.onplay = () => setIsSpeaking(true);
      audioRef.current.onpause = () => setIsSpeaking(false);
      audioRef.current.onended = () => setIsSpeaking(false);
    }
    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  async function getAuthToken(): Promise<string | null> {
    if (!supabase) return null;
    const { data: { session } } = await supabase.auth.getSession();
    return session?.access_token || null;
  }

  async function extractTextFromFile(file: File): Promise<string> {
    try {
      // For text files, read directly
      if (file.type.startsWith('text/') || file.name.endsWith('.txt') || file.name.endsWith('.md') || file.name.endsWith('.csv')) {
        const text = await file.text();
        return text.substring(0, 50000); // Limit to 50k characters
      }
      // For PDFs and DOC files, return metadata for now
      // In production, you might want to use a library like pdf-parse or send to backend for extraction
      if (file.name.endsWith('.pdf') || file.name.endsWith('.doc') || file.name.endsWith('.docx')) {
        return `[Document file: ${file.name} - Please describe what you'd like me to analyze about this document. The AI will use the file metadata and your description to provide insights.]`;
      }
      // For other file types, return a placeholder
      return `[File: ${file.name} (${(file.size / 1024).toFixed(2)} KB) - Please describe what you'd like me to analyze about this file.]`;
    } catch (error) {
      console.error('File read error:', error);
      throw new Error('Failed to read file. Please try a different file.');
    }
  }

  async function callChat(userText: string, fileContent?: string, fileName?: string) {
    let userMessageContent = userText;
    if (fileContent) {
      userMessageContent = `[File: ${fileName}]\n\n${fileContent}\n\nUser query: ${userText}`;
    }

    const nextHistory: ChatMessage[] = [...messages, { role: 'user' as const, content: userMessageContent, file: fileName }];
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

      const res = await fetch('/api/v1/chat', {
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
      setUploadedFile(null);
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
    if (!input.trim() && !uploadedFile) return;
    const text = input.trim();
    setInput('');
    if (uploadedFile) {
      extractTextFromFile(uploadedFile).then((fileContent) => {
        void callChat(text || 'Please analyze this document', fileContent, uploadedFile.name);
      }).catch((err) => {
        console.error('File read error:', err);
        setMessages(prev => [...prev, { role: 'assistant', content: 'Failed to read file. Please try again.' }]);
      });
    } else {
      void callChat(text);
    }
  }

  function handleFileSelect(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (file) {
      // Check file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        alert('File size must be less than 10MB');
        return;
      }
      setUploadedFile(file);
    }
  }

  function pauseResumeSpeech() {
    if (!audioRef.current) return;
    if (isPaused || !isSpeaking) {
      audioRef.current.play();
      setIsPaused(false);
    } else {
      audioRef.current.pause();
      setIsPaused(true);
    }
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
      const res = await fetch('/api/v1/stt', { 
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
        return;
      }

      const res = await fetch('/api/v1/tts', {
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
        setIsPaused(false);
        await audioRef.current.play().catch(()=>{});
      }
    } catch (_e) {
      // ignore tts errors silently
    }
  }

  const chatHistory = messages.filter(m => m.role === 'user' || m.role === 'assistant');

  return (
    <div className="max-w-7xl mx-auto px-4 pt-10 pb-6 grid md:grid-cols-[380px_1fr] lg:grid-cols-[380px_1fr_320px] gap-6">
      {/* Left Panel - Avatar */}
      <div className="glass rounded-2xl p-4">
        <div className="aspect-square rounded-xl overflow-hidden">
          <AvatarCanvas audioElement={audioRef.current} />
        </div>
        <div className="mt-4 flex gap-2">
          <button className="btn btn-secondary w-full" type="button" onClick={isRecording ? stopRecording : startRecording}>
            {isRecording ? '⏹️ Stop' : '🎙️ Speak'}
          </button>
          <button className="btn btn-secondary w-full" type="button" onClick={() => {
            const lastAssistantMessage = messages.filter(m=>m.role==='assistant').slice(-1)[0]?.content;
            if (lastAssistantMessage) speak(lastAssistantMessage);
          }}>🔊 Listen</button>
        </div>
      </div>

      {/* Center Panel - Chat */}
      <div className="glass rounded-2xl p-4 flex flex-col min-h-[70vh]">
        <div className="flex-1 overflow-y-auto space-y-3 pr-1">
          {messages.length === 0 && (
            <div className="text-center mt-12 space-y-4">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-rights-primary/20 to-rights-accent/20 border border-rights-primary/30 mb-4">
                <svg className="w-8 h-8 text-rights-primary-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <p className="text-white/70 text-base font-medium">
                {currentLanguage === 'en' && 'Welcome to AIHRP. Ask about human rights, protections, and resources.'}
                {currentLanguage === 'es' && 'Bienvenido a AIHRP. Pregunta sobre derechos humanos, protecciones y recursos.'}
                {currentLanguage === 'fr' && 'Bienvenue sur AIHRP. Demandez des informations sur les droits de l\'homme, les protections et les ressources.'}
                {currentLanguage === 'ar' && 'مرحبًا بك في AIHRP. اسأل عن حقوق الإنسان والحماية والموارد.'}
                {currentLanguage === 'ru' && 'Добро пожаловать в AIHRP. Спросите о правах человека, защите и ресурсах.'}
                {currentLanguage === 'it' && 'Benvenuto su AIHRP. Chiedi informazioni sui diritti umani, le protezioni e le risorse.'}
                {currentLanguage === 'ml' && 'AIHRP-ലേക്ക് സ്വാഗതം. മനുഷ്യാവകാശങ്ങൾ, സംരക്ഷണങ്ങൾ, വിഭവങ്ങൾ എന്നിവയെക്കുറിച്ച് ചോദിക്കുക.'}
                {currentLanguage === 'hi' && 'AIHRP में आपका स्वागत है। मानवाधिकार, सुरक्षा और संसाधनों के बारे में पूछें।'}
                {currentLanguage === 'sw' && 'Karibu kwa AIHRP. Uliza kuhusu haki za binadamu, ulinzi, na rasilimali.'}
                {!['en', 'es', 'fr', 'ar', 'ru', 'it', 'ml', 'hi', 'sw'].includes(currentLanguage) && 'Welcome to AIHRP. Ask about human rights, protections, and resources.'}
              </p>
              <p className="text-white/50 text-sm">
                {currentLanguage === 'en' && 'I can help with advocacy guidance, legal resources, and human rights information.'}
                {currentLanguage === 'es' && 'Puedo ayudar con orientación para la defensa, recursos legales e información sobre derechos humanos.'}
                {currentLanguage === 'fr' && 'Je peux aider avec des conseils de plaidoyer, des ressources juridiques et des informations sur les droits de l\'homme.'}
                {currentLanguage === 'ar' && 'يمكنني المساعدة في التوجيه والدعم، والموارد القانونية، ومعلومات حقوق الإنسان.'}
                {currentLanguage === 'ru' && 'Я могу помочь с рекомендациями по защите, правовыми ресурсами и информацией о правах человека.'}
                {currentLanguage === 'it' && 'Posso aiutare con consigli per la difesa, risorse legali e informazioni sui diritti umani.'}
                {currentLanguage === 'ml' && 'പ്രചാരണ മാർഗദർശനം, നിയമ സ്രോതസ്സുകൾ, മനുഷ്യാവകാശ വിവരങ്ങൾ എന്നിവയിൽ എനിക്ക് സഹായിക്കാൻ കഴിയും.'}
                {currentLanguage === 'hi' && 'मैं वकालत मार्गदर्शन, कानूनी संसाधनों और मानवाधिकार सूचना में सहायता कर सकता हूं।'}
                {currentLanguage === 'sw' && 'Naweza kusaidia kwa mwongozo wa uhamasishaji, rasilimali za kisheria, na habari za haki za binadamu.'}
                {!['en', 'es', 'fr', 'ar', 'ru', 'it', 'ml', 'hi', 'sw'].includes(currentLanguage) && 'I can help with advocacy guidance, legal resources, and human rights information.'}
              </p>
            </div>
          )}
          {messages.map((m, idx) => (
            <div key={idx} className={`max-w-[85%] rounded-2xl px-4 py-3 ${m.role === 'user' ? 'ml-auto bg-gradient-to-br from-rights-primary to-rights-primary-light text-white shadow-lg' : 'bg-white/10 text-white/90 border border-white/10'}`}>
              {m.file && (
                <div className="text-xs text-white/70 mb-2 flex items-center gap-1">
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                  </svg>
                  {m.file}
                </div>
              )}
              <div className="whitespace-pre-wrap">{m.content}</div>
            </div>
          ))}
          {loading && (
            <div className="max-w-[85%] rounded-2xl px-4 py-2 bg-white/10">
              <span className="text-white/60">...</span>
            </div>
          )}
        </div>
        <div className="mt-4 space-y-2">
          {uploadedFile && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-rights-primary/20 border border-rights-primary/30">
              <svg className="w-4 h-4 text-rights-primary-light" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
              <span className="text-white/90 text-sm flex-1 truncate">{uploadedFile.name}</span>
              <button 
                onClick={() => setUploadedFile(null)} 
                className="text-white/60 hover:text-white"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          )}
          <div className="flex items-center gap-2">
            <input
              ref={fileInputRef}
              type="file"
              accept=".txt,.pdf,.md,.doc,.docx"
              onChange={handleFileSelect}
              className="hidden"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="px-3 py-3 rounded-xl bg-white/5 border border-white/10 hover:bg-white/10 hover:border-rights-primary-light transition-colors text-white/70 hover:text-white"
              title="Upload file"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
              </svg>
            </button>
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
              className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 outline-none focus:border-rights-primary-light focus:ring-2 focus:ring-rights-primary/30 disabled:opacity-50 text-white placeholder:text-white/50"
            />
            {(isSpeaking || isPaused) && (
              <button
                onClick={pauseResumeSpeech}
                className="px-3 py-3 rounded-xl bg-rights-accent/20 border border-rights-accent/30 hover:bg-rights-accent/30 transition-colors text-white"
                title={isPaused ? 'Resume' : 'Pause'}
              >
                {isPaused ? (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M8 5v14l11-7z"/>
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
                  </svg>
                )}
              </button>
            )}
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

      {/* Right Panel - Chat History */}
      {sidebarOpen && (
        <div className="hidden lg:flex glass rounded-2xl p-4 flex-col min-h-[70vh]">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-white font-semibold">Chat History</h3>
            <button
              onClick={() => setSidebarOpen(false)}
              className="text-white/60 hover:text-white transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="flex-1 overflow-y-auto space-y-2">
            {chatHistory.length === 0 ? (
              <p className="text-white/50 text-sm text-center mt-8">No chat history yet</p>
            ) : (
              chatHistory.map((m, idx) => (
                <div
                  key={idx}
                  className="p-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 cursor-pointer transition-colors"
                  onClick={() => {
                    if (m.role === 'user') {
                      setInput(m.content);
                    }
                  }}
                >
                  <div className="text-xs text-white/60 mb-1 font-medium">
                    {m.role === 'user' ? 'You' : 'AI'}
                  </div>
                  <div className="text-white/80 text-sm line-clamp-3">
                    {m.content.substring(0, 100)}{m.content.length > 100 ? '...' : ''}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
      {!sidebarOpen && (
        <button
          onClick={() => setSidebarOpen(true)}
          className="hidden lg:block self-start mt-4 px-4 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-white/70 hover:text-white transition-colors"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}
    </div>
  );
}
