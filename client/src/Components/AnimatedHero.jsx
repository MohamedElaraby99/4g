import React, { useEffect, useState } from 'react';
import { FaArrowRight, FaPlay, FaStar, FaUsers, FaGraduationCap, FaAward, FaRocket, FaGlobe, FaFlask, FaAtom, FaMicroscope, FaLightbulb } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import character from '../assets/character.webp';

const AnimatedHero = ({ onGetStarted }) => {
  const [isVisible, setIsVisible] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const user = useSelector((state) => state.auth.data);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  // Check for dark mode
  useEffect(() => {
    const checkDarkMode = () => {
      const isDark = document.documentElement.classList.contains('dark');
      setDarkMode(isDark);
    };

    // Check initially
    checkDarkMode();

    // Watch for changes
    const observer = new MutationObserver(checkDarkMode);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['class']
    });

    return () => observer.disconnect();
  }, []);

 
  const buttonText = 'ابدأ المذاكرة دلوقتي';

  const handleExploreCourses = () => {
    // Navigate to courses page
    window.location.href = '/courses';
  };

  return (
    <section 
      className="relative min-h-screen flex items-center justify-center overflow-hidden" 
      dir="rtl" 
      style={{
        background: darkMode 
          ? 'linear-gradient(135deg, #1f2937 0%, #111827 50%, #1f2937 100%)'
          : 'linear-gradient(135deg, #FFF5F0 0%, #FFFFFF 50%, #FFF5F0 100%)'
      }}
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        {/* Large orange Shape - Main Background Element */}
        <div className="absolute top-0 left-0 w-[400px] h-[400px] md:w-[600px] md:h-[600px] lg:w-[800px] lg:h-[800px] rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse" style={{background: 'linear-gradient(135deg, #FF6600 0%, #B51E00 50%, #FF6600 100%)'}}></div>
        
        {/* Secondary orange Shapes */}
        <div className="absolute top-20 right-20 w-48 h-48 md:w-96 md:h-96 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-blob" style={{background: '#FF6600'}}></div>
        <div className="absolute bottom-20 left-40 w-40 h-40 md:w-80 md:h-80 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-blob animation-delay-2000" style={{background: '#B51E00'}}></div>
        
        {/* Floating Geometric Elements */}
        <div className="absolute top-1/4 right-1/4 animate-float">
          <div className="w-4 h-4 md:w-6 md:h-6 rounded-full opacity-40" style={{background: '#FF6600'}}></div>
        </div>
        <div className="absolute top-1/3 left-1/4 animate-float animation-delay-2000">
          <div className="w-6 h-6 md:w-8 md:h-8 rounded-full opacity-40" style={{background: '#4C4C4C'}}></div>
        </div>
        <div className="absolute bottom-1/4 right-1/3 animate-float animation-delay-4000">
          <div className="w-3 h-3 md:w-4 md:h-4 rounded-full opacity-40" style={{background: '#B51E00'}}></div>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        {/* Hero Section - Character as Main Focus */}
        <div className="text-center mb-16">
          <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`}>
            {/* Main Character - Central Focus */}
            <div className="flex justify-center mb-12">
              <div className={`transition-all duration-1000 delay-200 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
                <div className="relative">
                  {/* Character Background Effect - Enhanced */}
                  <div className="absolute inset-0 rounded-full blur-3xl opacity-40 animate-pulse" style={{background: 'linear-gradient(135deg, #FF6600 0%, #B51E00 50%, #FF6600 100%)'}}></div>
                  
                  {/* Character Container - Larger and More Prominent */}
                  <div className="relative">
                    <img
                      src={character} 
                      alt="4G Platform Character" 
                      className="w-64 h-64 md:w-80 md:h-80 lg:w-96 lg:h-96 object-contain drop-shadow-2xl animate-float"
                      style={{
                        filter: 'drop-shadow(0 20px 40px rgba(255, 102, 0, 0.4))'
                      }}
                    />
                  </div>
                  <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 w-24 md:w-32 lg:w-40 h-0.5 bg-gradient-to-r from-transparent via-orange-400 to-transparent animate-pulse" style={{
                    background: 'linear-gradient(to right, transparent 0%, #FF6600 20%, #FF6600 80%, transparent 100%)',
                    boxShadow: '0 0 10px rgba(255, 102, 0, 0.6)'
                  }}></div>
                </div>
              </div>
            </div>
            
            {/* Title Section - Enhanced */}
            <div className="mt-2">
              {/* Main Title - Egyptian Style */}
              <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold mb-8" style={{color: darkMode ? '#ffffff' : '#1f2937'}}>
                أهلاً وسهلاً في منصة 4G
              </h1>
              
              {/* Subtitle - Egyptian Accent */}
              <div className="mt-6 flex items-center justify-center gap-4">
                <FaLightbulb className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12" style={{color: '#FF6600'}} />
                <p className="text-2xl md:text-3xl lg:text-4xl font-medium" style={{color: darkMode ? '#e5e7eb' : '#333333'}}>
                  منصة تعليم مصرية لطلبة الإعدادي والثانوي
                </p>
                <FaGraduationCap className="w-8 h-8 md:w-10 md:h-10 lg:w-12 lg:h-12" style={{color: '#FF6600'}} />
              </div>
            </div>
          </div>
        </div>

        {/* Content Section */}
        <div className="max-w-5xl mx-auto">
          <div className={`transition-all duration-1000 delay-300 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
         
            {/* Description */}
            <div className="text-center mb-10">
              <div className="relative">
                <p className="text-lg md:text-xl lg:text-2xl leading-relaxed max-w-4xl mx-auto p-6 rounded-2xl backdrop-blur-sm shadow-lg" style={{
                  color: darkMode ? '#e5e7eb' : '#333333',
                  background: darkMode ? 'rgba(55, 65, 81, 0.8)' : 'rgba(255, 255, 255, 0.8)',
                  border: '1px solid #FF6600'
                }}>
                  منصة تعليم مصرية جامدة لطلبة الإعدادي والثانوي! بنقدملك شروحات تفاعلية حلوة، فيديوهات تعليمية ممتعة، امتحانات متنوعة، ومذكرات PDF عشان تتفوق في الدراسة وتخش الجامعة اللي نفسك فيها.
                </p>
                {/* Trust Badges - Egyptian Style */}
                <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
                  <span className="px-3 py-1 text-sm md:text-base rounded-full border" style={{
                    background: darkMode ? 'rgba(255, 102, 0, 0.2)' : 'rgba(255, 102, 0, 0.1)',
                    color: '#FF6600',
                    borderColor: '#FF6600'
                  }}>مطابق للمنهج المصري 100%</span>
                  <span className="px-3 py-1 text-sm md:text-base rounded-full border" style={{
                    background: darkMode ? 'rgba(181, 30, 0, 0.2)' : 'rgba(181, 30, 0, 0.1)',
                    color: '#B51E00',
                    borderColor: '#B51E00'
                  }}>تمارين وامتحانات تفاعلية جامدة</span>
                  <span className="px-3 py-1 text-sm md:text-base rounded-full border" style={{
                    background: darkMode ? 'rgba(76, 76, 76, 0.2)' : 'rgba(76, 76, 76, 0.1)',
                    color: '#4C4C4C',
                    borderColor: '#4C4C4C'
                  }}>مذكرات مراجعة PDF مجاناً</span>
                </div>
              </div>
            </div>

            {/* Connection Line from Character to Button */}
            <div className="relative flex justify-center mb-8">
              {/* Animated Connection Line */}
              <div className="relative w-1 h-16 md:h-20 bg-gradient-to-b from-transparent via-orange-400 to-orange-600 rounded-full animate-pulse" style={{
                background: 'linear-gradient(to bottom, transparent 0%, rgba(255, 102, 0, 0.3) 30%, rgba(255, 102, 0, 0.8) 70%, #FF6600 100%)',
                boxShadow: '0 0 10px rgba(255, 102, 0, 0.5)'
              }}>
                {/* Floating dots along the line */}
                <div className="absolute top-1/4 w-2 h-2 bg-orange-400 rounded-full animate-bounce" style={{
                  left: '-0.5px',
                  background: '#FF6600',
                  boxShadow: '0 0 8px rgba(255, 102, 0, 0.8)'
                }}></div>
                <div className="absolute top-1/2 w-2 h-2 bg-orange-400 rounded-full animate-bounce animation-delay-2000" style={{
                  left: '-0.5px',
                  background: '#FF6600',
                  boxShadow: '0 0 8px rgba(255, 102, 0, 0.8)'
                }}></div>
                <div className="absolute top-3/4 w-2 h-2 bg-orange-400 rounded-full animate-bounce animation-delay-4000" style={{
                  left: '-0.5px',
                  background: '#FF6600',
                  boxShadow: '0 0 8px rgba(255, 102, 0, 0.8)'
                }}></div>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="text-center mb-8 flex items-center justify-center gap-4 flex-wrap">
              <Link
                to="/courses"
                className="px-10 py-5 md:px-12 md:py-6 font-bold rounded-full text-lg md:text-xl backdrop-blur hover:shadow-lg transition-all flex items-center gap-3 relative"
                style={{
                  background: 'linear-gradient(135deg, #FF6600 0%, #B51E00 100%)',
                  color: '#FFFFFF',
                  border: '2px solid #FF6600',
                  boxShadow: '0 0 20px rgba(255, 102, 0, 0.4)'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'linear-gradient(135deg, #B51E00 0%, #FF6600 100%)';
                  e.target.style.boxShadow = '0 0 30px rgba(255, 102, 0, 0.6)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'linear-gradient(135deg, #FF6600 0%, #B51E00 100%)';
                  e.target.style.boxShadow = '0 0 20px rgba(255, 102, 0, 0.4)';
                }}
              >
                {/* Button connection point */}
                <div className="absolute -top-2 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-orange-400 rounded-full animate-pulse" style={{
                  background: '#FF6600',
                  boxShadow: '0 0 15px rgba(255, 102, 0, 0.8)'
                }}></div>
                <FaPlay style={{color: '#FFFFFF'}} /> يلا بنا نبدأ المذاكرة دلوقتي!
              </Link>
            </div>

           
          </div>
        </div>
      </div>

      {/* Additional Floating Elements */}
      <div className="absolute bottom-10 right-10 animate-float">
        <div className="w-3 h-3 md:w-4 md:h-4 rounded-full opacity-30" style={{background: '#FF6600'}}></div>
      </div>
      <div className="absolute top-10 left-10 animate-float animation-delay-4000">
        <div className="w-4 h-4 md:w-6 md:h-6 rounded-full opacity-30" style={{background: '#4C4C4C'}}></div>
      </div>
    </section>
  );
};

export default AnimatedHero; 