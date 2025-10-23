// "use client"

// import React, { useState } from 'react';

// const SignupForm = () => {
//   const [email, setEmail] = useState('');
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');
//   const [message, setMessage] = useState('');
//   const [isError, setIsError] = useState(false);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setMessage('');
//     setIsError(false);

//     try {
//       const response = await fetch('http://localhost:8000/register', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ email, username, password }),
//       });

//       const data = await response.json();

//       if (response.ok) {
//         setMessage('Signup successful! Welcome, ' + username + '!');
//         setEmail('');
//         setUsername('');
//         setPassword('');
//       } else {
//         throw new Error(data.detail || 'Something went wrong during signup.');
//       }
//     } catch (error) {
//       setMessage('Signup failed: ' + error.message);
//       setIsError(true);
//     }
//   };

//   return (
//     <div className="flex items-center justify-center min-h-screen bg-gray-100">
//       <form onSubmit={handleSubmit} className="p-8 bg-white rounded shadow-md w-full max-w-sm">
//         <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>
//         <div className="mb-4">
//           <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">Email:</label>
//           <input
//             type="email"
//             id="email"
//             className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             required
//           />
//         </div>
//         <div className="mb-4">
//           <label htmlFor="username" className="block text-gray-700 text-sm font-bold mb-2">Username:</label>
//           <input
//             type="text"
//             id="username"
//             className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
//             value={username}
//             onChange={(e) => setUsername(e.target.value)}
//             required
//           />
//         </div>
//         <div className="mb-6">
//           <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">Password:</label>
//           <input
//             type="password"
//             id="password"
//             className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight focus:outline-none focus:shadow-outline"
//             value={password}
//             onChange={(e) => setPassword(e.target.value)}
//             required
//           />
//         </div>
//         <div className="flex items-center justify-between">
//           <button
//             type="submit"
//             className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
//           >
//             Sign Up
//           </button>
//         </div>
//         {message && (
//           <p className={`text-center mt-4 ${isError ? 'text-red-500' : 'text-green-500'}`}>
//             {message}
//           </p>
//         )}
//       </form>
//     </div>
//   );
// };

// export default SignupForm;

"use client"

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const SignupForm = () => {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // New state for password visibility
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage('');
    setIsError(false);
    setIsLoading(true);

    try {
      const response = await fetch('http://localhost:8000/api/v1/users/register', { // Updated endpoint
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, username, password }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('PROFILE_INITIALIZED: Neural onboarding sequence ready, ' + username + '!');
        
        // Auto-login after successful registration
        const loginResponse = await fetch('http://localhost:8000/api/v1/users/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
          },
          body: `username=${encodeURIComponent(username)}&password=${encodeURIComponent(password)}`,
          credentials: 'include',
        });

        if (loginResponse.ok) {
          setTimeout(() => {
            router.push('/onboarding');
          }, 2000);
        }

        setEmail('');
        setUsername('');
        setPassword('');
      } else {
        throw new Error(data.detail || 'Registration failed.');
      }
    } catch (error) {
      setMessage('SYSTEM_ERROR: ' + (error instanceof Error ? error.message : 'An unknown error occurred'));
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center relative overflow-hidden">
      {/* Cyberpunk Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Grid Pattern */}
        <div className="absolute top-0 left-0 w-full h-full">
          <svg width="100%" height="100%" className="opacity-5">
            <defs>
              <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
                <path d="M 50 0 L 0 0 0 50" fill="none" stroke="green" strokeWidth="1" opacity="0.2"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
        </div>

        {/* Floating Nodes */}
        <div className="absolute top-1/4 right-1/4 w-1 h-1 bg-cyan-400 rounded-full opacity-60 animate-pulse"></div>
        <div className="absolute bottom-1/3 left-1/3 w-1.5 h-1.5 bg-purple-400 rounded-full opacity-40 animate-pulse delay-1000"></div>
        <div className="absolute top-2/3 left-2/3 w-1 h-1 bg-green-400 rounded-full opacity-50 animate-pulse delay-2000"></div>
      </div>

      {/* Main Form Container */}
      <div className="relative z-10 w-full max-w-md mx-4">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="absolute inset-0 border-2 border-cyan-400 rotate-45 rounded-lg"></div>
          <div className="absolute inset-2 border-2 border-purple-400 rotate-12 rounded-lg"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-2xl font-bold text-cyan-300">Ψ</span>
          </div>
          <h1 className="text-3xl font-light text-white mb-2">
            <span className="font-mono">CREATE_PROFILE</span>
          </h1>
          <p className="text-gray-400 font-mono text-sm">
            Initialize your neural habit architecture
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="bg-black border border-cyan-400/30 rounded-lg p-8 backdrop-blur-sm">
          <div className="space-y-6">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-cyan-300 font-mono text-sm mb-3">
                <span className="text-green-400">➜</span> EMAIL_ADDRESS
              </label>
              <input
                type="email"
                id="email"
                className="w-full px-4 py-3 bg-black border border-gray-700 text-white font-mono rounded-none 
                         focus:border-cyan-400 focus:outline-none transition-all duration-300
                         hover:border-gray-500"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="user@neuralnetwork.ai"
              />
            </div>

            {/* Username Field */}
            <div>
              <label htmlFor="username" className="block text-cyan-300 font-mono text-sm mb-3">
                <span className="text-green-400">➜</span> USER_IDENTIFIER
              </label>
              <input
                type="text"
                id="username"
                className="w-full px-4 py-3 bg-black border border-gray-700 text-white font-mono rounded-none 
                         focus:border-cyan-400 focus:outline-none transition-all duration-300
                         hover:border-gray-500"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                placeholder="Enter your callsign"
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
                         focus:border-cyan-400 focus:outline-none transition-all duration-300
                         hover:border-gray-500 pr-10"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="••••••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-cyan-300 focus:outline-none"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? ' 🙈 ' : ' 👁 '} {/* Cyberpunk eye icon toggle */}
              </button>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-black border-2 border-cyan-400 text-cyan-300 font-mono 
                       hover:bg-cyan-400 hover:text-black hover:shadow-[0_0_20px_rgba(34,211,238,0.3)]
                       disabled:opacity-50 disabled:cursor-not-allowed
                       transition-all duration-300 relative group"
            >
              <span className="relative z-10">
                {isLoading ? 'INITIALIZING...' : 'EXECUTE_REGISTRATION'}
              </span>
              <div className="absolute inset-0 bg-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
            </button>
          </div>

          {/* Message Display */}
          {message && (
            <div className={`mt-6 p-3 border font-mono text-sm ${
              isError 
                ? 'border-red-400/50 text-red-300 bg-red-400/10' 
                : 'border-green-400/50 text-green-300 bg-green-400/10'
            }`}>
              <span className="text-green-400">$</span> {message}
            </div>
          )}

          {/* Login Link */}
          <div className="mt-6 text-center">
            <p className="text-gray-400 font-mono text-sm">
              Existing operator?{' '}
              <Link href="/login" className="text-cyan-300 hover:text-cyan-200 underline transition-colors">
                ACCESS_SYSTEM
              </Link>
            </p>
          </div>
        </form>

        {/* Footer Terminal */}
        <div className="mt-8 text-center">
          <div className="text-gray-500 font-mono text-xs flex items-center justify-center space-x-2">
            <span className="text-green-400">➜</span>
            <span className="animate-pulse">_</span>
            <span>awaiting_user_input</span>
          </div>
        </div>
      </div>

      {/* Connection Lines */}
      <div className="absolute bottom-10 left-10 w-px h-20 bg-gradient-to-t from-cyan-400 to-transparent opacity-30"></div>
      <div className="absolute top-10 right-10 w-px h-20 bg-gradient-to-b from-purple-400 to-transparent opacity-30"></div>
    </div>
  );
};

export default SignupForm;
