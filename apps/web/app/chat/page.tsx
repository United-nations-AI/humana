"use client";

import { useEffect, useRef, useState } from 'react';
import AvatarCanvas from '../../components/AvatarCanvas';

type ChatMessage = { role: 'user'|'assistant'|'system'; content: string };

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:4000';

export default function ChatPage() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder|null>(null);
  const chunksRef = useRef<BlobPart[]>([]);
  const audioRef = useRef<HTMLAudioElement|null>(null);

  useEffect((): void => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
    }
  }, []);

  async function callChat(userText: string) {
    const nextHistory: ChatMessage[] = [...messages, { role: 'user' as const, content: userText }];
    setMessages(nextHistory);
    try {
      const res = await fetch(`${API_BASE}/v1/chat`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: nextHistory.map(m => ({ role: m.role, content: m.content })) })
      });
      const data = await res.json();
      const reply = data?.reply || '...';
      setMessages(prev => [...prev, { role: 'assistant', content: reply }]);
      // Auto TTS playback
      void speak(reply);
    } catch (e) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Sorry, something went wrong.' }]);
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
      const form = new FormData();
      form.append('audio', blob, 'audio.webm');
      const res = await fetch(`${API_BASE}/v1/stt`, { method: 'POST', body: form });
      const data = await res.json();
      const text = data?.text?.trim();
      if (text) {
        setInput('');
        await callChat(text);
      }
    } catch (e) {
      setMessages(prev => [...prev, { role: 'assistant', content: 'Could not transcribe audio.' }]);
    }
  }

  async function speak(text: string) {
    try {
      const res = await fetch(`${API_BASE}/v1/tts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
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
          <AvatarCanvas />
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
            <div className="text-center text-white/60 text-sm mt-8">Ask about human rights, protections, and resources.</div>
          )}
          {messages.map((m, idx) => (
            <div key={idx} className={`max-w-[85%] rounded-2xl px-4 py-2 ${m.role === 'user' ? 'ml-auto bg-brand-600' : 'bg-white/10'}`}>
              {m.content}
            </div>
          ))}
        </div>
        <div className="mt-4 flex items-center gap-2">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Type your message..."
            className="flex-1 px-4 py-3 rounded-xl bg-white/5 border border-white/10 outline-none focus:border-brand-500"
          />
          <button className="btn btn-primary" onClick={sendMessage}>Send</button>
        </div>
      </div>
    </div>
  );
}

