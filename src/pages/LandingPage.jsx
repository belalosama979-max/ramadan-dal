import React from 'react';
import { Link } from 'react-router-dom';
import { useGame } from '../context/GameContext';

const LandingPage = () => {
  const { user } = useGame();

  return (
    <div className="text-center flex flex-col items-center animate-fade-in space-y-8">
      
      {/* Hero Section */}
      <div className="relative mb-8">
        <img 
            src="/crescent-moon.png" 
            alt="Ramadan Crescent" 
            className="w-32 h-32 md:w-48 md:h-48 mx-auto animate-bounce-slow drop-shadow-xl"
        />
      </div>

      <h1 className="text-6xl md:text-8xl font-extrabold text-white mb-6 drop-shadow-[0_4px_4px_rgba(0,0,0,0.25)] tracking-wide leading-tight">
        فوازير رمضان
      </h1>
      
      <p className="text-2xl md:text-3xl text-white/90 font-medium max-w-2xl leading-relaxed drop-shadow-sm">
        شاركنا المعرفة واربح معنا في مسابقات نادي الرجال الرمضانية
      </p>

      {/* Call to Action */}
      <div className="pt-12">
        <Link 
            to={user ? "/question" : "/name"} 
            className="group relative inline-flex items-center justify-center px-12 py-5 text-xl font-bold text-primary-dark bg-[#FCD34D] rounded-full transition-all duration-200 hover:-translate-y-1 hover:shadow-[0_0_20px_rgba(252,211,77,0.4)] overflow-hidden"
        >
          <span className="relative z-10">{user ? 'تابع المسابقة' : 'ابدأ الآن'}</span>
          <svg 
            className="w-6 h-6 mr-2 transform rotate-180 transition-transform group-hover:translate-x-1" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </Link>
      </div>

    </div>
  );
};

export default LandingPage;
