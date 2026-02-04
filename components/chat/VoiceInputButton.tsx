'use client';

import React, { useState, useCallback, useRef, useEffect } from 'react';

interface VoiceInputButtonProps {
  onTranscript: (text: string) => void;
  onListeningChange?: (isListening: boolean) => void;
  disabled?: boolean;
  className?: string;
}

// SpeechRecognition type definitions
interface ISpeechRecognitionResult {
  readonly transcript: string;
  readonly confidence: number;
}

interface ISpeechRecognitionResultList {
  readonly length: number;
  item(index: number): ISpeechRecognitionResult;
  [index: number]: {
    [index: number]: ISpeechRecognitionResult;
  };
}

interface ISpeechRecognitionEvent {
  readonly results: ISpeechRecognitionResultList;
  readonly resultIndex: number;
}

interface ISpeechRecognitionErrorEvent {
  readonly error: string;
  readonly message: string;
}

interface ISpeechRecognition {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onresult: ((event: ISpeechRecognitionEvent) => void) | null;
  onerror: ((event: ISpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
  start(): void;
  stop(): void;
  abort(): void;
}

interface ISpeechRecognitionConstructor {
  new(): ISpeechRecognition;
}

// Get the SpeechRecognition constructor if available
function getSpeechRecognition(): ISpeechRecognitionConstructor | null {
  if (typeof window === 'undefined') return null;
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const win = window as any;
  return win.SpeechRecognition || win.webkitSpeechRecognition || null;
}

export function VoiceInputButton({ 
  onTranscript, 
  onListeningChange,
  disabled = false,
  className = ''
}: VoiceInputButtonProps) {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const recognitionRef = useRef<ISpeechRecognition | null>(null);

  useEffect(() => {
    const SpeechRecognitionClass = getSpeechRecognition();
    setIsSupported(SpeechRecognitionClass !== null);
    
    if (SpeechRecognitionClass) {
      recognitionRef.current = new SpeechRecognitionClass();
      recognitionRef.current.continuous = false;
      recognitionRef.current.interimResults = false;
      recognitionRef.current.lang = 'en-US';

      recognitionRef.current.onresult = (event: ISpeechRecognitionEvent) => {
        const transcript = event.results[0][0].transcript;
        onTranscript(transcript);
        setIsListening(false);
        onListeningChange?.(false);
      };

      recognitionRef.current.onerror = (event: ISpeechRecognitionErrorEvent) => {
        console.error('Speech recognition error:', event.error);
        setError(event.error === 'not-allowed' 
          ? 'Microphone access denied' 
          : 'Speech recognition error');
        setIsListening(false);
        onListeningChange?.(false);
      };

      recognitionRef.current.onend = () => {
        setIsListening(false);
        onListeningChange?.(false);
      };
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, [onTranscript, onListeningChange]);

  const toggleListening = useCallback(() => {
    if (!recognitionRef.current) return;

    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
      onListeningChange?.(false);
    } else {
      setError(null);
      recognitionRef.current.start();
      setIsListening(true);
      onListeningChange?.(true);
    }
  }, [isListening, onListeningChange]);

  // Don't render if not supported
  if (!isSupported) {
    return null;
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={toggleListening}
        disabled={disabled}
        className={`
          relative p-2.5 rounded-xl transition-all duration-200
          ${isListening 
            ? 'bg-red-500/20 text-red-400 border-red-500/50' 
            : 'bg-gray-800/50 text-gray-400 hover:text-purple-400 hover:bg-gray-700/50 border-gray-700/50'
          }
          border backdrop-blur-sm
          disabled:opacity-50 disabled:cursor-not-allowed
          ${className}
        `}
        title={isListening ? 'Stop listening' : 'Voice input'}
      >
        {/* Microphone Icon */}
        <svg 
          className={`w-5 h-5 ${isListening ? 'animate-pulse' : ''}`} 
          fill="none" 
          viewBox="0 0 24 24" 
          stroke="currentColor"
        >
          <path 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            strokeWidth={2} 
            d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" 
          />
        </svg>

        {/* Listening animation ring */}
        {isListening && (
          <>
            <span className="absolute inset-0 rounded-xl border-2 border-red-400 animate-ping opacity-20" />
            <span className="absolute inset-0 rounded-xl border-2 border-red-400 animate-pulse opacity-40" />
          </>
        )}
      </button>

      {/* Error tooltip */}
      {error && (
        <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-red-900/90 text-red-200 text-xs rounded-lg whitespace-nowrap animate-fade-in-down">
          {error}
          <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-red-900/90" />
        </div>
      )}
    </div>
  );
}
