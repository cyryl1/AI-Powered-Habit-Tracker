'use client';

import { useState } from 'react';

export default function AiAssistant() {
  const [isOpen, setIsOpen] = useState(false);

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
          <div className="flex-1 overflow-y-auto text-gray-300 text-sm font-mono">
            {/* AI Assistant content goes here */}
            <p>Hello, I am your Neural Assistant. How can I help you with your habits today?</p>
          </div>
          <input 
            type="text" 
            placeholder="Ask me anything..."
            className="w-full p-2 mt-4 bg-gray-800 border border-purple-400/20 rounded text-white font-mono text-sm focus:outline-none focus:border-purple-400"
          />
        </div>
      )}
    </div>
  );
}