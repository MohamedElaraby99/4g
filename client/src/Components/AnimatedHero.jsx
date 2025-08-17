import React, { useEffect, useState } from 'react';
import { FaArrowRight, FaPlay, FaStar, FaUsers, FaGraduationCap, FaAward, FaRocket, FaGlobe, FaLightbulb, FaGraduationCap as FaGrad, FaBookOpen, FaChalkboardTeacher } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import logo from '../assets/logo.png';

const AnimatedHero = ({ onGetStarted }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const navigate = useNavigate();
  const { isAuthenticated, loading } = useSelector((state) => state.auth);

  useEffect(() => {
    setIsVisible(true);
    
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleButtonClick = () => {
    if (isAuthenticated) {
      navigate('/courses');
    } else {
      onGetStarted();
    }
  };

  const buttonText = loading ? 'جاري التحميل...' : (isAuthenticated ? 'ابدأ التعلم الآن' : 'سجل الآن');


  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900" dir="rtl">
      {/* Enhanced Animated Background Elements */}
      <div className="absolute inset-0">
        {/* Dynamic Background Shapes */}
        <div className="absolute top-0 left-0 w-[400px] h-[400px] md:w-[600px] md:h-[600px] lg:w-[800px] lg:h-[800px] bg-gradient-to-br from-blue-600 via-indigo-500 to-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        
        {/* Floating Orbs with Mouse Interaction */}
        <div 
          className="absolute top-20 right-20 w-48 h-48 md:w-96 md:h-96 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-blob"
          style={{
            transform: `translate(${(mousePosition.x - window.innerWidth / 2) * 0.02}px, ${(mousePosition.y - window.innerHeight / 2) * 0.02}px)`
          }}
        ></div>
        <div 
          className="absolute bottom-20 left-40 w-40 h-40 md:w-80 md:h-80 bg-gradient-to-r from-indigo-400 to-purple-400 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-blob animation-delay-2000"
          style={{
            transform: `translate(${(mousePosition.x - window.innerWidth / 2) * -0.01}px, ${(mousePosition.y - window.innerHeight / 2) * -0.01}px)`
          }}
        ></div>
        
        {/* Creative Geometric Elements */}
        <div className="absolute top-1/4 right-1/4 animate-float">
          <div className="w-4 h-4 md:w-6 md:h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full opacity-60 animate-pulse"></div>
        </div>
        <div className="absolute top-1/3 left-1/4 animate-float animation-delay-2000">
          <div className="w-6 h-6 md:w-8 md:h-8 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full opacity-60 animate-bounce"></div>
        </div>
        <div className="absolute bottom-1/4 right-1/3 animate-float animation-delay-4000">
          <div className="w-3 h-3 md:w-4 md:h-4 bg-gradient-to-r from-pink-400 to-rose-500 rounded-full opacity-60 animate-spin"></div>
        </div>
        
        {/* Creative Grid Pattern */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, rgba(59, 130, 246, 0.3) 1px, transparent 0)`,
            backgroundSize: '50px 50px'
          }}></div>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        {/* Enhanced Centered Logo Section */}
        <div className="text-center mb-16">
          <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`}>
            {/* Creative Logo Container */}
            <div className="relative inline-block group">
              {/* Multiple Glowing Background Effects */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-600 rounded-full blur-2xl opacity-30 animate-pulse"></div>
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 rounded-full blur-3xl opacity-20 animate-pulse animation-delay-1000"></div>
              
              {/* Enhanced Logo Container with Creative Border */}
              <div className="relative bg-gradient-to-br from-white via-blue-50 to-indigo-50 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800 rounded-full p-6 md:p-8 lg:p-10 shadow-2xl border-4 border-transparent bg-clip-padding transform hover:scale-110 transition-all duration-500 group-hover:shadow-blue-500/25">
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <div className="relative bg-gradient-to-br from-white via-blue-50 to-indigo-50 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800 rounded-full p-6 md:p-8 lg:p-10">
                  <img
                    src={logo} 
                    alt="4G Logo" 
                    className="w-24 h-24 md:w-32 md:h-32 lg:w-40 lg:h-40 object-contain drop-shadow-lg transform group-hover:rotate-3 transition-transform duration-500"
                  />
                </div>
              </div>
              
              {/* Enhanced Floating Decorative Elements */}
              <div className="absolute -top-2 -left-2 md:-top-4 md:-left-4 w-4 h-4 md:w-6 md:h-6 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full animate-bounce z-30 shadow-lg group-hover:scale-125 transition-transform duration-300"></div>
              <div className="absolute -bottom-2 -right-2 md:-bottom-4 md:-right-4 w-3 h-3 md:w-4 md:h-4 bg-gradient-to-r from-pink-400 to-rose-500 rounded-full animate-pulse z-30 shadow-lg group-hover:scale-125 transition-transform duration-300"></div>
              <div className="absolute top-1/2 -left-4 md:-left-8 w-2 h-2 md:w-3 md:h-3 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full animate-float z-30 shadow-lg group-hover:scale-125 transition-transform duration-300"></div>
              <div className="absolute top-1/2 -right-4 md:-right-8 w-2 h-2 md:w-3 md:h-3 bg-gradient-to-r from-purple-400 to-violet-500 rounded-full animate-float animation-delay-2000 z-30 shadow-lg group-hover:scale-125 transition-transform duration-300"></div>
              
              {/* Creative Sparkle Effects */}
              <div className="absolute -top-1 -right-1 md:-top-2 md:-right-2 w-2 h-2 md:w-3 md:h-3 bg-white rounded-full animate-ping opacity-75"></div>
              <div className="absolute -bottom-1 -left-1 md:-bottom-2 md:-left-2 w-2 h-2 md:w-3 md:h-3 bg-cyan-300 rounded-full animate-ping animation-delay-1000 opacity-75"></div>
            </div>
            
            {/* Enhanced 4G Title with Creative Typography */}
            <div className="mt-8 relative">
              {/* Background Glow Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 blur-3xl opacity-20 animate-pulse"></div>        
              {/* Creative Subtitle with Icons */}
              <div className="mt-4 flex items-center justify-center gap-3">
                <FaLightbulb className="w-6 h-6 md:w-8 md:h-8 text-yellow-500 animate-pulse" />
                <p className="text-xl md:text-2xl lg:text-3xl text-gray-600 dark:text-gray-400 font-medium">
                  منصة التعليم الذكي
                </p>
                <FaGrad className="w-6 h-6 md:w-8 md:h-8 text-blue-500 animate-bounce" />
              </div>
            </div>
          </div>
        </div>

        {/* Creative Content Section */}
        <div className="max-w-5xl mx-auto">
          <div className={`transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
         
            {/* Enhanced Description with Creative Elements */}
            <div className="text-center mb-10">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-100 to-indigo-100 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-2xl blur-xl opacity-50"></div>
                <p className="relative text-lg md:text-xl lg:text-2xl text-gray-600 dark:text-gray-400 leading-relaxed max-w-4xl mx-auto p-6 rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-blue-200 dark:border-blue-700 shadow-lg">
                  انضم إلى آلاف المتعلمين حول العالم وقم بتحويل حياتك المهنية من خلال دوراتنا الشاملة عبر الإنترنت المصممة من قبل خبراء الصناعة.
                </p>
              </div>
            </div>

            {/* Enhanced CTA Button with Creative Effects */}
            <div className="text-center mb-8">
              <button 
                onClick={handleButtonClick}
                disabled={loading}
                className={`group relative px-10 py-5 md:px-12 md:py-6 font-bold rounded-full text-lg md:text-xl shadow-2xl transition-all duration-500 transform hover:scale-110 ${
                  loading 
                    ? 'bg-gray-400 text-gray-200 cursor-not-allowed' 
                    : 'bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white hover:shadow-blue-500/50 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700'
                }`}
              >
                {/* Button Background Glow */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 rounded-full blur opacity-75 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <span className="relative flex items-center gap-4 justify-center">
                  {buttonText}
                  {!loading && (
                    <FaArrowRight className="group-hover:translate-x-2 group-hover:rotate-12 transition-all duration-500" />
                  )}
                </span>
                
                {/* Creative Button Border Animation */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-sm"></div>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Floating Elements with Mouse Interaction */}
      <div className="absolute bottom-10 right-10 animate-float">
        <div className="w-4 h-4 md:w-6 md:h-6 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full opacity-40 shadow-lg"></div>
      </div>
      <div className="absolute top-10 left-10 animate-float animation-delay-4000">
        <div className="w-5 h-5 md:w-7 md:h-7 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full opacity-40 shadow-lg"></div>
      </div>
      
      {/* Creative Corner Decorations */}
      <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-blue-400 to-transparent opacity-20 rounded-br-full"></div>
      <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-indigo-400 to-transparent opacity-20 rounded-tl-full"></div>
    </section>
  );
};

export default AnimatedHero; 