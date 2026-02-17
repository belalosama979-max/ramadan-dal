import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useGame } from '../context/GameContext';

const Layout = ({ children }) => {
  const { user, logout } = useGame();
  const navigate = useNavigate();

  const handleLogout = () => {
      logout();
      navigate('/name');
  };
  return (
    <div className="min-h-screen relative overflow-hidden font-arabic flex flex-col bg-gradient-to-br from-[#0F3D2E] to-[#14532D]">
      
      {/* Background Pattern */}
      <div 
        className="absolute inset-0 z-0 opacity-[0.02] pointer-events-none mix-blend-overlay"
        style={{
            backgroundImage: "url('/islamic-pattern.png')",
            backgroundSize: '400px',
            backgroundRepeat: 'repeat'
        }}
      ></div>

      {/* Header */}
      <header className="relative z-10 w-full py-6 px-8 flex justify-between items-center bg-white/5 backdrop-blur-md shadow-sm border-b border-white/10">
        <Link to="/" className="flex items-center gap-5 group">
            <img 
                src="/dal-logo.png" 
                alt="Dal Club Logo" 
                className="h-16 w-auto transition-transform group-hover:scale-105 duration-300 drop-shadow-md"
            />
            <div className="flex flex-col">
                <span className="font-extrabold text-3xl text-white tracking-wide drop-shadow-sm">نادي دال</span>
                <span className="text-sm text-white/80 font-medium tracking-wider">بداية ... لكل ريادة</span>
            </div>
        </Link>
        
        {/* Logout Button */}
        {user && (
            <button 
                onClick={handleLogout}
                className="text-white/80 hover:text-white px-4 py-2 rounded-lg hover:bg-white/10 transition text-sm font-medium"
            >
                تسجيل خروج
            </button>
        )}
        {/* Simple Navigation or User Info could go here */}
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex-grow flex flex-col items-center justify-center p-4 w-full max-w-5xl mx-auto">
        {children}
      </main>

      {/* Footer */}
      <footer className="relative z-10 py-10 text-center text-white/40 text-sm font-medium border-t border-white/5 mt-auto">
        <p>© {new Date().getFullYear()} نادي دال - جميع الحقوق محفوظة</p>
      </footer>
    </div>
  );
};

export default Layout;
