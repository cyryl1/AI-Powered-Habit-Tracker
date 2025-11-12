// import Image from "next/image";
// import Link from 'next/link';

// export default function Home() {
//   return (
//     <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex flex-col items-center justify-center relative overflow-hidden">
//       {/* Animated Background Elements */}
//       <div className="absolute inset-0 overflow-hidden">
//         <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-r from-violet-500 to-purple-600 rounded-full blur-3xl opacity-20 animate-pulse"></div>
//         <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full blur-3xl opacity-20 animate-pulse delay-1000"></div>
//         <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-r from-indigo-400 to-purple-500 rounded-full blur-3xl opacity-10 animate-pulse delay-500"></div>
//       </div>

//       {/* Main Content */}
//       <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        
//         {/* Logo/Brand */}
//         <div className="mb-8">
//           <div className="w-20 h-20 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-2xl flex items-center justify-center shadow-2xl mb-4 mx-auto">
//             <span className="text-3xl font-bold text-white">✓</span>
//           </div>
//           <div className="bg-gradient-to-r from-cyan-400 to-purple-500 bg-clip-text text-transparent text-sm font-semibold tracking-widest">
//             TRANSFORM YOUR ROUTINES
//           </div>
//         </div>

//         {/* Main Heading */}
//         <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold mb-6 leading-tight">
//           <span className="bg-gradient-to-r from-white to-cyan-100 bg-clip-text text-transparent">
//             Build Better
//           </span>
//           <br />
//           <span className="bg-gradient-to-r from-cyan-400 to-purple-400 bg-clip-text text-transparent">
//             Habits with AI
//           </span>
//         </h1>

//         {/* Subtitle */}
//         <p className="text-xl lg:text-2xl text-gray-200 max-w-3xl mb-10 leading-relaxed font-light">
//           Intelligent habit tracking that learns from your progress. Get personalized insights, 
//           stay motivated, and achieve your goals faster with AI-powered guidance.
//         </p>

//         {/* Feature Highlights */}
//         <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 max-w-4xl">
//           {[
//             { icon: "📊", title: "Smart Analytics", desc: "AI-driven progress insights" },
//             { icon: "🎯", title: "Personalized Goals", desc: "Custom habit recommendations" },
//             { icon: "🚀", title: "Motivation Engine", desc: "Stay inspired to continue" }
//           ].map((feature, index) => (
//             <div key={index} className="bg-white/5 backdrop-blur-lg rounded-2xl p-6 border border-white/10 hover:bg-white/10 transition-all duration-300">
//               <div className="text-3xl mb-3">{feature.icon}</div>
//               <h3 className="font-semibold text-white mb-2">{feature.title}</h3>
//               <p className="text-gray-300 text-sm">{feature.desc}</p>
//             </div>
//           ))}
//         </div>

//         {/* CTA Buttons */}
//         <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6 mb-16">
//           <Link 
//             href="/signup" 
//             className="group relative px-8 py-4 bg-gradient-to-r from-cyan-500 to-purple-500 font-bold rounded-2xl shadow-2xl hover:shadow-cyan-500/25 hover:scale-105 transition-all duration-300 ease-out"
//           >
//             <span className="relative z-10">Start Your Journey</span>
//             <div className="absolute inset-0 bg-gradient-to-r from-cyan-600 to-purple-600 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
//           </Link>
          
//           <Link 
//             href="/login" 
//             className="group px-8 py-4 border-2 border-white/20 text-white font-bold rounded-2xl backdrop-blur-lg hover:bg-white/10 hover:border-white/30 hover:scale-105 transition-all duration-300 ease-out"
//           >
//             <span className="bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent">
//               Existing User
//             </span>
//           </Link>
//         </div>

//         {/* Social Proof/Stats */}
//         <div className="flex flex-wrap justify-center gap-8 text-gray-300">
//           {[
//             { number: "10K+", label: "Active Users" },
//             { number: "92%", label: "Success Rate" },
//             { number: "50K+", label: "Habits Tracked" }
//           ].map((stat, index) => (
//             <div key={index} className="text-center">
//               <div className="text-2xl font-bold text-white">{stat.number}</div>
//               <div className="text-sm opacity-80">{stat.label}</div>
//             </div>
//           ))}
//         </div>
//       </div>

//       {/* Floating Elements */}
//       <div className="absolute bottom-10 left-10 w-4 h-4 bg-cyan-400 rounded-full opacity-60 animate-bounce"></div>
//       <div className="absolute top-20 right-20 w-6 h-6 bg-purple-400 rounded-full opacity-40 animate-pulse"></div>
//       <div className="absolute top-40 left-20 w-3 h-3 bg-white rounded-full opacity-50 animate-bounce delay-700"></div>
//     </div>
//   );
// }

import { BASE_URL } from "@/config";
import Image from "next/image";
import Link from 'next/link';

export default function Home() {

  const handleTest = async () => {
    try {
      const res = await fetch(`${BASE_URL}/`, {  // ✅ Fixed: Added parentheses
        method: 'GET',
        credentials: 'include',
      });
      console.log(res);
    } catch (error) {
      console.error("Error:", error);
    }
  }
  return (
    <div className="min-h-screen bg-black flex flex-col items-center justify-center relative overflow-hidden py-10">
      
      {/* Geometric Background Patterns */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Binary code animation subtle background */}
        <div className="absolute inset-0 opacity-[0.02]">
          <div className="animate-pulse">
            {Array.from({ length: 20 }).map((_, i) => (
              <div key={i} className="text-green-400 text-xs font-mono opacity-20">
                101010101010101010101010101010
              </div>
            ))}
          </div>
        </div>
        
        {/* Circuit board lines */}
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

        {/* Floating AI neurons */}
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-cyan-400 rounded-full opacity-60 animate-float">
          <div className="absolute inset-0 bg-cyan-400 rounded-full animate-ping opacity-30"></div>
        </div>
        <div className="absolute top-3/4 right-1/3 w-1 h-1 bg-purple-400 rounded-full opacity-40 animate-float delay-1000"></div>
        <div className="absolute bottom-1/3 left-1/2 w-1.5 h-1.5 bg-green-400 rounded-full opacity-50 animate-float delay-2000"></div>
      </div>

      {/* Main Content */}
      <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto">
        
        {/* Abstract Logo */}
        <div className="mb-12">
          <div className="relative w-24 h-24 mx-auto mb-6">
            <div className="absolute inset-0 border-2 border-cyan-400 rotate-45 rounded-lg"></div>
            <div className="absolute inset-2 border-2 border-purple-400 rotate-12 rounded-lg"></div>
            <div className="absolute inset-4 border-2 border-green-400 -rotate-12 rounded-lg"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-2xl font-bold text-white cursor-pointer" onClick={handleTest}>Ψ</span>
            </div>
          </div>
          <div className="text-cyan-300 text-xs font-mono tracking-widest border border-cyan-400/30 px-3 py-1 rounded-full">
            NEURAL HABIT ARCHITECTURE
          </div>
        </div>

        {/* Main Heading with Typography Experiment */}
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-light mb-8 leading-tight">
          <span className="text-white font-normal">Habit</span>
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-green-300 font-light italic">Intelligence</span>
        </h1>

        {/* Subtitle with Cyber Feel */}
        <p className="text-lg lg:text-xl text-gray-300 max-w-3xl mb-12 leading-relaxed font-mono border-l-2 border-cyan-400 pl-4 text-left">
          <span className="text-cyan-300">&gt;</span> AI-driven behavior pattern analysis. 
          Neural networks optimize your routine. Predictive motivation algorithms.
        </p>

        {/* Unique Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 max-w-5xl">
          {[
            { 
              icon: "⟳", 
              title: "Pattern Recognition", 
              desc: "AI detects your habit cycles and optimizes timing",
              color: "cyan"
            },
            { 
              icon: "⚡", 
              title: "Adaptive Motivation", 
              desc: "Dynamic encouragement based on your psychology",
              color: "purple"
            },
            { 
              icon: "📈", 
              title: "Predictive Analytics", 
              desc: "Forecast your success probability and obstacles",
              color: "green"
            }
          ].map((feature, index) => (
            <div key={index} className={`group relative p-6 border border-${feature.color}-400/20 bg-black hover:bg-gradient-to-br hover:from-${feature.color}-400/5 hover:to-transparent transition-all duration-500`}>
              <div className={`text-4xl mb-4 text-${feature.color}-300`}>{feature.icon}</div>
              <h3 className={`font-mono text-lg text-${feature.color}-300 mb-3`}>{feature.title}</h3>
              <p className="text-gray-400 text-sm font-mono leading-relaxed">{feature.desc}</p>
              <div className={`absolute bottom-0 left-0 w-0 group-hover:w-full h-0.5 bg-gradient-to-r from-${feature.color}-400 to-transparent transition-all duration-500`}></div>
            </div>
          ))}
        </div>

        {/* Cyberpunk-style CTA Buttons */}
        <div className="flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-6 mb-20">
          <Link 
            href="/signup" 
            className="group relative px-8 py-4 bg-black border-2 border-cyan-400 text-cyan-300 font-mono rounded-none hover:bg-cyan-400 hover:text-black transition-all duration-300 hover:shadow-[0_0_20px_rgba(34,211,238,0.5)]"
          >
            <span className="relative z-10">INITIALIZE_PROFILE</span>
            <div className="absolute inset-0 bg-cyan-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
          </Link>
          
          <Link 
            href="/login" 
            className="group px-8 py-4 border-2 border-green-400 text-green-300 font-mono rounded-none hover:bg-green-400 hover:text-black transition-all duration-300 hover:shadow-[0_0_20px_rgba(74,222,128,0.3)]"
          >
            ACCESS_SYSTEM
          </Link>
        </div>

        {/* Data Stream Visualization */}
        <div className="relative w-full max-w-2xl h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent mb-12">
          <div className="absolute -top-1 left-0 w-3 h-3 bg-cyan-400 rounded-full animate-pulse"></div>
        </div>

        {/* Minimal Stats */}
        <div className="flex flex-wrap justify-center gap-12 text-gray-400 font-mono text-sm">
          {[
            { number: "247", label: "AI_MODELS_ACTIVE" },
            { number: "∞", label: "PATTERNS_ANALYZED" },
            { number: "99.7%", label: "PREDICTION_ACCURACY" }
          ].map((stat, index) => (
            <div key={index} className="text-center group cursor-default">
              <div className="text-2xl font-bold text-cyan-300 mb-1 group-hover:text-green-300 transition-colors duration-300">{stat.number}</div>
              <div className="text-xs opacity-70">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Terminal-style Footer */}
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
        <div className="text-gray-500 font-mono text-xs flex items-center space-x-2">
          <span className="text-green-400">➜</span>
          <span className="animate-pulse">_</span>
          <span>system_ready_for_new_user</span>
        </div>
      </div>
    </div>
  );
}
