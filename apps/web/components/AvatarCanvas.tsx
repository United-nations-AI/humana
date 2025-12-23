"use client";

import { useEffect, useRef, useState } from 'react';

interface AvatarCanvasProps {
  audioElement?: HTMLAudioElement | null;
}

export default function AvatarCanvas({ audioElement }: AvatarCanvasProps) {
  const [isSpeaking, setIsSpeaking] = useState(false);
  const animationFrameRef = useRef<number | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (!audioElement) return;

    // Initialize Web Audio API for lip sync
    const initAudioAnalysis = () => {
      try {
        const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
        const analyser = audioContext.createAnalyser();
        analyser.fftSize = 256;
        analyser.smoothingTimeConstant = 0.8;

        const source = audioContext.createMediaElementSource(audioElement);
        source.connect(analyser);
        analyser.connect(audioContext.destination);

        audioContextRef.current = audioContext;
        analyserRef.current = analyser;
      } catch (err) {
        console.warn('Audio analysis not available:', err);
      }
    };

    const handlePlay = () => {
      setIsSpeaking(true);
      initAudioAnalysis();
      startLipSync();
    };

    const handlePause = () => {
      setIsSpeaking(false);
      stopLipSync();
    };

    const handleEnded = () => {
      setIsSpeaking(false);
      stopLipSync();
    };

    audioElement.addEventListener('play', handlePlay);
    audioElement.addEventListener('pause', handlePause);
    audioElement.addEventListener('ended', handleEnded);

    return () => {
      audioElement.removeEventListener('play', handlePlay);
      audioElement.removeEventListener('pause', handlePause);
      audioElement.removeEventListener('ended', handleEnded);
      stopLipSync();
      if (audioContextRef.current) {
        audioContextRef.current.close().catch(() => {});
      }
    };
  }, [audioElement]);

  const startLipSync = () => {
    if (animationFrameRef.current) return;

    const animate = () => {
      if (!analyserRef.current || !imageRef.current) {
        animationFrameRef.current = null;
        return;
      }

      const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
      analyserRef.current.getByteFrequencyData(dataArray);

      // Calculate average amplitude for lip sync
      const average = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
      const intensity = Math.min(average / 128, 1); // Normalize to 0-1

      // Apply lip sync animation (scale transform for mouth movement effect)
      if (imageRef.current) {
        const scale = 1 + (intensity * 0.05); // Subtle scale animation
        const translateY = intensity * 2; // Subtle vertical movement
        imageRef.current.style.transform = `scale(${scale}) translateY(${-translateY}px)`;
        imageRef.current.style.transition = 'transform 0.1s ease-out';
      }

      animationFrameRef.current = requestAnimationFrame(animate);
    };

    animate();
  };

  const stopLipSync = () => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (imageRef.current) {
      imageRef.current.style.transform = 'scale(1) translateY(0)';
    }
  };

  return (
    <div className="w-full h-full flex items-center justify-center relative">
      <img
        ref={imageRef}
        src="/humana-avatar.png"
        alt="Humana AI Avatar"
        className="w-full h-full object-contain transition-transform duration-100 ease-out"
        style={{
          filter: isSpeaking ? 'brightness(1.1)' : 'brightness(1)',
        }}
        onError={(e) => {
          // Fallback placeholder if image not found
          const target = e.target as HTMLImageElement;
          target.style.display = 'none';
          if (target.parentElement) {
            const placeholder = document.createElement('div');
            placeholder.className = 'w-full h-full flex items-center justify-center text-white/40 text-sm';
            placeholder.textContent = 'Avatar image placeholder';
            target.parentElement.appendChild(placeholder);
          }
        }}
      />
      {isSpeaking && (
        <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2">
          <div className="flex gap-1">
            <div className="w-1 h-4 bg-brand-400 rounded-full animate-pulse" style={{ animationDelay: '0ms' }} />
            <div className="w-1 h-4 bg-brand-400 rounded-full animate-pulse" style={{ animationDelay: '150ms' }} />
            <div className="w-1 h-4 bg-brand-400 rounded-full animate-pulse" style={{ animationDelay: '300ms' }} />
          </div>
        </div>
      )}
    </div>
  );
}
