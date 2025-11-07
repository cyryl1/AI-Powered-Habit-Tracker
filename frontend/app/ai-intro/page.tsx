'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { motion } from 'framer-motion'
import { BASE_URL } from "../../config";

export default function AIIntroPage() {
  const router = useRouter()
  const { user, loading } = useAuth()

  const [displayedLines, setDisplayedLines] = useState<string[]>([])
  const [currentLine, setCurrentLine] = useState('')
  const [lineIndex, setLineIndex] = useState(0)
  const [charIndex, setCharIndex] = useState(0)
  const [showContinueButton, setShowContinueButton] = useState(false)
  const [isInitialized, setIsInitialized] = useState(false)

  const [introText, setIntroText] = useState<string[]>([])

  useEffect(() => {
    if (!user) return;

    const fetchIntroText = async () => {
      try {
        const response = await fetch(`${BASE_URL}ai/intro`, {
          credentials: 'include',
        });
        if (response.ok) {
          const data = await response.json();
          setIntroText(data);
        } else {
          console.error('Failed to fetch AI intro text');
          // Fallback to static text if API fails
          setIntroText([
            '[SYSTEM_BOOT] Neural Assistant v2.1.3',
            `[USER_IDENTIFIED] Welcome, ${user?.name || 'Operator'}`,
            '[AI_CALIBRATION] Loading behavioral analysis modules...',
            '[HABIT_PATTERNS] Neural networks optimizing your routines',
            '[SYSTEM_READY] Your AI habit assistant is now active'
          ]);
        }
      } catch (error) {
        console.error('Error fetching AI intro text:', error);
        // Fallback to static text if network error
        setIntroText([
          '[SYSTEM_BOOT] Neural Assistant v2.1.3',
          `[USER_IDENTIFIED] Welcome, ${user?.name || 'Operator'}`,
          '[AI_CALIBRATION] Loading behavioral analysis modules...',
          '[HABIT_PATTERNS] Neural networks optimizing your routines',
          '[SYSTEM_READY] Your AI habit assistant is now active'
        ]);
      }
    };

    fetchIntroText();
  }, [user]);

  useEffect(() => {
    if (lineIndex < introText.length) {
      if (charIndex < introText[lineIndex].length) {
        const timeout = setTimeout(() => {
          setCurrentLine((prev) => prev + introText[lineIndex][charIndex])
          setCharIndex(charIndex + 1)
        }, 30)
        return () => clearTimeout(timeout)
      } else {
        // Finish line
        const delay = setTimeout(() => {
          setDisplayedLines((prev) => [...prev, introText[lineIndex]])
          setCurrentLine('')
          setCharIndex(0)
          setLineIndex(lineIndex + 1)
        }, 500)
        return () => clearTimeout(delay)
      }
    } else if (lineIndex === introText.length && !showContinueButton) {
      // All text done
      setTimeout(() => {
        setShowContinueButton(true)
        setIsInitialized(true)
      }, 600)
    }
  }, [charIndex, lineIndex, introText.length, showContinueButton])

  // Handle loading state
  if (loading || introText.length === 0) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-cyan-300 font-mono text-lg animate-pulse">
          INITIALIZING_NEURAL_INTERFACE
        </div>
      </div>
    )
  }

  const handleContinue = () => {
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('ai_intro_viewed', 'true')
    }
    router.push('/dashboard')
  }

  const circuitNodes = Array.from({ length: 20 }, (_, i) => i)

  return (
    <div className="min-h-screen bg-black text-cyan-300 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <svg width="100%" height="100%">
            <pattern id="circuit" width="100" height="100" patternUnits="userSpaceOnUse">
              <path d="M 0 50 L 100 50 M 50 0 L 50 100" fill="none" stroke="cyan" strokeWidth="1" />
              <circle cx="50" cy="50" r="2" fill="cyan" />
            </pattern>
            <rect width="100%" height="100%" fill="url(#circuit)" />
          </svg>
        </div>
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-scan"></div>
        {circuitNodes.map((node) => (
          <motion.div
            key={node}
            className="absolute rounded-full"
            style={{
              width: Math.random() * 6 + 2,
              height: Math.random() * 6 + 2,
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              background: Math.random() > 0.5 ? '#22d3ee' : '#a855f7',
            }}
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.3, 0.8, 0.3],
            }}
            transition={{
              duration: Math.random() * 4 + 2,
              repeat: Infinity,
              repeatType: 'reverse',
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col min-h-screen">
        {/* Header */}
        <div className="p-6 border-b border-cyan-400/30 bg-black/50 backdrop-blur-lg">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-lg flex items-center justify-center">
                <span className="text-lg font-bold">Ψ</span>
              </div>
              <div>
                <h1 className="text-2xl font-light bg-gradient-to-r from-cyan-300 to-purple-400 bg-clip-text text-transparent">
                  NEURAL_HABIT_AI
                </h1>
                <div className="text-cyan-300/70 font-mono text-sm flex items-center">
                  <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
                  SYSTEM_INITIALIZATION
                </div>
              </div>
            </div>
            <div className="text-right font-mono text-sm">
              <div className="text-green-400">USER: {user?.name?.toUpperCase() || 'OPERATOR'}</div>
              <div className="text-cyan-300/50">PROTOCOL: v2.1.3</div>
            </div>
          </div>
        </div>

        {/* Terminal Section */}
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="w-full max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-black/60 backdrop-blur-lg border border-cyan-400/30 rounded-xl p-8 shadow-2xl shadow-cyan-400/10"
            >
              {/* Header */}
              <div className="flex items-center space-x-4 mb-8">
                <div className="relative">
                  <div className="w-16 h-16 bg-gradient-to-br from-cyan-400 to-purple-500 rounded-2xl flex items-center justify-center">
                    <span className="text-2xl">🧠</span>
                  </div>
                  {isInitialized && (
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full border-2 border-black"
                    />
                  )}
                </div>
                <div>
                  <h2 className="text-2xl font-mono text-cyan-300">NEURAL_ASSISTANT</h2>
                  <p className="text-cyan-300/70 font-mono text-sm">AI-Powered Habit Optimization</p>
                </div>
              </div>

              {/* Terminal */}
              <div className="bg-black border border-cyan-400/50 rounded-lg p-6 font-mono h-48 overflow-y-auto scrollbar-hide">
                <div className="flex items-center space-x-2 mb-4">
                  <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                  <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                  <span className="text-cyan-300/50 text-sm ml-2">terminal_neural_ai</span>
                </div>

                {displayedLines.map((line, i) => (
                  <div key={i} className="text-cyan-300">
                    <span className="text-green-400">➜</span> {line}
                  </div>
                ))}
                {lineIndex < introText.length && (
                  <div>
                    <span className="text-green-400">➜</span>{' '}
                    <span className="text-cyan-300">{currentLine}</span>
                    <span className="text-cyan-400 animate-pulse">_</span>
                  </div>
                )}
              </div>

              {/* Continue Button */}
              {showContinueButton && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mt-8 text-center"
                >
                  <button
                    onClick={handleContinue}
                    className="px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-500 text-black font-mono rounded-lg 
                      hover:from-cyan-400 hover:to-purple-400 transition-all duration-300
                      shadow-lg shadow-cyan-500/25 hover:shadow-cyan-500/40
                      border border-cyan-400/50 hover:border-cyan-300"
                  >
                    ⚡ ACCESS_DASHBOARD →
                  </button>
                  <p className="mt-3 text-cyan-300/50 font-mono text-sm">
                    Neural interface ready for habit optimization
                  </p>
                </motion.div>
              )}
            </motion.div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-cyan-400/20 bg-black/50 backdrop-blur-lg text-center font-mono text-xs text-cyan-300/50">
          <div className="flex items-center justify-center space-x-4">
            <span className="flex items-center">
              <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full mr-2 animate-pulse"></span>
              NEURAL_NETWORK_ACTIVE
            </span>
            <span>|</span>
            <span>ENCRYPTION: AES-256</span>
            <span>|</span>
            <span>PROTOCOL_VERSION: 2.1.3</span>
          </div>
        </div>
      </div>
    </div>
  )
}
