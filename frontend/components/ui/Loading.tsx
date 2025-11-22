import React from 'react';

interface LoadingProps {
  text?: string;
  fullScreen?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export default function Loading({ text = "INITIALIZING_NEURAL_LINK...", fullScreen = false, size = 'md' }: LoadingProps) {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-12 h-12',
    lg: 'w-24 h-24'
  };

  const containerClasses = fullScreen 
    ? "fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/90 backdrop-blur-sm"
    : "flex flex-col items-center justify-center p-8";

  return (
    <div className={containerClasses}>
      <div className="relative flex items-center justify-center">
        {/* Outer Ring */}
        <div className={`${sizeClasses[size]} border-4 border-cyan-500/30 border-t-cyan-400 rounded-full animate-spin`}></div>
        
        {/* Middle Ring (Reverse Spin) */}
        <div className={`absolute ${size === 'lg' ? 'w-16 h-16' : size === 'md' ? 'w-8 h-8' : 'w-4 h-4'} border-4 border-purple-500/30 border-b-purple-400 rounded-full animate-spin-reverse`}></div>
        
        {/* Inner Core (Pulse) */}
        <div className={`absolute ${size === 'lg' ? 'w-8 h-8' : size === 'md' ? 'w-4 h-4' : 'w-2 h-2'} bg-white rounded-full animate-pulse shadow-[0_0_15px_rgba(255,255,255,0.8)]`}></div>
      </div>
      
      {text && (
        <div className="mt-4 font-mono text-cyan-300 text-sm tracking-widest animate-pulse">
          {text}
          <span className="inline-block w-1 h-1 ml-1 bg-cyan-400 rounded-full animate-bounce delay-75"></span>
          <span className="inline-block w-1 h-1 ml-1 bg-cyan-400 rounded-full animate-bounce delay-150"></span>
          <span className="inline-block w-1 h-1 ml-1 bg-cyan-400 rounded-full animate-bounce delay-300"></span>
        </div>
      )}
    </div>
  );
}
