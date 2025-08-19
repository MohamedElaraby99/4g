import React, { useEffect, useState } from 'react';
import { FaArrowRight, FaPlay, FaStar, FaUsers, FaGraduationCap, FaAward, FaRocket, FaGlobe, FaLightbulb, FaGraduationCap as FaGrad, FaBookOpen, FaChalkboardTeacher } from 'react-icons/fa';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import logo from '../assets/logo.png';

const AnimatedHero = ({ onGetStarted }) => {
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();
  const { isLoggedIn } = useSelector((state) => state.auth);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const handleButtonClick = () => {
    if (isLoggedIn) {
      navigate('/courses');
    } else {
      onGetStarted();
    }
  };

  const buttonText = isLoggedIn ? 'ابدأ التعلم الآن' : 'سجل الآن';

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-50 via-white to-indigo-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900" dir="rtl">
      {/* Simplified Background Elements */}
      <div className="absolute inset-0">
        {/* Simple Background Shape */}
        <div className="absolute top-0 left-0 w-[400px] h-[400px] md:w-[600px] md:h-[600px] lg:w-[800px] lg:h-[800px] bg-gradient-to-br from-blue-600 via-indigo-500 to-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-10"></div>
        
        {/* Single Floating Orb */}
        <div className="absolute top-20 right-20 w-48 h-48 md:w-96 md:h-96 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-full mix-blend-multiply filter blur-2xl opacity-20"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">
        {/* Simplified Logo Section */}
        <div className="text-center mb-16">
          <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-75'}`}>
            {/* Simple Logo Container */}
            <div className="relative inline-block">
              {/* Simple Background Effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-600 rounded-full blur-2xl opacity-20"></div>
              
              {/* Logo Container */}
              <div className="relative bg-gradient-to-br from-white via-blue-50 to-indigo-50 dark:from-gray-800 dark:via-gray-700 dark:to-gray-800 rounded-full p-6 md:p-8 lg:p-10 shadow-xl border-2 border-blue-200 dark:border-blue-700">
                <img
                  src={logo} 
                  alt="4G Logo" 
                  className="w-24 h-24 md:w-32 md:h-32 lg:w-40 lg:h-40 object-contain drop-shadow-lg"
                />
              </div>
            </div>
            
            {/* Simple 4G Title */}
            <div className="mt-8">
              {/* Simple Subtitle */}
              <div className="mt-4 flex items-center justify-center gap-3">
                <FaLightbulb className="w-6 h-6 md:w-8 md:h-8 text-yellow-500" />
                <p className="text-xl md:text-2xl lg:text-3xl text-gray-600 dark:text-gray-400 font-medium">
                  منصة التعليم الذكي
                </p>
                <FaGrad className="w-6 h-6 md:w-8 md:h-8 text-blue-500" />
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
                <p className="text-lg md:text-xl lg:text-2xl text-gray-600 dark:text-gray-400 leading-relaxed max-w-4xl mx-auto p-6 rounded-2xl bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-blue-200 dark:border-blue-700 shadow-lg">
                  انضم إلى آلاف المتعلمين حول العالم وقم بتحويل حياتك المهنية من خلال دوراتنا الشاملة عبر الإنترنت المصممة من قبل خبراء الصناعة.
                </p>
              </div>
            </div>

            {/* CTA Button */}
            <div className="text-center mb-8">
              <button 
                onClick={handleButtonClick}
                className="group relative px-10 py-5 md:px-12 md:py-6 font-bold rounded-full text-lg md:text-xl shadow-xl transition-all duration-300 transform hover:scale-105 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white hover:shadow-blue-500/30 hover:from-blue-700 hover:via-indigo-700 hover:to-purple-700"
              >
                <span className="relative flex items-center gap-4 justify-center">
                  {buttonText}
                  <FaArrowRight className="group-hover:translate-x-1 transition-transform duration-300" />
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AnimatedHero; 