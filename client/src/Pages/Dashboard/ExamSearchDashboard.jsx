import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { FaSearch, FaFilter, FaEye, FaDownload, FaCalendar, FaUser, FaBook, FaClipboardList, FaTrophy, FaTimes } from 'react-icons/fa';
import Layout from '../../Layout/Layout';
import { axiosInstance } from '../../Helpers/axiosInstance';
import { toast } from 'react-hot-toast';

const ExamSearchDashboard = () => {
  const dispatch = useDispatch();
  const { data: userData } = useSelector((state) => state.auth);
  
  // State for search and filters
  const [searchTerm, setSearchTerm] = useState('');
  const [examType, setExamType] = useState('');
  const [courseFilter, setCourseFilter] = useState('');
  const [userFilter, setUserFilter] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [scoreFilter, setScoreFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  
  // State for data
  const [examResults, setExamResults] = useState([]);
  const [courses, setCourses] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalResults, setTotalResults] = useState(0);
  
  // State for pagination
  const [currentPage, setCurrentPage] = useState(1);
  const [resultsPerPage] = useState(20);
  
  // State for detailed view
  const [selectedResult, setSelectedResult] = useState(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);

  // Fetch initial data
  useEffect(() => {
    fetchCourses();
    fetchUsers();
    searchExamResults();
  }, []);

  // Fetch courses for filter
  const fetchCourses = async () => {
    try {
      const response = await axiosInstance.get('/courses');
      if (response.data.success) {
        setCourses(response.data.data || []);
      } else {
        setCourses([]);
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
      setCourses([]);
    }
  };

  // Fetch users for filter
  const fetchUsers = async () => {
    try {
      const response = await axiosInstance.get('/admin/users');
      if (response.data.success) {
        setUsers(response.data.data || []);
      } else {
        setUsers([]);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      setUsers([]);
    }
  };

  // Search exam results
  const searchExamResults = async (page = 1) => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: resultsPerPage.toString(),
        ...(searchTerm && { search: searchTerm }),
        ...(examType && { examType }),
        ...(courseFilter && { courseId: courseFilter }),
        ...(userFilter && { userId: userFilter }),
        ...(dateFrom && { dateFrom }),
        ...(dateTo && { dateTo }),
        ...(scoreFilter && { scoreFilter }),
        ...(statusFilter && { status: statusFilter })
      });

      const response = await axiosInstance.get(`/exam-results/search?${params}`);
      
      if (response.data.success) {
        setExamResults(response.data.data.results || []);
        setTotalResults(response.data.data.total || 0);
        setCurrentPage(page);
      }
    } catch (error) {
      console.error('Error searching exam results:', error);
      toast.error('فشل في البحث عن نتائج الامتحانات');
    } finally {
      setLoading(false);
    }
  };

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    searchExamResults(1);
  };

  // Handle filter change
  const handleFilterChange = () => {
    searchExamResults(1);
  };

  // Clear all filters
  const clearFilters = () => {
    setSearchTerm('');
    setExamType('');
    setCourseFilter('');
    setUserFilter('');
    setDateFrom('');
    setDateTo('');
    setScoreFilter('');
    setStatusFilter('');
    searchExamResults(1);
  };

  // Export results to CSV
  const exportToCSV = () => {
    if (examResults.length === 0) {
      toast.error('لا توجد نتائج للتصدير');
      return;
    }

    const headers = [
      'اسم المستخدم',
      'البريد الإلكتروني',
      'اسم الدورة',
      'نوع الامتحان',
      'النتيجة',
      'النسبة المئوية',
      'عدد الأسئلة الصحيحة',
      'إجمالي الأسئلة',
      'الوقت المستغرق',
      'تاريخ الامتحان',
      'الحالة'
    ];

    const csvData = examResults.map(result => [
      result.user?.fullName || result.user?.username || 'غير محدد',
      result.user?.email || 'غير محدد',
      result.course?.title || 'غير محدد',
      result.examType === 'training' ? 'تدريب' : 'امتحان نهائي',
      result.score || 0,
      `${result.percentage || 0}%`,
      result.correctAnswers || 0,
      result.totalQuestions || 0,
      `${result.timeTaken || 0} دقيقة`,
      new Date(result.completedAt).toLocaleDateString('ar-EG'),
      result.passed ? 'ناجح' : 'راسب'
    ]);

    const csvContent = [headers, ...csvData]
      .map(row => row.map(cell => `"${cell}"`).join(','))
      .join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `نتائج_الامتحانات_${new Date().toISOString().split('T')[0]}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // View result details
  const viewResultDetails = (result) => {
    setSelectedResult(result);
    setShowDetailsModal(true);
  };

  // Get score color
  const getScoreColor = (score) => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-blue-600';
    if (score >= 70) return 'text-yellow-600';
    if (score >= 50) return 'text-orange-600';
    return 'text-red-600';
  };

  // Get status badge
  const getStatusBadge = (passed) => {
    return passed ? (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
        <FaTrophy className="w-3 h-3 mr-1" />
        ناجح
      </span>
    ) : (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
        <FaTimes className="w-3 h-3 mr-1" />
        راسب
      </span>
    );
  };

  // Calculate pagination
  const totalPages = Math.ceil(totalResults / resultsPerPage);
  const startIndex = (currentPage - 1) * resultsPerPage + 1;
  const endIndex = Math.min(currentPage * resultsPerPage, totalResults);

  return (
    <Layout>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2 text-right">
              <FaClipboardList className="inline-block mr-3 text-blue-600" />
              البحث في نتائج الامتحانات
            </h1>
            <p className="text-gray-600 dark:text-gray-300 text-right">
              ابحث وعرض جميع نتائج الامتحانات للمستخدمين
            </p>
          </div>

          {/* Search and Filters */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
            <form onSubmit={handleSearch} className="space-y-6">
              {/* Search Bar */}
              <div className="flex gap-4">
                <div className="flex-1">
                  <div className="relative">
                    <FaSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="ابحث في النتائج..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pr-10 pl-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                </div>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-medium transition-colors"
                >
                  بحث
                </button>
                <button
                  type="button"
                  onClick={clearFilters}
                  className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-3 rounded-lg font-medium transition-colors"
                >
                  مسح الفلاتر
                </button>
              </div>

              {/* Filters Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {/* Exam Type Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 text-right">
                    نوع الامتحان
                  </label>
                  <select
                    value={examType}
                    onChange={(e) => {
                      setExamType(e.target.value);
                      handleFilterChange();
                    }}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">جميع الأنواع</option>
                    <option value="training">تدريب</option>
                    <option value="final">امتحان نهائي</option>
                  </select>
                </div>

                {/* Course Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 text-right">
                    الدورة
                  </label>
                  <select
                    value={courseFilter}
                    onChange={(e) => {
                      setCourseFilter(e.target.value);
                      handleFilterChange();
                    }}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">جميع الدورات</option>
                                         {Array.isArray(courses) && courses.map(course => (
                       <option key={course._id} value={course._id}>
                         {course.title}
                       </option>
                     ))}
                  </select>
                </div>

                {/* User Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 text-right">
                    المستخدم
                  </label>
                  <select
                    value={userFilter}
                    onChange={(e) => {
                      setUserFilter(e.target.value);
                      handleFilterChange();
                    }}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">جميع المستخدمين</option>
                                         {Array.isArray(users) && users.map(user => (
                       <option key={user._id} value={user._id}>
                         {user.fullName || user.username}
                       </option>
                     ))}
                  </select>
                </div>

                {/* Score Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 text-right">
                    النتيجة
                  </label>
                  <select
                    value={scoreFilter}
                    onChange={(e) => {
                      setScoreFilter(e.target.value);
                      handleFilterChange();
                    }}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">جميع النتائج</option>
                    <option value="90-100">90% - 100%</option>
                    <option value="80-89">80% - 89%</option>
                    <option value="70-79">70% - 79%</option>
                    <option value="60-69">60% - 69%</option>
                    <option value="50-59">50% - 59%</option>
                    <option value="0-49">0% - 49%</option>
                  </select>
                </div>

                {/* Date From */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 text-right">
                    من تاريخ
                  </label>
                  <input
                    type="date"
                    value={dateFrom}
                    onChange={(e) => {
                      setDateFrom(e.target.value);
                      handleFilterChange();
                    }}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Date To */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 text-right">
                    إلى تاريخ
                  </label>
                  <input
                    type="date"
                    value={dateTo}
                    onChange={(e) => {
                      setDateTo(e.target.value);
                      handleFilterChange();
                    }}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                {/* Status Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 text-right">
                    الحالة
                  </label>
                  <select
                    value={statusFilter}
                    onChange={(e) => {
                      setStatusFilter(e.target.value);
                      handleFilterChange();
                    }}
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">جميع الحالات</option>
                    <option value="passed">ناجح</option>
                    <option value="failed">راسب</option>
                  </select>
                </div>
              </div>
            </form>
          </div>

          {/* Results Summary */}
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <div className="text-right">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                  نتائج البحث
                </h2>
                <p className="text-gray-600 dark:text-gray-300">
                  عرض {startIndex} - {endIndex} من {totalResults} نتيجة
                </p>
              </div>
              <button
                onClick={exportToCSV}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2"
              >
                <FaDownload />
                تصدير CSV
              </button>
            </div>

            {/* Results Table */}
            {loading ? (
              <div className="text-center py-12">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                <p className="text-gray-600 dark:text-gray-300">جاري البحث...</p>
              </div>
            ) : examResults.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">📊</div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  لا توجد نتائج
                </h3>
                <p className="text-gray-600 dark:text-gray-300">
                  جرب تغيير معايير البحث أو الفلاتر
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        المستخدم
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        الدورة
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        نوع الامتحان
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        النتيجة
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        الحالة
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        التاريخ
                      </th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        الإجراءات
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {examResults.map((result, index) => (
                      <tr key={result._id || index} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <div className="h-10 w-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                                <FaUser className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                              </div>
                            </div>
                            <div className="mr-3 text-right">
                              <div className="text-sm font-medium text-gray-900 dark:text-white">
                                {result.user?.fullName || result.user?.username || 'غير محدد'}
                              </div>
                              <div className="text-sm text-gray-500 dark:text-gray-400">
                                {result.user?.email || 'غير محدد'}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 dark:text-white">
                            {result.course?.title || 'غير محدد'}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            result.examType === 'training' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-purple-100 text-purple-800'
                          }`}>
                            {result.examType === 'training' ? 'تدريب' : 'امتحان نهائي'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 dark:text-white">
                            <span className={`font-semibold ${getScoreColor(result.percentage)}`}>
                              {result.percentage}%
                            </span>
                            <div className="text-xs text-gray-500 dark:text-gray-400">
                              {result.correctAnswers}/{result.totalQuestions} سؤال صحيح
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          {getStatusBadge(result.passed)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          <div className="flex items-center gap-2">
                            <FaCalendar className="text-gray-400" />
                            {new Date(result.completedAt).toLocaleDateString('ar-EG')}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <button
                            onClick={() => viewResultDetails(result)}
                            className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300 flex items-center gap-1"
                          >
                            <FaEye />
                            عرض التفاصيل
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-6">
                <div className="text-sm text-gray-700 dark:text-gray-300">
                  صفحة {currentPage} من {totalPages}
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => searchExamResults(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    السابق
                  </button>
                  <button
                    onClick={() => searchExamResults(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    التالي
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Result Details Modal */}
        {showDetailsModal && selectedResult && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto m-4">
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    تفاصيل نتيجة الامتحان
                  </h3>
                  <button
                    onClick={() => setShowDetailsModal(false)}
                    className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-2xl"
                  >
                    <FaTimes />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* User Information */}
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-3">معلومات المستخدم</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">الاسم:</span>
                        <span className="text-gray-900 dark:text-white font-medium">
                          {selectedResult.user?.fullName || selectedResult.user?.username || 'غير محدد'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">البريد الإلكتروني:</span>
                        <span className="text-gray-900 dark:text-white font-medium">
                          {selectedResult.user?.email || 'غير محدد'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Course Information */}
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-3">معلومات الدورة</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">اسم الدورة:</span>
                        <span className="text-gray-900 dark:text-white font-medium">
                          {selectedResult.course?.title || 'غير محدد'}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">نوع الامتحان:</span>
                        <span className="text-gray-900 dark:text-white font-medium">
                          {selectedResult.examType === 'training' ? 'تدريب' : 'امتحان نهائي'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Exam Results */}
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-3">نتيجة الامتحان</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">النتيجة:</span>
                        <span className={`font-bold ${getScoreColor(selectedResult.percentage)}`}>
                          {selectedResult.percentage}%
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">الأسئلة الصحيحة:</span>
                        <span className="text-gray-900 dark:text-white font-medium">
                          {selectedResult.correctAnswers}/{selectedResult.totalQuestions}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">الحالة:</span>
                        {getStatusBadge(selectedResult.passed)}
                      </div>
                    </div>
                  </div>

                  {/* Time Information */}
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-3">معلومات الوقت</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">الوقت المستغرق:</span>
                        <span className="text-gray-900 dark:text-white font-medium">
                          {selectedResult.timeTaken} دقيقة
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">تاريخ الامتحان:</span>
                        <span className="text-gray-900 dark:text-white font-medium">
                          {new Date(selectedResult.completedAt).toLocaleString('ar-EG')}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Detailed Answers */}
                {selectedResult.answers && selectedResult.answers.length > 0 && (
                  <div className="mt-6">
                    <h4 className="font-semibold text-gray-900 dark:text-white mb-3">تفاصيل الإجابات</h4>
                    <div className="space-y-3">
                      {selectedResult.answers.map((answer, index) => (
                        <div key={index} className="bg-white dark:bg-gray-600 rounded-lg p-3 border border-gray-200 dark:border-gray-500">
                          <div className="flex items-center justify-between">
                            <span className="text-sm text-gray-600 dark:text-gray-400">
                              السؤال {answer.questionIndex + 1}
                            </span>
                            <span className={`text-sm font-medium ${
                              answer.isCorrect ? 'text-green-600' : 'text-red-600'
                            }`}>
                              {answer.isCorrect ? 'إجابة صحيحة' : 'إجابة خاطئة'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="mt-6 flex justify-end">
                  <button
                    onClick={() => setShowDetailsModal(false)}
                    className="bg-gray-600 hover:bg-gray-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
                  >
                    إغلاق
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default ExamSearchDashboard;
