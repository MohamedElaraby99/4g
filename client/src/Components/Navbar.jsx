import React, { useEffect, useState } from "react";
import { FaBars, FaHome, FaUser, FaGraduationCap, FaBlog, FaQuestionCircle, FaSignOutAlt, FaPlus, FaList, FaInfoCircle, FaPhone, FaHistory, FaLightbulb, FaRocket } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logout } from "../Redux/Slices/AuthSlice";
import viteLogo from "../assets/images/vite.svg.png";
import logo from "../assets/logo.png";
import useScrollToTop from "../Helpers/useScrollToTop";
import CourseNotifications from "./CourseNotifications";

export default function Navbar() {
  const [darkMode, setDarkMode] = useState(
    localStorage.getItem("theme") === "light" ? false : true
  );
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { data: user, role } = useSelector((state) => state.auth);
  const location = useLocation();
  const dispatch = useDispatch();

  // Debug log commented to avoid noise on every render
  // console.log("🔍 Navbar - User state:", { user, role, hasUser: !!user?.fullName });

  // Use scroll to top utility
  useScrollToTop();

  const toggleDarkMode = () => {
    setDarkMode((prev) => !prev);
  };

  const toggleMenu = () => {
    // Trigger the Sidebar drawer instead of mobile menu
    const drawerToggle = document.getElementById('sidebar-drawer');
    
    if (drawerToggle) {
      console.log("Navbar burger clicked - toggling drawer");
      drawerToggle.checked = !drawerToggle.checked;
    } else {
      console.log("Drawer element not found");
    }
  };

  const handleLogout = () => {
    dispatch(logout());
    setIsMenuOpen(false);
  };

  const handleLogoClick = () => {
    // Navigate to home page and scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const element = document.querySelector("html");
    element.classList.remove("light", "dark");
    if (darkMode) {
      element.classList.add("dark");
      element.setAttribute("data-theme", "dark");
      localStorage.setItem("theme", "dark");
    } else {
      element.classList.add("light");
      element.setAttribute("data-theme", "light");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  // Set dark mode as default on first load
  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    const element = document.querySelector("html");
    
    if (!savedTheme) {
      setDarkMode(true);
      localStorage.setItem("theme", "dark");
      element.setAttribute("data-theme", "dark");
    } else {
      element.setAttribute("data-theme", savedTheme);
    }
  }, []);

  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
  }, [location]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isMenuOpen && !event.target.closest('.mobile-menu-container')) {
        setIsMenuOpen(false);
      }
    };

    if (isMenuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isMenuOpen]);

  const menuItems = [
    { name: "الرئيسية", path: "/", icon: FaHome },
    { name: "الكورسات ", path: "/subjects", icon: FaGraduationCap },
    { name: "الدورات", path: "/courses", icon: FaList },
    
    { name: "المدونة", path: "/blogs", icon: FaBlog },
    { name: "الأسئلة والأجوبة", path: "/qa", icon: FaQuestionCircle },
    { name: "تاريخ الامتحانات", path: "/exam-history", icon: FaHistory },
    { name: "حول", path: "/about", icon: FaInfoCircle },
    { name: "اتصل بنا", path: "/contact", icon: FaPhone },
  ];

  const adminMenuItems = [
    { name: "لوحة التحكم", path: "/admin", icon: FaUser },
    
    { name: "إدارة المستخدمين", path: "/admin/users", icon: FaUser },
    { name: "إدارة المدونة", path: "/admin/blogs", icon: FaBlog },
    { name: "إدارة الأسئلة والأجوبة", path: "/admin/qa", icon: FaQuestionCircle },
    { name: "إدارة المواد", path: "/admin/subjects", icon: FaGraduationCap },
  ];

  return (
    <nav className="sticky top-0 z-50 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 shadow-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-0.5">
                 <div className="flex justify-between items-center h-20 md:h-24">
          {/* Modern Logo */}
                     <Link to="/" onClick={handleLogoClick} className="flex items-center space-x-2 md:space-x-4 group logo-hover">
        
            <div className="relative">
              {/* Logo Image */}
                             <img 
                 src={logo} 
                 alt="منصة  the4g" 
                 className="w-16 h-16 md:w-20 md:h-20 object-contain group-hover:scale-110 transition-transform duration-300 dark:drop-shadow-[0_0_15px_rgba(255,255,255,0.3)] dark:group-hover:drop-shadow-[0_0_20px_rgba(255,255,255,0.5)]"
               />
            </div>
          
          </Link>

          {/* Right Side */}
          <div className="flex items-center space-x-4">
            {/* Theme Toggle */}
            <button 
              className="theme-toggle p-2 rounded-lg transition-colors duration-200 hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={toggleDarkMode}
              title="Toggles light & dark" 
              aria-label="auto" 
              aria-live="polite"
            >
              <svg className="sun-and-moon" aria-hidden="true" width="24" height="24" viewBox="0 0 24 24">
                <mask className="moon" id="moon-mask">
                  <rect x="0" y="0" width="100%" height="100%" fill="white" />
                  <circle cx="24" cy="10" r="6" fill="black" />
                </mask>
                <circle className="sun" cx="12" cy="12" r="6" mask="url(#moon-mask)" fill="currentColor" />
                <g className="sun-beams" stroke="currentColor">
                  <line x1="12" y1="1" x2="12" y2="3" />
                  <line x1="12" y1="21" x2="12" y2="23" />
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" />
                  <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                  <line x1="1" y1="12" x2="3" y2="12" />
                  <line x1="21" y1="12" x2="23" y2="12" />
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" />
                  <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                </g>
              </svg>
            </button>

            {/* Sign Up Button - ONLY show when NO user is logged in */}
            {!user?.fullName && (
              <Link
                to="/signup"
                className="inline-flex items-center gap-1 md:gap-2 px-2 md:px-4 py-1.5 md:py-2 rounded-xl md:rounded-2xl text-xs md:text-sm font-semibold text-white shadow-lg hover:shadow-xl transition-all duration-300 border"
                style={{
                  background: 'linear-gradient(90deg, #FF6600 0%, #B51E00 100%)',
                  borderColor: '#FF6600'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'linear-gradient(90deg, #B51E00 0%, #FF6600 100%)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'linear-gradient(90deg, #FF6600 0%, #B51E00 100%)';
                }}
              >
                <FaPlus className="w-3 h-3 md:w-4 md:h-4" />
                <span className="hidden sm:inline">سجل الآن</span>
                <span className="sm:hidden">سجل</span>
              </Link>
            )}

            {!user?.fullName && (
              <Link
                to="/login"
                className="inline-flex items-center gap-1 md:gap-2 px-2 md:px-4 py-1.5 md:py-2 rounded-xl md:rounded-2xl text-xs md:text-sm font-semibold border-2 transition-all duration-300 shadow-md hover:shadow-xl"
                style={{
                  borderColor: '#FF6600',
                  color: '#FF6600'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'linear-gradient(90deg, #FF6600 0%, #B51E00 100%)';
                  e.target.style.color = '#FFFFFF';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'transparent';
                  e.target.style.color = '#FF6600';
                }}
              >
                <FaUser className="w-3 h-3 md:w-4 md:h-4" />
                <span className="hidden sm:inline">تسجيل الدخول</span>
                <span className="sm:hidden">دخول</span>
              </Link>
            )}

            {/* Menu Button - Visible on all devices */}
            <div className="flex items-center space-x-3">  
              {/* Course Notifications - ONLY show when user is logged in */}
              {user?.fullName && <CourseNotifications />}
              
              {/* Burger Menu Button - ONLY show when user is logged in */}
              {user?.fullName && (
                <button
                  onClick={toggleMenu}
                  className="p-2.5 md:p-3 rounded-xl transition-all duration-300 shadow-lg hover:shadow-xl border"
                  style={{
                    background: 'linear-gradient(135deg, rgba(255, 102, 0, 0.1) 0%, rgba(181, 30, 0, 0.1) 100%)',
                    borderColor: '#FF6600'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = 'linear-gradient(135deg, rgba(255, 102, 0, 0.2) 0%, rgba(181, 30, 0, 0.2) 100%)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'linear-gradient(135deg, rgba(255, 102, 0, 0.1) 0%, rgba(181, 30, 0, 0.1) 100%)';
                  }}
                >
                  <FaBars className="w-4 h-4 md:w-5 md:h-5" style={{color: '#FF6600'}} />
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Mobile Menu - Enhanced Design */}
        <div
          className={`md:hidden mobile-menu-container transition-all duration-500 ease-in-out overflow-hidden ${
            isMenuOpen
              ? "max-h-screen opacity-100 visible"
              : "max-h-0 opacity-0 invisible"
          }`}
        >
          <div className="py-8 space-y-6 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
            {/* Navigation Links */}
            <div className="space-y-3">
              <div className="px-6 py-3">
                <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                  التنقل
                </p>
              </div>
              {menuItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center space-x-4 px-6 py-4 mx-4 rounded-2xl font-medium transition-all duration-300 mobile-menu-item ${
                    location.pathname === item.path
                      ? "shadow-lg"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                  }`}
                  style={location.pathname === item.path ? {
                    color: '#FF6600',
                    background: 'linear-gradient(90deg, rgba(255, 102, 0, 0.1) 0%, rgba(181, 30, 0, 0.1) 100%)'
                  } : {}}
                  onMouseEnter={(e) => {
                    if (location.pathname !== item.path) {
                      e.target.style.color = '#FF6600';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (location.pathname !== item.path) {
                      e.target.style.color = '';
                    }
                  }}
                >
                  <div className={`p-3 rounded-xl shadow-lg`} style={location.pathname === item.path ? {
                    background: 'linear-gradient(90deg, rgba(255, 102, 0, 0.2) 0%, rgba(181, 30, 0, 0.2) 100%)'
                  } : {
                    background: 'linear-gradient(90deg, #f3f4f6 0%, #e5e7eb 100%)'
                  }}>
                    <item.icon className="w-5 h-5" />
                  </div>
                  <span className="font-semibold">{item.name}</span>
                </Link>
              ))}
            </div>

            {/* User Menu Items */}
            {user && (
              <>
                <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                  <div className="px-6 py-4 mx-4 rounded-2xl shadow-lg" style={{background: 'linear-gradient(90deg, rgba(255, 102, 0, 0.1) 0%, rgba(181, 30, 0, 0.1) 100%)'}}>
                    <div className="flex items-center space-x-4">
                      <div className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-xl" style={{background: 'linear-gradient(90deg, #FF6600 0%, #B51E00 100%)'}}>
                        <span className="text-white font-bold text-lg">
                          {user.fullName?.charAt(0)?.toUpperCase() || "U"}
                        </span>
                      </div>
                      <div className="flex-1">
                        <p className="font-bold text-gray-900 dark:text-white text-lg">
                          {user.fullName}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {user.email}
                        </p>
                        <p className="text-xs font-semibold uppercase tracking-wider" style={{color: '#FF6600'}}>
                          {user.role}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Admin Menu */}
                {user.role === "ADMIN" && (
                  <div className="space-y-3">
                    <div className="px-6 py-3">
                      <p className="text-xs font-bold uppercase tracking-wider" style={{color: '#FF6600'}}>
                        لوحة الإدارة
                      </p>
                    </div>
                    {adminMenuItems.map((item) => (
                      <Link
                        key={item.path}
                        to={item.path}
                        className={`flex items-center space-x-4 px-6 py-4 mx-4 rounded-2xl font-medium transition-all duration-300 mobile-menu-item ${
                          location.pathname === item.path
                            ? "shadow-lg"
                            : "text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                        }`}
                        style={location.pathname === item.path ? {
                          color: '#FF6600',
                          background: 'linear-gradient(90deg, rgba(255, 102, 0, 0.1) 0%, rgba(181, 30, 0, 0.1) 100%)'
                        } : {}}
                        onMouseEnter={(e) => {
                          if (location.pathname !== item.path) {
                            e.target.style.color = '#FF6600';
                          }
                        }}
                        onMouseLeave={(e) => {
                          if (location.pathname !== item.path) {
                            e.target.style.color = '';
                          }
                        }}
                      >
                        <div className={`p-3 rounded-xl shadow-lg`} style={location.pathname === item.path ? {
                          background: 'linear-gradient(90deg, rgba(255, 102, 0, 0.2) 0%, rgba(181, 30, 0, 0.2) 100%)'
                        } : {
                          background: 'linear-gradient(90deg, #f3f4f6 0%, #e5e7eb 100%)'
                        }}>
                          <item.icon className="w-5 h-5" />
                        </div>
                        <span className="font-semibold">{item.name}</span>
                      </Link>
                    ))}
                  </div>
                )}

                {/* User Actions */}
                <div className="space-y-3">
                  <div className="px-6 py-3">
                    <p className="text-xs font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                      الحساب
                    </p>
                  </div>
                  <Link
                    to="/profile"
                    className="flex items-center space-x-4 px-6 py-4 mx-4 rounded-2xl font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800 transition-all duration-300 mobile-menu-item"
                    onMouseEnter={(e) => {
                      e.target.style.color = '#FF6600';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.color = '';
                    }}
                  >
                    <div className="p-3 rounded-xl shadow-lg" style={{background: 'linear-gradient(90deg, #f3f4f6 0%, #e5e7eb 100%)'}}>
                      <FaUser className="w-5 h-5" />
                    </div>
                    <span className="font-semibold">الملف الشخصي</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-4 px-6 py-4 mx-4 rounded-2xl font-medium text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 hover:bg-gradient-to-r hover:from-red-50 hover:to-pink-50 dark:hover:from-red-900/20 dark:hover:to-pink-900/20 transition-all duration-300 w-full text-left mobile-menu-item"
                  >
                    <div className="p-3 rounded-xl shadow-lg bg-gradient-to-r from-red-100 to-pink-100 dark:from-red-900/30 dark:to-pink-900/30">
                      <FaSignOutAlt className="w-5 h-5" />
                    </div>
                    <span className="font-semibold">تسجيل الخروج</span>
                  </button>
                </div>
              </>
            )}

            {/* Guest Actions */}
            {!user && (
              <div className="space-y-4 px-6">
                <div className="text-center mb-4">
                  <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2">
                    انضم إلينا الآن
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    ابدأ رحلة التعلم مع منصة  the4g
                  </p>
                </div>
                
                <Link
                  to="/login"
                  className="flex items-center justify-center gap-2 w-full px-4 py-2 text-center text-white rounded-xl font-semibold text-sm transition-all duration-300 transform hover:scale-105 mobile-menu-item shadow-lg hover:shadow-xl border-2"
                  style={{
                    background: 'linear-gradient(90deg, #FF6600 0%, #B51E00 100%)',
                    borderColor: '#FF6600'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = 'linear-gradient(90deg, #B51E00 0%, #FF6600 100%)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'linear-gradient(90deg, #FF6600 0%, #B51E00 100%)';
                  }}
                >
                  <FaUser className="w-4 h-4" />
                  تسجيل الدخول
                </Link>
                <Link
                  to="/signup"
                  className="flex items-center justify-center gap-2 w-full px-4 py-2 text-center border-2 rounded-xl font-semibold text-sm transition-all duration-300 mobile-menu-item shadow-lg hover:shadow-xl"
                  style={{
                    borderColor: '#FF6600',
                    color: '#FF6600'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = 'linear-gradient(90deg, #FF6600 0%, #B51E00 100%)';
                    e.target.style.color = '#FFFFFF';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'transparent';
                    e.target.style.color = '#FF6600';
                  }}
                >
                  <FaPlus className="w-4 h-4" />
                  إنشاء حساب جديد
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
