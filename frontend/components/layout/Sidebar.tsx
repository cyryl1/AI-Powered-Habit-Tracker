'use client';

import { useAuth } from "@/context/AuthContext";
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';

interface SidebarProps {
  isOpen: boolean;
  setIsOpen: (isOpen: boolean) => void;
}

export default function Sidebar({ isOpen, setIsOpen }: SidebarProps) {
  const { user, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  const handleLogout = async () => {
    try {
      await fetch('http://localhost:8000/api/v1/users/logout', {
        method: 'POST',
        credentials: 'include'
      });
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      logout();
      router.push('/login');
    }
  };

  const navigationItems = [
    { id: 'dashboard', label: 'DASHBOARD', icon: '📊', href: '/dashboard' },
    { id: 'habits', label: 'HABIT_MATRIX', icon: '💪', href: '/habits' },
    { id: 'ai-insights', label: 'AI_INSIGHTS', icon: '🧠', href: '/ai-insights' },
    { id: 'analytics', label: 'NEURAL_ANALYTICS', icon: '📈', href: '/analytics' },
    { id: 'settings', label: 'SYSTEM_CONFIG', icon: '⚙️', href: '/settings' }
  ];

  return (
    <>
      {/* Overlay for mobile when sidebar is open */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
      <div className={`fixed left-0 top-0 h-full w-64 bg-black/80 backdrop-blur-lg border-r border-cyan-400/20 z-50 transform lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out`}>
        <div className="p-6 border-b border-cyan-400/20">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-cyan-400 to-purple-500 rounded-lg flex items-center justify-center">
              <span className="text-lg font-bold">Ψ</span>
            </div>
            <div>
              <div className="text-cyan-300 font-mono text-sm">NEURAL_HABIT_AI</div>
              <div className="text-gray-400 text-xs">v2.1.3</div>
            </div>
          </div>
        </div>

        <nav className="p-4 space-y-2">
          {navigationItems.map((item) => (
            <Link key={item.id} href={item.href} onClick={() => setIsOpen(false)}>
              <button
                className={`w-full text-left p-3 rounded-lg font-mono text-sm transition-all duration-300 ${
                  pathname === item.href
                    ? 'bg-cyan-400/20 text-cyan-300 border border-cyan-400/30' 
                    : 'text-gray-400 hover:text-cyan-200 hover:bg-cyan-400/10'
                }`}
              >
                <span className="mr-3">{item.icon}</span>
                {item.label}
              </button>
            </Link>
          ))}
        </nav>

        {/* User Info */}
        <div className="absolute bottom-4 left-4 right-4 p-4 border-t border-cyan-400/20">
          <div className="text-cyan-300 font-mono text-sm mb-2">
            OPERATOR: {user?.name || user?.username || user?.email?.split('@')[0] || 'USER'}
          </div>
          <button 
            onClick={handleLogout}
            className="w-full p-2 border border-red-400/30 text-red-300 font-mono text-xs hover:bg-red-400/10 transition-colors"
          >
            LOGOUT_SYSTEM
          </button>
        </div>
      </div>
    </>
  );
}