'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/context/AuthContext'
import { motion, AnimatePresence } from 'framer-motion'
import { BASE_URL } from "../../config";

export default function OnboardingPage() {
  const router = useRouter()
  const { user, loading, fetchUser } = useAuth()
  const [step, setStep] = useState(1)
  const [formData, setFormData] = useState({
    name: '',
    personal_goals: ['', '', ''],
    preferred_categories: []
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState('')
  
  // Redirect if not logged in
  if (loading) return (
    <div className="min-h-screen bg-black flex items-center justify-center">
      <div className="text-cyan-300 text-lg">
        <span className="animate-pulse">Getting things ready...</span>
      </div>
    </div>
  )

  // Check if user exists before accessing its properties

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, name: e.target.value })
  }

  const handleGoalChange = (index: number, value: string) => {
    const updatedGoals = [...formData.personal_goals]
    updatedGoals[index] = value
    setFormData({ ...formData, personal_goals: updatedGoals })
  }

  const handleCategoryToggle = (category: string) => {
    const updatedCategories = [...formData.preferred_categories]
    if (updatedCategories.includes(category as never)) {
      setFormData({
        ...formData,
        preferred_categories: updatedCategories.filter(c => c !== category)
      })
    } else {
      setFormData({
        ...formData,
        preferred_categories: [...updatedCategories, category as never]
      })
    }
  }

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true)
      setError('')

      const filteredGoals = formData.personal_goals.filter(goal => goal.trim() !== '')
      
      if (filteredGoals.length === 0) {
        setError('Please enter at least one personal goal')
        setIsSubmitting(false)
        return
      }

      if (formData.preferred_categories.length === 0) {
        setError('Please select at least one habit category')
        setIsSubmitting(false)
        return
      }

      const response = await fetch(`${BASE_URL}users/onboarding`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          name: formData.name,
          personal_goals: filteredGoals,
          preferred_categories: formData.preferred_categories
        })
      })

      if (response.status === 401) {
        router.push('/login');
        throw new Error('Session expired. Please log in again.');
      }

      if (!response.ok) {
        throw new Error('Failed to save your information')
      }
      
      // Update user data in context after successful onboarding
      await fetchUser(); // Refresh user data to get updated onboarding status
      
      // Redirect to AI intro page instead of dashboard
      router.push('/ai-intro')
    } catch (err) {
      setError('Something went wrong. Please try again.')
      console.error(err)
    } finally {
      setIsSubmitting(false)
    }
  }

  const nextStep = () => {
    if (step === 1 && !formData.name) {
      setError('Please enter your name')
      return
    }
    if (step === 2 && !formData.personal_goals.some(goal => goal.trim() !== '')) {
      setError('Please enter at least one personal goal')
      return
    }
    setError('')
    setStep(step + 1)
  }

  const prevStep = () => {
    setError('')
    setStep(step - 1)
  }

  const habitCategories = [
    'Health & Fitness',
    'Productivity', 
    'Learning & Skills',
    'Mindfulness',
    'Finance',
    'Social',
    'Career',
    'Creativity'
  ]

  const stepTitles = {
    1: "Welcome! Let's get started",
    2: "What do you want to achieve?", 
    3: "Choose your focus areas"
  }

  const stepIcons = {
    1: "👋",
    2: "🎯",
    3: "📊"
  }

  return (
    <div className="min-h-screen bg-black text-white relative overflow-hidden">
      
      {/* Cyberpunk Background - Visual only */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Subtle grid */}
        <div className="absolute inset-0 opacity-5">
          <svg width="100%" height="100%">
            <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
              <path d="M 50 0 L 0 0 0 50" fill="none" stroke="cyan" strokeWidth="1"/>
            </pattern>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* Floating lights */}
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
        <div className="absolute bottom-1/3 right-1/3 w-1.5 h-1.5 bg-purple-400 rounded-full animate-pulse delay-1000"></div>
      </div>

      {/* Main Container */}
      <div className="relative z-10 flex flex-col min-h-screen">
        
        {/* Header */}
        <div className="p-6 border-b border-cyan-400/30 bg-black/50 backdrop-blur-lg">
          <div className="text-center">
            <h1 className="text-3xl font-light">
              <span className="bg-gradient-to-r from-cyan-300 to-purple-400 bg-clip-text text-transparent">
                Habit Intelligence
              </span>
            </h1>
            <p className="mt-2 text-cyan-300/70">Let's personalize your experience</p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="px-8 py-4 bg-black/30 border-b border-cyan-400/20">
          <div className="flex items-center justify-between mb-2 text-sm text-cyan-300">
            <span>Step {step} of 3</span>
            <span>{stepTitles[step as keyof typeof stepTitles]}</span>
          </div>
          <div className="flex space-x-2">
            {[1, 2, 3].map((i) => (
              <div 
                key={i} 
                className={`h-1 flex-1 rounded-full transition-all duration-500 ${
                  i <= step 
                    ? 'bg-gradient-to-r from-cyan-400 to-purple-400' 
                    : 'bg-cyan-400/20'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 flex items-center justify-center p-6">
          <div className="w-full max-w-2xl">
            <AnimatePresence mode="wait">
              <motion.div
                key={step}
                initial={{ opacity: 0, x: 50 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.3 }}
                className="bg-black/60 backdrop-blur-lg border border-cyan-400/30 rounded-xl p-8 shadow-2xl shadow-cyan-400/10"
              >
                
                {/* Step Header */}
                <div className="flex items-center space-x-3 mb-8">
                  <div className="w-12 h-12 bg-cyan-400/20 border border-cyan-400 rounded-lg flex items-center justify-center">
                    <span className="text-xl">{stepIcons[step as keyof typeof stepIcons]}</span>
                  </div>
                  <div>
                    <h2 className="text-2xl font-semibold text-white">{stepTitles[step as keyof typeof stepTitles]}</h2>
                    <p className="text-cyan-300/70">We'll use this to customize your habit tracker</p>
                  </div>
                </div>

                {/* Step 1: Name */}
                {step === 1 && (
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <label className="block text-lg font-medium text-white">
                        What should we call you?
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={handleNameChange}
                        className="w-full bg-black border border-cyan-400/50 p-4 rounded-lg text-white 
                                 focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400
                                 placeholder-gray-400 transition-all duration-300"
                        placeholder="Enter your name or nickname"
                      />
                      <p className="text-cyan-300/70 text-sm">
                        This helps us personalize your experience
                      </p>
                    </div>
                  </div>
                )}

                {/* Step 2: Goals */}
                {step === 2 && (
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <label className="block text-lg font-medium text-white">
                        What are your main goals?
                      </label>
                      <p className="text-cyan-300/70 text-sm mb-4">
                        List up to 3 things you'd like to achieve (e.g., "Exercise regularly", "Read more books")
                      </p>
                      {[0, 1, 2].map((index) => (
                        <div key={index} className="relative">
                          <input
                            type="text"
                            value={formData.personal_goals[index]}
                            onChange={(e) => handleGoalChange(index, e.target.value)}
                            className="w-full bg-black border border-purple-400/50 p-4 rounded-lg text-white 
                                     focus:outline-none focus:border-purple-400 focus:ring-1 focus:ring-purple-400
                                     placeholder-gray-400 transition-all duration-300"
                            placeholder={`Goal ${index + 1}`}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Step 3: Categories */}
                {step === 3 && (
                  <div className="space-y-6">
                    <div className="space-y-4">
                      <label className="block text-lg font-medium text-white">
                        What areas would you like to focus on?
                      </label>
                      <p className="text-cyan-300/70 text-sm mb-4">
                        Select the categories that interest you most
                      </p>
                      <div className="grid grid-cols-2 gap-3">
                        {habitCategories.map((category) => (
                          <motion.div
                            key={category}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => handleCategoryToggle(category)}
                            className={`p-4 rounded-lg border-2 cursor-pointer transition-all duration-300 text-sm ${
                              formData.preferred_categories.includes(category as never)
                                ? 'bg-green-400/20 border-green-400 text-white shadow-lg shadow-green-400/20'
                                : 'border-cyan-400/30 text-gray-300 hover:border-cyan-400/50 hover:bg-cyan-400/10'
                            }`}
                          >
                            <div className="text-center font-medium">
                              {category}
                            </div>
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Error Display */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-6 p-4 border border-red-400/50 bg-red-400/10 rounded-lg"
                  >
                    <div className="text-red-300 flex items-center">
                      <span className="text-red-400 mr-2">⚠</span>
                      {error}
                    </div>
                  </motion.div>
                )}

                {/* Navigation Buttons */}
                <div className="flex justify-between items-center mt-8 pt-6 border-t border-cyan-400/20">
                  {step > 1 ? (
                    <button 
                      onClick={prevStep}
                      disabled={isSubmitting}
                      className="px-6 py-3 border border-cyan-400/50 text-cyan-300 rounded-lg 
                               hover:bg-cyan-400/10 hover:border-cyan-400 transition-all duration-300
                               disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      ← Back
                    </button>
                  ) : (
                    <div></div>
                  )}

                  {step < 3 ? (
                    <button 
                      onClick={nextStep}
                      className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-500 text-black font-semibold rounded-lg 
                               hover:from-cyan-400 hover:to-purple-400 transition-all duration-300
                               shadow-lg shadow-cyan-500/25 ml-auto"
                    >
                      Continue →
                    </button>
                  ) : (
                    <button 
                      onClick={handleSubmit}
                      disabled={isSubmitting}
                      className="px-6 py-3 bg-gradient-to-r from-green-500 to-cyan-500 text-black font-semibold rounded-lg 
                               hover:from-green-400 hover:to-cyan-400 transition-all duration-300
                               shadow-lg shadow-green-500/25 ml-auto flex items-center space-x-2
                               disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isSubmitting ? (
                        <>
                          <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin"></div>
                          <span>Setting up your account...</span>
                        </>
                      ) : (
                        <>
                          <span>Get Started</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-cyan-400/20 bg-black/50 backdrop-blur-lg">
          <div className="text-center text-sm text-cyan-300/50">
            <div className="flex items-center justify-center space-x-4">
              <span className="flex items-center">
                <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full mr-2 animate-pulse"></span>
                AI Habit Tracker
              </span>
              <span>•</span>
              <span>Step {step} of 3</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}