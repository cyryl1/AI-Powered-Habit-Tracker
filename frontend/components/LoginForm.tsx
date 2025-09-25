// "use client"

// import React, { useState } from 'react';

// const LoginForm = () => {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [message, setMessage] = useState('');
//   const [isError, setIsError] = useState(false);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setMessage('');
//     setIsError(false);

//     try {
//       const formData = new URLSearchParams();
//       formData.append('username', email); // FastAPI expects 'username' for OAuth2PasswordRequestForm
//       formData.append('password', password);

//       const response = await fetch('http://localhost:8000/api/v1/auth/login', {
//         method: 'POST',
//         headers: {
//           'Content-Type': 'application/x-www-form-urlencoded',
//         },
//         body: formData.toString(),
//       });

//       const data = await response.json();

//       if (response.ok) {
//         setMessage('Login successful!');
//         localStorage.setItem('access_token', data.access_token);
//         // Optionally redirect user or update UI
//         setEmail('');
//         setPassword('');
//       } else {
//         throw new Error(data.detail || 'Something went wrong during login.');
//       }
//     } catch (error) {
//       setMessage('Login failed: ' + error.message);
//       setIsError(true);
//     }
//   };

//   return (
//     <div className="flex items-center justify-center min-h-screen bg-gray-100">
//       <form onSubmit={handleSubmit} className="p-8 bg-white rounded shadow-md w-full max-w-sm">
//         <h2 className="text-2xl font-bold mb-6 text-center">Log In</h2>
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
//             Log In
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

// export default LoginForm;

"use client"

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

const LoginForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setMessage('');
    setIsError(false);
    setIsLoading(true);

    try {
      const formData = new URLSearchParams();
      formData.append('username', username); // or username if that's what your backend expects
      formData.append('password', password);

      const response = await fetch('http://localhost:8000/api/v1/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: formData.toString(),
        credentials: 'include', // Important for cookies
      });

      const meResponse = await fetch('http://localhost:8000/api/v1/users/me', {
        credentials: 'include'
      })
      console.log('ME endpoint: ', meResponse)

      if (response.ok) {
        setMessage('AUTHENTICATION_SUCCESSFUL: Access granted to neural network');
        
        // Redirect to dashboard after successful login
        setTimeout(() => {
          router.push('/dashboard');
        }, 1500);
        
        setUsername('');
        setPassword('');
      } else {
        const data = await response.json();
        throw new Error(data.detail || 'Authentication protocol failed.');
      }
    } catch (error) {
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
              <label htmlFor="email" className="block text-cyan-300 font-mono text-sm mb-3">
                <span className="text-green-400">⟳</span> UserName
              </label>
              <input
                type="username"
                id="username"
                className="w-full px-4 py-3 bg-black border border-gray-700 text-white font-mono rounded-none 
                         focus:border-green-400 focus:outline-none transition-all duration-300
                         hover:border-gray-500"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
                placeholder="Phantom"
              />
            </div>

            {/* Encryption Key Field */}
            <div>
              <label htmlFor="password" className="block text-cyan-300 font-mono text-sm mb-3">
                <span className="text-green-400">⚡</span> Password
              </label>
              <input
                type="password"
                id="password"
                className="w-full px-4 py-3 bg-black border border-gray-700 text-white font-mono rounded-none 
                         focus:border-green-400 focus:outline-none transition-all duration-300
                         hover:border-gray-500"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter security clearance(password)"
              />
            </div>

            {/* Security Check */}
            <div className="flex items-center space-x-3 p-3 bg-black border border-gray-700">
              <div className="w-4 h-4 border border-green-400 bg-green-400/20 flex items-center justify-center">
                <span className="text-green-400 text-xs">✓</span>
              </div>
              <span className="text-gray-400 font-mono text-sm">Biometric scan complete</span>
            </div>

            {/* Authentication Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-black border-2 border-green-400 text-green-300 font-mono 
                       hover:bg-green-400 hover:text-black hover:shadow-[0_0_20px_rgba(74,222,128,0.3)]
                       disabled:opacity-50 disabled:cursor-not-allowed
                       transition-all duration-300 relative group"
            >
              <span className="relative z-10">
                {isLoading ? 'AUTHENTICATING...' : 'REQUEST_ACCESS'}
              </span>
              <div className="absolute inset-0 bg-green-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
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
