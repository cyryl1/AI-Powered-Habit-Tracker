'use client';

import { useState, useContext } from 'react';
import { useAuth } from '../../context/AuthContext';
import { BASE_URL } from "../../config";

interface Message {
  text: string;
  sender: 'user' | 'ai';
}

export default function AiAssistant() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { text: 'Hello, I am your Neural Assistant. How can I help you with your habits today?', sender: 'ai' },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSendMessage = async () => {
    if (input.trim() === '') return;

    const userMessage: Message = { text: input, sender: 'user' };
    setMessages((prevMessages) => [...prevMessages, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const formattedHistory = messages.map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'model', // 'model' for AI messages
        content: msg.text,
      }));

      const response = await fetch(`${BASE_URL}ai/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ message: { role: 'user', content: input }, history: formattedHistory }),
      });

      if (response.ok) {
        const data = await response.json();
        const aiMessage: Message = { text: data.response, sender: 'ai' };
        setMessages((prevMessages) => [...prevMessages, aiMessage]);
      } else {
        setMessages((prevMessages) => [...prevMessages, { text: 'Error: Could not get a response from the AI.', sender: 'ai' }]);
      }
    } catch (error) {
      console.error('Error sending message to AI:', error);
      setMessages((prevMessages) => [...prevMessages, { text: 'Error: Network issue or server not reachable.', sender: 'ai' }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="bg-purple-600 text-white p-3 rounded-full shadow-lg hover:bg-purple-700 transition-colors"
      >
        🧠
      </button>

      {isOpen && (
        <div className="absolute bottom-16 right-0 w-80 h-96 bg-black border border-purple-400/30 rounded-lg shadow-xl p-4 flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-mono text-purple-300">NEURAL_ASSISTANT</h3>
            <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-white">
              ✕
            </button>
          </div>
          <div className="flex-1 overflow-y-auto text-gray-300 text-sm font-mono p-2 space-y-2">
            {messages.map((msg, index) => (
              <div key={index} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[70%] p-2 rounded-lg ${msg.sender === 'user' ? 'bg-purple-600 text-white' : 'bg-gray-700 text-gray-100'}`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="max-w-[70%] p-2 rounded-lg bg-gray-700 text-gray-100 animate-pulse">
                  Thinking...
                </div>
              </div>
            )}
          </div>
          <div className="flex mt-4">
            <input 
              type="text" 
              placeholder="Ask me anything..."
              className="flex-1 p-2 bg-gray-800 border border-purple-400/20 rounded-l text-white font-mono text-sm focus:outline-none focus:border-purple-400"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleSendMessage();
                }
              }}
              disabled={isLoading}
            />
            <button
              onClick={handleSendMessage}
              className="bg-purple-600 text-white p-2 rounded-r shadow-lg hover:bg-purple-700 transition-colors"
              disabled={isLoading}
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
}