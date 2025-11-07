"use client"

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { BASE_URL } from "../config";

const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // New state for password visibility
  const router = useRouter();
  const { fetchUser } = useAuth(); // Use the fetchUser from AuthContext

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage('');
    setIsError(false);
    setIsLoading(true);

    try {
      const formData = new URLSearchParams();
      formData.append('username', username);
      formData.append('password', password);

      const response = await fetch(`${BASE_URL}users/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString(),
        credentials: 'include',
      });

      if (response.ok) {
        setMessage('AUTHENTICATION_SUCCESSFUL: Access granted to neural network');
        
        const user = await fetchUser();
        
        if (user) {
          setTimeout(() => {
            if (!user.onboarding_completed) {
              router.push('/onboarding');
            } else {
              // Check if user has seen AI intro
              const hasViewedAiIntro = sessionStorage.getItem('ai_intro_viewed');
              if (!hasViewedAiIntro) {
                router.push('/ai-intro');
              } else {
                router.push('/dashboard');
              }
            }
          }, 1000);
        } else {
          setMessage('AUTHENTICATION_ERROR: Failed to fetch user data');
          setIsError(true);
        }
        
        setUsername('');
        setPassword('');
      } else {
        const data = await response.json();
        throw new Error(data.detail || 'Authentication protocol failed.');
      }
    } catch (error) {
      console.error('Login error:', error);
      setMessage('ACCESS_DENIED: ' + (error instanceof Error ? error.message : 'Unknown error occurred'));
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center relative overflow-hidden">
      
      {/* Cyberpunk Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Circuit Board Pattern */}
        <div className="absolute top-0 left-0 w-full h-full">
          <svg width="100%" height="100%" className="opacity-5">
            <defs>
              <pattern id="circuit" width="100" height="100" patternUnits="userSpaceOnUse">
                <path d="M 0 50 L 100 50 M 50 0 L 50 100" fill="none" stroke="cyan" strokeWidth="1" opacity="0.3"/>
                <circle cx="50" cy="50" r="2" fill="cyan" opacity="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#circuit)" />
          </svg>
        </div>

        {/* Scanning Animation */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-scan"></div>

        {/* Security Nodes */}
        <div className="absolute top-1/3 left-1/4 w-2 h-2 bg-green-400 rounded-full opacity-70 animate-ping"></div>
        <div className="absolute bottom-1/4 right-1/3 w-1.5 h-1.5 bg-purple-400 rounded-full opacity-60 animate-pulse delay-700"></div>
        <div className="absolute top-2/3 right-1/4 w-1 h-1 bg-cyan-400 rounded-full opacity-80 animate-bounce delay-300"></div>
      </div>

      {/* Main Form Container */}
      <div className="relative z-10 w-full max-w-md mx-4">
        
        {/* Security Header */}
        <div className="text-center mb-8">
          <div className="relative w-20 h-20 mx-auto mb-4">
            {/* Shield Icon */}
            <div className="absolute inset-0 border-2 border-green-400 rounded-full"></div>
            <div className="absolute inset-3 border-2 border-cyan-400 rounded-full"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl font-bold text-green-400">🔒</span>
            </div>
          </div>
          <h1 className="text-3xl font-light text-white mb-2">
            <span className="font-mono">SECURE_ACCESS</span>
          </h1>
          <p className="text-gray-400 font-mono text-sm">
            Authentication required for system entry
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="bg-black border border-green-400/30 rounded-lg p-8 backdrop-blur-sm">
          <div className="space-y-6">
            
            {/* Credentials Field */}
            <div>
              <label htmlFor="username" className="block text-cyan-300 font-mono text-sm mb-3">
                <span className="text-green-400">⟳</span> USERNAME
              </label>
              <input
                type="text"
                id="username"
                className="w-full px-4 py-3 bg-black border border-gray-700 text-white font-mono rounded-none 
                         focus:border-green-400 focus:outline-none transition-all duration-300
                         hover:border-gray-500"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                placeholder="Enter your username"
                disabled={isLoading}
              />
            </div>

            {/* Encryption Key Field */}
            <div className="relative">
              <label htmlFor="password" className="block text-cyan-300 font-mono text-sm mb-3">
                <span className="text-green-400">⚡</span> PASSWORD
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                className="w-full px-4 py-3 bg-black border border-gray-700 text-white font-mono rounded-none 
                         focus:border-green-400 focus:outline-none transition-all duration-300
                         hover:border-gray-500 pr-10"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your password"
                disabled={isLoading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center pt-8 text-gray-400 hover:text-cyan-300 focus:outline-none"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? ' 🙈 ' : ' 👁 '} {/* Cyberpunk eye icon toggle */}
              </button>
            </div>

            {/* Authentication Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-black border-2 border-green-400 text-green-300 font-mono 
                       hover:bg-green-400 hover:text-black hover:shadow-[0_0_20px_rgba(74,222,128,0.3)]
                       disabled:opacity-50 disabled:cursor-not-allowed
                       transition-all duration-300 relative group flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <div className="w-4 h-4 border-2 border-green-300 border-t-transparent rounded-full animate-spin mr-2"></div>
                  AUTHENTICATING...
                </>
              ) : (
                <>
                  REQUEST_ACCESS
                </>
              )}
            </button>
          </div>

          {/* System Message */}
          {message && (
            <div className={`mt-6 p-3 border font-mono text-sm ${
              isError 
                ? 'border-red-400/50 text-red-300 bg-red-400/10' 
                : 'border-green-400/50 text-green-300 bg-green-400/10'
            }`}>
              <span className={isError ? 'text-red-400' : 'text-green-400'}>$</span> {message}
            </div>
          )}

          {/* Registration Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-400 font-mono text-sm">
              New operator?{' '}
              <Link href="/signup" className="text-cyan-300 hover:text-cyan-200 underline transition-colors">
                INITIATE_REGISTRATION
              </Link>
            </p>
          </div>
        </form>

        {/* Security Status */}
        <div className="mt-6 p-3 border border-cyan-400/30 bg-cyan-400/5">
          <div className="flex items-center justify-between font-mono text-xs">
            <span className="text-cyan-300">SYSTEM_STATUS:</span>
            <span className="text-green-400 flex items-center">
              <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
              SECURE
            </span>
          </div>
        </div>

        {/* Terminal Footer */}
        <div className="mt-4 text-center">
          <div className="text-gray-500 font-mono text-xs flex items-center justify-center space-x-2">
            <span className="text-green-400">➜</span>
            <span className="animate-pulse">_</span>
            <span>awaiting_authentication</span>
          </div>
        </div>
      </div>

      {/* Security Beams */}
      <div className="absolute top-0 left-1/4 w-px h-full bg-gradient-to-b from-transparent via-cyan-400 to-transparent opacity-20"></div>
      <div className="absolute top-0 right-1/4 w-px h-full bg-gradient-to-b from-transparent via-purple-400 to-transparent opacity-20"></div>
    </div>
  );
};

export default LoginForm;