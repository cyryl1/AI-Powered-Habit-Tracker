'use client';

import React, { useState, useRef, useEffect } from 'react';
import { BASE_URL } from '@/config';
import { useAuth } from '@/context/AuthContext';

interface ChatMessage {
  role: 'user' | 'model';
  content: string;
}

export default function AiAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { user } = useAuth();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg: ChatMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      // Prepare history (excluding the current message)
      const history = messages.map(m => ({
        role: m.role,
        content: m.content
      }));

      const response = await fetch(`${BASE_URL}ai/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMsg,
          history: history
        }),
        credentials: 'include',
      });

      if (!response.ok) throw new Error('Failed to send message');

      const data = await response.json();
      const aiMsg: ChatMessage = { role: 'model', content: data.response };
      setMessages(prev => [...prev, aiMsg]);
    } catch (error) {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, { role: 'model', content: '⚠️ Connection lost. My neural link is unstable.' }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* Chat Window */}
      {isOpen && (
        <div className="mb-4 w-80 sm:w-96 h-[500px] bg-black/90 border border-cyan-500/30 rounded-2xl backdrop-blur-xl shadow-[0_0_30px_rgba(34,211,238,0.1)] flex flex-col overflow-hidden animate-in slide-in-from-bottom-10 fade-in duration-300">
          {/* Header */}
          <div className="p-4 border-b border-cyan-500/20 bg-cyan-950/30 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="text-cyan-300 font-mono text-sm font-bold">NEURAL_ASSISTANT</span>
            </div>
            <button 
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-white transition-colors"
            >
              ✕
            </button>
          </div>

          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin scrollbar-thumb-cyan-900 scrollbar-track-transparent">
            {messages.length === 0 && (
              <div className="text-center text-gray-500 mt-10 font-mono text-sm">
                <p>System Online.</p>
                <p>How can I assist your protocols today?</p>
              </div>
            )}
            {messages.map((msg, idx) => (
              <div 
                key={idx} 
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div 
                  className={`max-w-[80%] p-3 rounded-xl text-sm ${
                    msg.role === 'user' 
                      ? 'bg-cyan-900/40 text-cyan-100 border border-cyan-500/30 rounded-tr-none' 
                      : 'bg-gray-900/60 text-gray-300 border border-gray-700 rounded-tl-none'
                  }`}
                >
                  {msg.content}
                </div>
              </div>
            ))}
            {loading && (
              <div className="flex justify-start">
                <div className="bg-gray-900/60 p-3 rounded-xl rounded-tl-none border border-gray-700">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-cyan-500/50 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-cyan-500/50 rounded-full animate-bounce delay-100"></div>
                    <div className="w-2 h-2 bg-cyan-500/50 rounded-full animate-bounce delay-200"></div>
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form onSubmit={handleSend} className="p-4 border-t border-cyan-500/20 bg-black/50">
            <div className="flex gap-2">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type command..."
                className="flex-1 bg-gray-900/50 border border-gray-700 rounded-lg px-4 py-2 text-sm text-white focus:border-cyan-500 focus:outline-none transition-colors font-mono"
              />
              <button 
                type="submit"
                disabled={loading || !input.trim()}
                className="bg-cyan-500/20 text-cyan-400 border border-cyan-500/50 p-2 rounded-lg hover:bg-cyan-500/30 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
              >
                ➤
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110 ${
          isOpen 
            ? 'bg-gray-800 text-gray-400 rotate-90' 
            : 'bg-gradient-to-r from-cyan-500 to-blue-600 text-white shadow-cyan-500/25 animate-pulse-slow'
        }`}
      >
        {isOpen ? (
          <span className="text-xl">✕</span>
        ) : (
          <span className="text-2xl">💬</span>
        )}
      </button>
    </div>
  );
}