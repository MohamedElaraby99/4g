import React, { useEffect, useState } from 'react';
import { FaArrowRight, FaPlay, FaStar, FaUsers, FaGraduationCap, FaAward, FaRocket, FaGlobe, FaFlask, FaAtom, FaMicroscope, FaLightbulb } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { useSelector } from 'react-redux';
import logo from '../assets/logo.png';

const AnimatedHero = ({ onGetStarted }) => {
  const [isVisible, setIsVisible] = useState(false);
  const user = useSelector((state) => state.auth.data);

  useEffect(() => {
    setIsVisible(true);
  }, []);

  const stats = [
    { icon: FaUsers, number: "5K+", label: "طلاب مسجلين", color: "text-blue-600" },
    { icon: FaFlask, number: "200+", label: "تجربة كيميائية", color: "text-green-600" },
    { icon: FaStar, number: "4.9", label: "متوسط التقييم", color: "text-blue-600" },
    { icon: FaAward, number: "15+", label: "سنوات خبرة", color: "text-purple-600" }
  ];

  const buttonText = 'استكشف الدورات';

  const handleExploreCourses = () => {
    // Navigate to courses page
    window.location.href = '/courses';
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-blue-50 via-white to-cyan-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900" dir="rtl">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        {/* Large Blue Shape - Main Background Element */}
        <div className="absolute top-0 left-0 w-[400px] h-[400px] md:w-[600px] md:h-[600px] lg:w-[800px] lg:h-[800px] bg-gradient-to-br from-blue-600 via-cyan-500 to-teal-500 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-pulse"></div>
        
        {/* Secondary Blue Shapes */}
        <div className="absolute top-20 right-20 w-48 h-48 md:w-96 md:h-96 bg-blue-400 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-blob"></div>
        <div className="absolute bottom-20 left-40 w-40 h-40 md:w-80 md:h-80 bg-cyan-400 rounded-full mix-blend-multiply filter blur-2xl opacity-30 animate-blob animation-delay-2000"></div>
        
        {/* Floating Geometric Elements */}
        <div className="absolute top-1/4 right-1/4 animate-float">
          <div className="w-4 h-4 md:w-6 md:h-6 bg-blue-500 rounded-full opacity-40"></div>
        </div>
        <div className="absolute top-1/3 left-1/4 animate-float animation-delay-2000">
          <div className="w-6 h-6 md:w-8 md:h-8 bg-cyan-500 rounded-full opacity-40"></div>
        </div>
        <div className="absolute bottom-1/4 right-1/3 animate-float animation-delay-4000">
          <div className="w-3 h-3 md:w-4 md:h-4 bg-teal-400 rounded-full opacity-40"></div>
        </div>
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
                <FaGraduationCap className="w-6 h-6 md:w-8 md:h-8 text-blue-500" />
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
                onClick={handleExploreCourses}
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

      {/* Additional Floating Elements */}
      <div className="absolute bottom-10 right-10 animate-float">
        <div className="w-3 h-3 md:w-4 md:h-4 bg-blue-500 rounded-full opacity-30"></div>
      </div>
      <div className="absolute top-10 left-10 animate-float animation-delay-4000">
        <div className="w-4 h-4 md:w-6 md:h-6 bg-cyan-500 rounded-full opacity-30"></div>
      </div>
    </section>
  );
};

export default AnimatedHero; 