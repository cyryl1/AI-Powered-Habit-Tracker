'use client';

import { useAuth } from "@/context/AuthContext";
import { usePathname } from 'next/navigation';

interface HeaderProps {
  toggleSidebar: () => void;
}

export default function Header({ toggleSidebar }: HeaderProps) {
  const { user } = useAuth();
  const pathname = usePathname();

  const getPageTitle = (path: string) => {
    switch (path) {
      case '/dashboard':
        return 'DASHBOARD';
      case '/habits':
        return 'HABIT_MATRIX';
      case '/ai-insights':
        return 'AI_INSIGHTS';
      case '/analytics':
        return 'NEURAL_ANALYTICS';
      case '/settings':
        return 'SYSTEM_CONFIG';
      default:
        return 'NEURAL_HABIT_AI';
    }
  };

  return (
    <div className="mb-8 p-6 border-b border-cyan-400/20">
      <div className="flex justify-between items-center">
        <div className="flex items-center">
          {/* Mobile menu button */}
          <button 
            onClick={toggleSidebar} 
            className="text-cyan-300 mr-4 lg:hidden focus:outline-none"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
            </svg>
          </button>
          <div>
            <h1 className="text-4xl font-light mb-2">
              <span className="font-mono bg-gradient-to-r from-cyan-300 to-green-300 bg-clip-text text-transparent">
                {getPageTitle(pathname)}
              </span>
            </h1>
            <p className="text-gray-400 font-mono">
              Welcome back, <span className="text-cyan-300">{user?.name || user?.username || 'OPERATOR'}</span>. 
              System time: {new Date().toLocaleTimeString()}
            </p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-green-400 font-mono text-sm flex items-center justify-end">
            <span className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></span>
            SYSTEM_ONLINE
          </div>
          <div className="text-gray-400 font-mono text-xs">
            Active: {getPageTitle(pathname).replace('_', ' ')}
          </div>
        </div>
      </div>
    </div>
  );
}