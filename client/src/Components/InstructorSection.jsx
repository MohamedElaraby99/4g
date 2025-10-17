import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { getFeaturedInstructors } from '../Redux/Slices/InstructorSlice';
import { getCoursesByInstructor } from '../Redux/Slices/CourseSlice';
import { FaGraduationCap, FaStar, FaUsers, FaBook, FaClock, FaLinkedin, FaTwitter, FaFacebook, FaWhatsapp, FaTimes, FaAward, FaArrowRight, FaEye, FaSort, FaFilter } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import { generateImageUrl } from "../utils/fileUtils";
import { placeholderImages } from "../utils/placeholderImages";

const InstructorSection = () => {
  const dispatch = useDispatch();
  const { featuredInstructors, loading } = useSelector((state) => state.instructor);
  const { instructorCourses, instructorCoursesLoading } = useSelector((state) => state.course);
  const [selectedInstructor, setSelectedInstructor] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showCourses, setShowCourses] = useState(false);
  const [sortBy, setSortBy] = useState('featured');
  const [sortOrder, setSortOrder] = useState('-1');
  const [showSortOptions, setShowSortOptions] = useState(false);

  useEffect(() => {
    dispatch(getFeaturedInstructors({ sortBy, sortOrder }));
  }, [dispatch, sortBy, sortOrder]);

  const handleSortChange = (newSortBy, newSortOrder = '-1') => {
    setSortBy(newSortBy);
    setSortOrder(newSortOrder);
    setShowSortOptions(false);
  };

  // Close sort options when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showSortOptions && !event.target.closest('.sort-dropdown')) {
        setShowSortOptions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showSortOptions]);

  const getCurrentSortLabel = () => {
    switch (sortBy) {
      case 'name':
        return sortOrder === '1' ? 'الاسم (أ-ي)' : 'الاسم (ي-أ)';
      case 'rating':
        return 'التقييم (الأعلى أولاً)';
      case 'students':
        return 'عدد الطلاب (الأكثر أولاً)';
      case 'experience':
        return 'الخبرة (الأكثر أولاً)';
      case 'created':
        return 'الأحدث أولاً';
      case 'featured':
      default:
        return 'المميزون أولاً';
    }
  };

  const handleInstructorClick = (instructor) => {
    setSelectedInstructor(instructor);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedInstructor(null);
    setShowCourses(false);
  };

  const handleShowCourses = (instructor) => {
    setSelectedInstructor(instructor);
    setShowCourses(true);
    dispatch(getCoursesByInstructor(instructor._id));
  };

  const handleImgError = (e) => {
    e.currentTarget.onerror = null;
    e.currentTarget.src = placeholderImages.avatar;
  };

  const renderStars = (rating) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <FaStar
          key={i}
          className={`text-sm ${i <= rating ? 'text-orange-400' : 'text-gray-300'}`}
        />
      );
    }
    return stars;
  };

  if (loading) {
    return (
      <section className="py-20 bg-white dark:bg-gray-900" dir="rtl">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-800 dark:text-white mb-6">
            تعلم من أفضل الخبراء
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-orange-500 to-orange-500 mx-auto mb-6"></div>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              مدرسونا المميزون لديهم خبرة واسعة ونهج تعليمي متميز لضمان تجربة تعليمية استثنائية
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 animate-pulse">
                <div className="w-full h-48 bg-gray-300 dark:bg-gray-600 rounded-lg mb-4"></div>
                <div className="h-6 bg-gray-300 dark:bg-gray-600 rounded mb-2"></div>
                <div className="h-4 bg-gray-300 dark:bg-gray-600 rounded mb-3"></div>
                <div className="h-3 bg-gray-300 dark:bg-gray-600 rounded w-3/4"></div>
              </div>
            ))}
          </div>
        </div>
      </section>
    );
  }

  return (
    <>
      <section className="py-20 bg-white dark:bg-gray-900" dir="rtl">
        <div className="container mx-auto px-4">
          {/* Header */}
          <div className="text-center mb-16">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-800 dark:text-white mb-6">
              تعلم من أفضل الخبراء
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-orange-500 to-orange-500 mx-auto mb-6"></div>
            <p className="text-xl text-gray-600 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
              مدرسونا المميزون لديهم خبرة واسعة ونهج تعليمي متميز لضمان تجربة تعليمية استثنائية
            </p>
          </div>

          {/* Sort Controls */}
          <div className="flex justify-end items-center mb-8">
            <div className="relative sort-dropdown">
              <button
                onClick={() => setShowSortOptions(!showSortOptions)}
                className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                <FaSort className="text-sm" />
                <span className="text-sm font-medium">{getCurrentSortLabel()}</span>
              </button>

              {showSortOptions && (
                <div className="absolute top-full right-0 mt-2 w-56 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-600 rounded-lg shadow-lg z-10">
                  <div className="p-3 border-b border-gray-200 dark:border-gray-600">
                    <h4 className="font-medium text-gray-800 dark:text-white text-sm">ترتيب المدرسين</h4>
                  </div>

                  {/* Featured First */}
                  <button
                    onClick={() => handleSortChange('featured')}
                    className={`w-full text-right px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 ${
                      sortBy === 'featured' ? 'bg-orange-50 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300' : 'text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    المميزون أولاً
                  </button>

                  {/* Sort by Name */}
                  <button
                    onClick={() => handleSortChange('name', '1')}
                    className={`w-full text-right px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 ${
                      sortBy === 'name' && sortOrder === '1' ? 'bg-orange-50 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300' : 'text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    الاسم (أ-ي)
                  </button>

                  <button
                    onClick={() => handleSortChange('name', '-1')}
                    className={`w-full text-right px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 ${
                      sortBy === 'name' && sortOrder === '-1' ? 'bg-orange-50 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300' : 'text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    الاسم (ي-أ)
                  </button>

                  {/* Sort by Rating */}
                  <button
                    onClick={() => handleSortChange('rating')}
                    className={`w-full text-right px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 ${
                      sortBy === 'rating' ? 'bg-orange-50 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300' : 'text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    التقييم (الأعلى أولاً)
                  </button>

                  {/* Sort by Students */}
                  <button
                    onClick={() => handleSortChange('students')}
                    className={`w-full text-right px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 ${
                      sortBy === 'students' ? 'bg-orange-50 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300' : 'text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    عدد الطلاب (الأكثر أولاً)
                  </button>

                  {/* Sort by Experience */}
                  <button
                    onClick={() => handleSortChange('experience')}
                    className={`w-full text-right px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 ${
                      sortBy === 'experience' ? 'bg-orange-50 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300' : 'text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    الخبرة (الأكثر أولاً)
                  </button>

                  {/* Sort by Creation Date */}
                  <button
                    onClick={() => handleSortChange('created', '-1')}
                    className={`w-full text-right px-4 py-2 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 ${
                      sortBy === 'created' && sortOrder === '-1' ? 'bg-orange-50 dark:bg-orange-900/30 text-orange-700 dark:text-orange-300' : 'text-gray-700 dark:text-gray-300'
                    }`}
                  >
                    الأحدث أولاً
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Instructors Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredInstructors.map((instructor, index) => (
              <div
                key={instructor._id}
                className="group bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 overflow-hidden border border-gray-100 dark:border-gray-700 hover:border-orange-200 dark:hover:border-orange-600 cursor-pointer"
                onClick={() => handleInstructorClick(instructor)}
              >
                {/* Large Instructor Photo - modern and fully visible */}
                <div className="relative w-full aspect-[3/4] bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-700 rounded-xl overflow-hidden flex items-center justify-center border-b border-gray-100 dark:border-gray-700">
                  {instructor.profileImage?.secure_url ? (
                    <img
                      src={generateImageUrl(instructor.profileImage.secure_url)}
                      alt={instructor.name || instructor.fullName}
                      className="w-full h-full object-contain p-2 transition-transform duration-300 group-hover:scale-105"
                      onError={handleImgError}
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center p-6">
                      <FaGraduationCap className="text-gray-400 dark:text-gray-500 text-6xl" />
                    </div>
                  )}
                </div>

                {/* Card Content */}
                <div className="p-6">
                  {/* Instructor Name */}
                  <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2 group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">
                    {instructor.name || instructor.fullName}
                  </h3>
                  
                  {/* Role/Specialization */}
                  <div className="inline-flex items-center px-3 py-1 rounded-full bg-orange-50 text-orange-700 dark:bg-orange-900/30 dark:text-orange-200 border border-orange-200 dark:border-orange-700 mb-3">
                    {instructor.specialization}
                  </div>
                  
                  {/* Brief Description */}
                  <p className="text-gray-500 dark:text-gray-500 text-sm leading-relaxed mb-4 line-clamp-3">
                    {instructor.bio || `${instructor.name || instructor.fullName} هو مدرس محترف مع خبرة واسعة في مجال ${instructor.specialization}. لديه نهج تعليمي متميز ويساعد الطلاب على تحقيق أهدافهم التعليمية.`}
                  </p>

                  {/* Action Buttons */}
                  <div className="flex justify-between items-center">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleShowCourses(instructor);
                      }}
                      className="flex items-center gap-2 px-4 py-2 bg-orange-100 hover:bg-orange-200 dark:bg-orange-900/30 dark:hover:bg-orange-900/50 text-orange-700 dark:text-orange-300 rounded-lg font-medium transition-colors duration-200 group-hover:scale-105"
                    >
                      <FaBook className="text-sm" />
                      <span>دوراته</span>
                    </button>
                    <div className="w-10 h-10 bg-gradient-to-r from-orange-500 to-orange-500 hover:from-orange-600 hover:to-orange-600 text-white rounded-full flex items-center justify-center transition-colors duration-200 group-hover:scale-110">
                      <FaArrowRight className="text-sm" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* View All Instructors Button */}
          <div className="text-center mt-16">
            <Link
              to="/instructors"
              className="inline-flex items-center px-8 py-3 bg-gradient-to-r from-orange-500 via-orange-600 to-orange-500 hover:from-orange-600 hover:via-orange-700 hover:to-orange-600 text-white rounded-xl font-semibold transition-all duration-200 transform hover:scale-105"
            >
              عرض جميع المدرسين
              <FaGraduationCap className="mr-2" />
            </Link>
          </div>
        </div>
      </section>

      {/* Instructor Profile Modal */}
      {showModal && selectedInstructor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={closeModal}>
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()} dir="rtl">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">الملف الشخصي للمدرس</h2>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
              >
                <FaTimes className="text-xl" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {/* Instructor Header */}
              <div className="text-center mb-8">
                {selectedInstructor.profileImage?.secure_url ? (
                  <div className="w-28 h-28 rounded-xl bg-gray-100 dark:bg-gray-700 mx-auto mb-4 overflow-hidden flex items-center justify-center ring-1 ring-gray-200 dark:ring-gray-600">
                    <img
                      src={generateImageUrl(selectedInstructor.profileImage.secure_url)}
                      alt={selectedInstructor.name}
                      className="max-w-full max-h-full object-contain"
                      onError={handleImgError}
                    />
                  </div>
                ) : (
                  <div className="w-32 h-32 bg-gray-200 dark:bg-gray-600 rounded-xl flex items-center justify-center mx-auto mb-4 border-4 border-gray-200 dark:border-gray-600 shadow-lg">
                    <FaGraduationCap className="text-gray-400 dark:text-gray-500 text-4xl" />
                  </div>
                )}
                
                <h3 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">
                  {selectedInstructor.name}
                </h3>
                
                <div className="inline-flex items-center bg-gradient-to-r from-orange-100 to-orange-100 dark:from-orange-900/30 dark:to-orange-900/30 text-orange-700 dark:text-orange-300 px-4 py-2 rounded-full font-semibold mb-4">
                  <FaGraduationCap className="ml-2" />
                  {selectedInstructor.specialization}
                </div>

                {/* Rating */}
                <div className="flex items-center justify-center gap-2 mb-4">
                  {renderStars( 5)}
                  <span className="text-gray-600 dark:text-gray-400 font-semibold">
                    ({ 5})
                  </span>
                </div>
              </div>

              {/* Bio */}
              {selectedInstructor.bio && (
                <div className="mb-8">
                  <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">نبذة عن المدرس</h4>
                  <p className="text-gray-600 dark:text-gray-300 leading-relaxed text-right">
                    {selectedInstructor.bio}
                  </p>
                </div>
              )}

              {/* Education */}
              {selectedInstructor.education && (
                <div className="mb-8">
                  <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">المؤهل العلمي</h4>
                  <p className="text-gray-600 dark:text-gray-300 text-right">
                    {selectedInstructor.education}
                  </p>
                </div>
              )}

              {/* Social Links */}
              {(() => {
                                 const hasSocialLinks = (
                   (selectedInstructor.socialLinks?.linkedin && selectedInstructor.socialLinks.linkedin.trim() !== '') ||
                   (selectedInstructor.socialLinks?.twitter && selectedInstructor.socialLinks.twitter.trim() !== '') ||
                   (selectedInstructor.socialLinks?.facebook && selectedInstructor.socialLinks.facebook.trim() !== '') ||
                   (selectedInstructor.socialLinks?.whatsapp && selectedInstructor.socialLinks.whatsapp.trim() !== '')
                 );
                
                if (!hasSocialLinks) return null;
                
                return (
                  <div className="mb-8">
                    <h4 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">روابط التواصل</h4>
                    <div className="flex items-center justify-center gap-4">
                      {selectedInstructor.socialLinks?.linkedin && selectedInstructor.socialLinks.linkedin.trim() !== '' && (
                        <a
                          href={selectedInstructor.socialLinks.linkedin}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-500 hover:from-orange-600 hover:to-orange-600 text-white rounded-full flex items-center justify-center transition-colors"
                        >
                          <FaLinkedin className="text-sm" />
                        </a>
                      )}
                      {selectedInstructor.socialLinks?.twitter && selectedInstructor.socialLinks.twitter.trim() !== '' && (
                        <a
                          href={selectedInstructor.socialLinks.twitter}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-500 hover:from-orange-600 hover:to-orange-600 text-white rounded-full flex items-center justify-center transition-colors"
                        >
                          <FaTwitter className="text-sm" />
                        </a>
                      )}
                                             {selectedInstructor.socialLinks?.facebook && selectedInstructor.socialLinks.facebook.trim() !== '' && (
                         <a
                           href={selectedInstructor.socialLinks.facebook}
                           target="_blank"
                           rel="noopener noreferrer"
                           className="w-12 h-12 bg-gradient-to-r from-orange-500 to-orange-500 hover:from-orange-600 hover:to-orange-600 text-white rounded-full flex items-center justify-center transition-colors"
                         >
                           <FaFacebook className="text-sm" />
                         </a>
                       )}
                      {selectedInstructor.socialLinks?.whatsapp && selectedInstructor.socialLinks.whatsapp.trim() !== '' && (
                        <a
                          href={`https://wa.me/${selectedInstructor.socialLinks.whatsapp.replace(/[^0-9]/g, '')}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="w-12 h-12 bg-green-600 hover:bg-green-700 text-white rounded-full flex items-center justify-center transition-colors"
                        >
                          <FaWhatsapp className="text-sm" />
                        </a>
                      )}
                    </div>
                  </div>
                );
              })()}

              {/* Featured Badge */}
              {selectedInstructor.featured && (
                <div className="text-center mb-6">
                  <div className="inline-flex items-center bg-gradient-to-r from-orange-400 to-orange-500 text-white px-6 py-3 rounded-full font-bold">
                    <FaAward className="ml-2" />
                    مدرس مميز
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex gap-4">
                <button
                  onClick={closeModal}
                  className="flex-1 bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-800 dark:text-white py-3 rounded-xl font-semibold transition-colors"
                >
                  إغلاق
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Instructor Courses Modal */}
      {showCourses && selectedInstructor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4" onClick={closeModal}>
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()} dir="rtl">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
              <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                دورات {selectedInstructor.name}
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 transition-colors"
              >
                <FaTimes className="text-xl" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              {instructorCoursesLoading ? (
                <div className="text-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
                  <p className="text-gray-600 dark:text-gray-400">جاري تحميل الدورات...</p>
                </div>
              ) : instructorCourses && instructorCourses.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {instructorCourses.map((course) => (
                    <div key={course._id} className="bg-gray-50 dark:bg-gray-700 rounded-xl p-6 hover:shadow-lg transition-shadow duration-300">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <h3 className="text-lg font-bold text-gray-800 dark:text-white mb-2 line-clamp-2">
                            {course.title}
                          </h3>
                          <p className="text-sm text-gray-600 dark:text-gray-300 mb-3 line-clamp-2">
                            {course.description}
                          </p>
                          <div className="flex items-center gap-4 text-sm text-gray-500 dark:text-gray-400">
                            <span className="flex items-center gap-1">
                              <FaBook className="w-3 h-3" />
                              {course.stage?.name || 'غير محدد'}
                            </span>
                            <span className="flex items-center gap-1">
                              <FaClock className="w-3 h-3" />
                              {(course.directLessons?.length || 0) + 
                               (course.units?.reduce((total, unit) => total + (unit.lessons?.length || 0), 0) || 0)} درس
                            </span>
                          </div>
                        </div>
                        {course.image?.secure_url && (
                          <div className="w-16 h-16 rounded-lg overflow-hidden ml-4 flex-shrink-0">
                            <img
                              src={generateImageUrl(course.image.secure_url)}
                              alt={course.title}
                              className="w-full h-full object-cover"
                              onError={handleImgError}
                            />
                          </div>
                        )}
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-orange-600 dark:text-orange-400">
                          {course.subject?.title || 'غير محدد'}
                        </span>
                        <Link
                          to={`/courses/${course._id}`}
                          className="flex items-center gap-2 px-4 py-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium transition-colors duration-200"
                        >
                          <FaEye className="w-4 h-4" />
                          <span>عرض الدورة</span>
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">📚</div>
                  <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2">
                    لا توجد دورات متاحة
                  </h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    لم يقم هذا المدرس بإنشاء أي دورات بعد
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default InstructorSection; 