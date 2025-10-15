import React, { useState, useEffect } from 'react';
import { FaStar, FaToggleOn, FaToggleOff, FaEye, FaEdit, FaTrashAlt, FaPlus, FaSearch, FaFilter, FaTimes, FaLinkedin, FaTwitter, FaFacebook, FaWhatsapp, FaUpload } from 'react-icons/fa';
import { axiosInstance } from '../../Helpers/axiosInstance';
import { toast } from 'react-hot-toast';
import Layout from '../../Layout/Layout';

const AdminInstructors = () => {
    const [instructors, setInstructors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterFeatured, setFilterFeatured] = useState('all');
    const [togglingFeatured, setTogglingFeatured] = useState(new Set());

    // Create instructor modal state
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [creatingInstructor, setCreatingInstructor] = useState(false);
    const [instructorForm, setInstructorForm] = useState({
        fullName: '',
        email: '',
        password: '',
        specialization: '',
        bio: '',
        experience: 0,
        education: '',
        socialLinks: {
            linkedin: '',
            twitter: '',
            facebook: '',
            whatsapp: ''
        }
    });

    // Edit instructor modal state
    const [showEditModal, setShowEditModal] = useState(false);
    const [editingInstructor, setEditingInstructor] = useState(false);
    const [editInstructorId, setEditInstructorId] = useState(null);
    const [editForm, setEditForm] = useState({
        fullName: '',
        email: '',
        specialization: '',
        bio: '',
        experience: 0,
        education: '',
        socialLinks: {
            linkedin: '',
            twitter: '',
            facebook: '',
            whatsapp: ''
        }
    });

    // Image upload state
    const [selectedImage, setSelectedImage] = useState(null);
    const [uploadingImage, setUploadingImage] = useState(false);

    useEffect(() => {
        fetchInstructors();
    }, []);

    const fetchInstructors = async () => {
        try {
            setLoading(true);
            console.log('Fetching all instructors...');
            const response = await axiosInstance.get('/instructors/all');

            if (response.data.success) {
                console.log('All instructors data:', response.data.data);
                setInstructors(response.data.data.instructors || []);
            }
        } catch (error) {
            console.error('Error fetching instructors:', error);
            toast.error('فشل في تحميل بيانات المدرسين');
        } finally {
            setLoading(false);
        }
    };

    const toggleFeatured = async (instructorId) => {
        setTogglingFeatured(prev => new Set([...prev, instructorId]));

        try {
            const response = await axiosInstance.patch(`/instructors/${instructorId}/toggle-featured`);

            if (response.data.success) {
                toast.success(response.data.message);
                // Update the instructor's featured status in the local state using server response
                setInstructors(prevInstructors =>
                    prevInstructors.map(inst =>
                        inst._id === instructorId
                            ? { ...inst, featured: response.data.data.instructor.featured }
                            : inst
                    )
                );
            }
        } catch (error) {
            console.error('Error toggling featured status:', error);
            toast.error('فشل في تغيير حالة التوصية');
        } finally {
            setTogglingFeatured(prev => {
                const newSet = new Set(prev);
                newSet.delete(instructorId);
                return newSet;
            });
        }
    };

    const filteredInstructors = instructors.filter(instructor => {
        const matchesSearch = (instructor.name || instructor.fullName || '')?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                             instructor.email?.toLowerCase().includes(searchTerm.toLowerCase());

        const matchesFilter = filterFeatured === 'all' ||
                             (filterFeatured === 'featured' && instructor.featured) ||
                             (filterFeatured === 'not-featured' && !instructor.featured);

        return matchesSearch && matchesFilter;
    });

    const handleCreateInstructor = async (e) => {
        e.preventDefault();

        if (!instructorForm.fullName.trim() || !instructorForm.email.trim() || !instructorForm.password.trim()) {
            toast.error('يرجى ملء جميع الحقول المطلوبة');
            return;
        }

        setCreatingInstructor(true);
        try {
            let formData;

            // If there's an image, send as FormData
            if (selectedImage) {
                formData = new FormData();
                formData.append('fullName', instructorForm.fullName);
                formData.append('email', instructorForm.email);
                formData.append('password', instructorForm.password);
                formData.append('specialization', instructorForm.specialization);
                formData.append('bio', instructorForm.bio);
                formData.append('experience', instructorForm.experience);
                formData.append('education', instructorForm.education);
                formData.append('socialLinks', JSON.stringify(instructorForm.socialLinks));
                formData.append('profileImage', selectedImage);
            } else {
                // Send as JSON if no image
                formData = instructorForm;
            }

            const response = await axiosInstance.post('/instructors/create', formData, {
                headers: selectedImage ? {
                    'Content-Type': 'multipart/form-data'
                } : {}
            });

            if (response.data.success) {
                toast.success('تم إنشاء المدرس بنجاح');
                setShowCreateModal(false);
                setInstructorForm({
                    fullName: '',
                    email: '',
                    password: '',
                    specialization: '',
                    bio: '',
                    experience: 0,
                    education: '',
                    socialLinks: {
                        linkedin: '',
                        twitter: '',
                        facebook: '',
                        whatsapp: ''
                    }
                });
                setSelectedImage(null);
                fetchInstructors(); // Refresh the list
            }
        } catch (error) {
            console.error('Error creating instructor:', error);
            toast.error(error.response?.data?.message || 'فشل في إنشاء المدرس');
        } finally {
            setCreatingInstructor(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setInstructorForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleEditInputChange = (e) => {
        const { name, value } = e.target;
        setEditForm(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSocialLinksChange = (e) => {
        const { name, value } = e.target;
        setInstructorForm(prev => ({
            ...prev,
            socialLinks: {
                ...prev.socialLinks,
                [name]: value
            }
        }));
    };

    const handleEditSocialLinksChange = (e) => {
        const { name, value } = e.target;
        setEditForm(prev => ({
            ...prev,
            socialLinks: {
                ...prev.socialLinks,
                [name]: value
            }
        }));
    };

    const handleImageSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedImage(file);
        }
    };

    const openEditModal = (instructor) => {
        setEditInstructorId(instructor._id);
        setEditForm({
            fullName: instructor.fullName || instructor.name || '',
            email: instructor.email || '',
            specialization: instructor.specialization || '',
            bio: instructor.bio || '',
            experience: instructor.experience || 0,
            education: instructor.education || '',
            socialLinks: {
                linkedin: instructor.socialLinks?.linkedin || '',
                twitter: instructor.socialLinks?.twitter || '',
                facebook: instructor.socialLinks?.facebook || '',
                whatsapp: instructor.socialLinks?.whatsapp || ''
            }
        });
        setShowEditModal(true);
    };

    const handleEditInstructor = async (e) => {
        e.preventDefault();

        if (!editForm.fullName.trim() || !editForm.email.trim()) {
            toast.error('يرجى ملء جميع الحقول المطلوبة');
            return;
        }

        setEditingInstructor(true);
        try {
            const response = await axiosInstance.put(`/instructors/${editInstructorId}`, editForm);

            if (response.data.success) {
                toast.success('تم تحديث بيانات المدرس بنجاح');
                setShowEditModal(false);
                setEditInstructorId(null);
                setEditForm({
                    fullName: '',
                    email: '',
                    specialization: '',
                    bio: '',
                    experience: 0,
                    education: '',
                    socialLinks: {
                        linkedin: '',
                        twitter: '',
                        facebook: '',
                        whatsapp: ''
                    }
                });
                setSelectedImage(null);
                fetchInstructors(); // Refresh the list
            }
        } catch (error) {
            console.error('Error updating instructor:', error);
            toast.error(error.response?.data?.message || 'فشل في تحديث بيانات المدرس');
        } finally {
            setEditingInstructor(false);
        }
    };

    const handleDeleteInstructor = async (instructorId) => {
        if (!window.confirm('هل أنت متأكد من حذف هذا المدرس؟')) {
            return;
        }

        try {
            const response = await axiosInstance.delete(`/instructors/${instructorId}`);

            if (response.data.success) {
                toast.success('تم حذف المدرس بنجاح');
                fetchInstructors(); // Refresh the list
            }
        } catch (error) {
            console.error('Error deleting instructor:', error);
            toast.error(error.response?.data?.message || 'فشل في حذف المدرس');
        }
    };

    const handleImageUpload = async (instructorId) => {
        if (!selectedImage) {
            toast.error('يرجى اختيار صورة أولاً');
            return;
        }

        setUploadingImage(true);
        try {
            const formData = new FormData();
            formData.append('profileImage', selectedImage);

            const response = await axiosInstance.post(`/instructors/${instructorId}/upload-image`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            if (response.data.success) {
                toast.success('تم رفع الصورة بنجاح');
                setSelectedImage(null);
                fetchInstructors(); // Refresh the list
            }
        } catch (error) {
            console.error('Error uploading image:', error);
            toast.error(error.response?.data?.message || 'فشل في رفع الصورة');
        } finally {
            setUploadingImage(false);
        }
    };

    if (loading) {
        return (
            <Layout>
                <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                    <div className="text-center">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-500 mx-auto"></div>
                        <p className="mt-4 text-gray-600 dark:text-gray-400">جاري تحميل بيانات المدرسين...</p>
                    </div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900" dir="rtl">
                {/* Header */}
                <div className="bg-white dark:bg-gray-800 shadow-sm border-b border-gray-200 dark:border-gray-700">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="py-6">
                            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                                إدارة المدرسين
                            </h1>
                            <p className="mt-2 text-gray-600 dark:text-gray-400">
                                إدارة جميع المدرسين في النظام
                            </p>
                        </div>
                    </div>
                </div>

                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    {/* Instructions */}
                    <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 mb-8">
                        <div className="flex items-start gap-4">
                            <div className="flex-shrink-0 w-8 h-8 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center">
                                <FaStar className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
                                    كيفية إدارة المدرسين
                                </h3>
                                <p className="text-blue-800 dark:text-blue-200 text-sm leading-relaxed">
                                    • استخدم زر التبديل (Toggle) في كل بطاقة مدرس لتحديد أو إلغاء تحديد المدرس كمميز<br/>
                                    • المدرسين المميزون سيظهرون في الصفحة الرئيسية للموقع<br/>
                                    • يمكنك البحث والتصفية حسب حالة التوصية باستخدام الفلاتر أدناه<br/>
                                    • جميع المدرسين الجدد يتم إنشاؤهم كمميزين افتراضياً
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Filters and Search */}
                    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-8">
                        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                            <div className="relative flex-1 max-w-md">
                                <FaSearch className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                                <input
                                    type="text"
                                    placeholder="البحث في المدرسين..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="w-full pr-10 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                />
                            </div>

                            <div className="flex items-center gap-4">
                                <div className="flex items-center gap-2">
                                    <FaFilter className="text-gray-500 h-4 w-4" />
                                    <select
                                        value={filterFeatured}
                                        onChange={(e) => setFilterFeatured(e.target.value)}
                                        className="border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                    >
                                        <option value="all">جميع المدرسين</option>
                                        <option value="featured">المميزون فقط</option>
                                        <option value="not-featured">غير المميزين</option>
                                    </select>
                                </div>

                                <button
                                    onClick={() => setShowCreateModal(true)}
                                    className="px-4 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors flex items-center gap-2"
                                >
                                    <FaPlus className="h-4 w-4" />
                                    إضافة مدرس جديد
                                </button>

                                <button
                                    onClick={fetchInstructors}
                                    className="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors"
                                >
                                    تحديث البيانات
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Instructors Grid */}
                    <div className="bg-white dark:bg-gray-800 shadow rounded-lg">
                        <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
                                المدرسين ({filteredInstructors.length})
                            </h2>
                        </div>

                        <div className="p-6">
                            {filteredInstructors.length === 0 ? (
                                <div className="text-center py-12">
                                    <FaStar className="mx-auto h-12 w-12 text-gray-400" />
                                    <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
                                        لا توجد مدرسين
                                    </h3>
                                    <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                                        {searchTerm || filterFeatured !== 'all'
                                            ? 'لا توجد نتائج تطابق البحث أو الفلترة المحددة'
                                            : 'لا توجد مدرسين حالياً'}
                                    </p>
                                </div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                    {filteredInstructors.map((instructor) => (
                                        <div key={instructor._id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-6 hover:shadow-md transition-shadow">
                                            {/* Header with featured toggle */}
                                            <div className="flex items-center justify-between mb-4">
                                                <div className="flex items-center gap-3">
                                                    {instructor.profileImage?.secure_url ? (
                                                        <img
                                                            src={instructor.profileImage.secure_url}
                                                            alt={instructor.name || instructor.fullName}
                                                            className="w-12 h-12 rounded-full object-cover"
                                                        />
                                                    ) : (
                                                        <div className="w-12 h-12 rounded-full bg-orange-100 dark:bg-orange-900 flex items-center justify-center">
                                                            <span className="text-orange-600 dark:text-orange-400 font-semibold">
                                                                {(instructor.name || instructor.fullName)?.charAt(0)?.toUpperCase()}
                                                            </span>
                                                        </div>
                                                    )}
                                                    <div>
                                                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                                                            {instructor.name || instructor.fullName || 'غير محدد'}
                                                        </h3>
                                                        <p className="text-sm text-gray-600 dark:text-gray-400">
                                                            {instructor.specialization || 'غير محدد'}
                                                        </p>
                                                    </div>
                                                </div>

                                                <div className="flex items-center gap-2">
                                                    <button
                                                        onClick={() => toggleFeatured(instructor._id)}
                                                        disabled={togglingFeatured.has(instructor._id)}
                                                        className={`p-2 rounded-full transition-all duration-200 ${
                                                            instructor.featured
                                                                ? 'bg-orange-100 text-orange-600 hover:bg-orange-200 hover:scale-110'
                                                                : 'bg-gray-100 text-gray-400 hover:bg-gray-200 hover:scale-110'
                                                        } ${togglingFeatured.has(instructor._id) ? 'opacity-50 cursor-not-allowed' : ''}`}
                                                        title={instructor.featured ? 'إلغاء التوصية' : 'توصية المدرس'}
                                                    >
                                                        {togglingFeatured.has(instructor._id) ? (
                                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-current opacity-70"></div>
                                                        ) : instructor.featured ? (
                                                            <FaToggleOn className="h-5 w-5" />
                                                        ) : (
                                                            <FaToggleOff className="h-5 w-5" />
                                                        )}
                                                    </button>
                                                    <button
                                                        onClick={() => openEditModal(instructor)}
                                                        className="p-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 hover:scale-110 transition-all duration-200"
                                                        title="تعديل المدرس"
                                                    >
                                                        <FaEdit className="h-4 w-4" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteInstructor(instructor._id)}
                                                        className="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200 hover:scale-110 transition-all duration-200"
                                                        title="حذف المدرس"
                                                    >
                                                        <FaTrashAlt className="h-4 w-4" />
                                                    </button>
                                                </div>
                                            </div>

                                            {/* Instructor Info */}
                                            <div className="space-y-2 mb-4">
                                                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                                                    <span className="font-medium">التقييم:</span>
                                                    <span className="mr-2">{instructor.rating || 0}/5 ⭐</span>
                                                </div>
                                                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                                                    <span className="font-medium">الطلاب:</span>
                                                    <span className="mr-2">{instructor.totalStudents || 0}</span>
                                                </div>
                                                <div className="flex items-center text-sm text-gray-600 dark:text-gray-400">
                                                    <span className="font-medium">الخبرة:</span>
                                                    <span className="mr-2">{instructor.experience || 0} سنوات</span>
                                                </div>
                                            </div>

                                            {/* Bio */}
                                            {instructor.bio && (
                                                <p className="text-gray-600 dark:text-gray-400 text-sm mb-4 line-clamp-2">
                                                    {instructor.bio}
                                                </p>
                                            )}

                                            {/* Courses Count */}
                                            <div className="flex items-center justify-between text-sm">
                                                <span className="text-gray-600 dark:text-gray-400">
                                                    الدورات: {instructor.courses?.length || 0}
                                                </span>
                                                {instructor.featured && (
                                                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">
                                                        مميز
                                                    </span>
                                                )}
                                            </div>

                                            {/* Sample Courses */}
                                            {instructor.courses && instructor.courses.length > 0 && (
                                                <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                                                    <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                                                        الدورات المتاحة:
                                                    </p>
                                                    <div className="space-y-1">
                                                        {instructor.courses.slice(0, 3).map((course, index) => (
                                                            <div key={course._id || index} className="text-xs text-gray-600 dark:text-gray-400 truncate">
                                                                • {course.title}
                                                            </div>
                                                        ))}
                                                        {instructor.courses.length > 3 && (
                                                            <div className="text-xs text-gray-500 dark:text-gray-500">
                                                                +{instructor.courses.length - 3} دورات أخرى
                                                            </div>
                                                        )}
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Create Instructor Modal */}
            {showCreateModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto" dir="rtl">
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                إضافة مدرس جديد
                            </h2>
                            <button
                                onClick={() => setShowCreateModal(false)}
                                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                            >
                                <FaTimes className="text-xl" />
                            </button>
                        </div>

                        {/* Content */}
                        <form onSubmit={handleCreateInstructor} className="p-6 space-y-6">
                            {/* Basic Information */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium mb-2">الاسم الكامل *</label>
                                    <input
                                        type="text"
                                        name="fullName"
                                        value={instructorForm.fullName}
                                        onChange={handleInputChange}
                                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                        placeholder="أدخل الاسم الكامل"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">البريد الإلكتروني *</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={instructorForm.email}
                                        onChange={handleInputChange}
                                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                        placeholder="أدخل البريد الإلكتروني"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">كلمة المرور *</label>
                                    <input
                                        type="password"
                                        name="password"
                                        value={instructorForm.password}
                                        onChange={handleInputChange}
                                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                        placeholder="أدخل كلمة المرور"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">سنوات الخبرة</label>
                                    <input
                                        type="number"
                                        name="experience"
                                        value={instructorForm.experience}
                                        onChange={handleInputChange}
                                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                        placeholder="عدد سنوات الخبرة"
                                        min="0"
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium mb-2">التخصص</label>
                                    <input
                                        type="text"
                                        name="specialization"
                                        value={instructorForm.specialization}
                                        onChange={handleInputChange}
                                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                        placeholder="أدخل التخصص (مثل: رياضيات، فيزياء، إلخ)"
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium mb-2">نبذة تعريفية</label>
                                    <textarea
                                        name="bio"
                                        value={instructorForm.bio}
                                        onChange={handleInputChange}
                                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                        rows="3"
                                        placeholder="أدخل نبذة تعريفية مختصرة عن المدرس"
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium mb-2">المؤهل التعليمي</label>
                                    <input
                                        type="text"
                                        name="education"
                                        value={instructorForm.education}
                                        onChange={handleInputChange}
                                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                        placeholder="أدخل المؤهل التعليمي"
                                    />
                                </div>
                            </div>

                            {/* Social Media Links */}
                            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                    روابط وسائل التواصل الاجتماعي
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="relative">
                                        <label className="block text-sm font-medium mb-2">
                                            <FaLinkedin className="inline ml-2 text-blue-600" />
                                            LinkedIn
                                        </label>
                                        <input
                                            type="url"
                                            name="linkedin"
                                            value={instructorForm.socialLinks.linkedin}
                                            onChange={handleSocialLinksChange}
                                            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                            placeholder="https://linkedin.com/in/username"
                                        />
                                    </div>

                                    <div className="relative">
                                        <label className="block text-sm font-medium mb-2">
                                            <FaTwitter className="inline ml-2 text-blue-400" />
                                            Twitter
                                        </label>
                                        <input
                                            type="url"
                                            name="twitter"
                                            value={instructorForm.socialLinks.twitter}
                                            onChange={handleSocialLinksChange}
                                            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                            placeholder="https://twitter.com/username"
                                        />
                                    </div>

                                    <div className="relative">
                                        <label className="block text-sm font-medium mb-2">
                                            <FaFacebook className="inline ml-2 text-blue-700" />
                                            Facebook
                                        </label>
                                        <input
                                            type="url"
                                            name="facebook"
                                            value={instructorForm.socialLinks.facebook}
                                            onChange={handleSocialLinksChange}
                                            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                            placeholder="https://facebook.com/username"
                                        />
                                    </div>

                                    <div className="relative">
                                        <label className="block text-sm font-medium mb-2">
                                            <FaWhatsapp className="inline ml-2 text-green-600" />
                                            WhatsApp
                                        </label>
                                        <input
                                            type="tel"
                                            name="whatsapp"
                                            value={instructorForm.socialLinks.whatsapp}
                                            onChange={handleSocialLinksChange}
                                            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                            placeholder="+1234567890"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Image Upload Section */}
                            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                    صورة الملف الشخصي
                                </h3>
                                <div className="flex items-center gap-4">
                                    <div className="flex-1">
                                        <label className="block text-sm font-medium mb-2">اختيار صورة الملف الشخصي</label>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageSelect}
                                            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                        />
                                        {selectedImage && (
                                            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                                                تم اختيار: {selectedImage.name}
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                                <button
                                    type="button"
                                    onClick={() => setShowCreateModal(false)}
                                    className="px-6 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                                >
                                    إلغاء
                                </button>
                                <button
                                    type="submit"
                                    disabled={creatingInstructor}
                                    className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                >
                                    {creatingInstructor ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                            جاري الإنشاء...
                                        </>
                                    ) : (
                                        <>
                                            <FaPlus className="h-4 w-4" />
                                            إنشاء المدرس
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Edit Instructor Modal */}
            {showEditModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto" dir="rtl">
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
                            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                                تعديل بيانات المدرس
                            </h2>
                            <button
                                onClick={() => setShowEditModal(false)}
                                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                            >
                                <FaTimes className="text-xl" />
                            </button>
                        </div>

                        {/* Content */}
                        <form onSubmit={handleEditInstructor} className="p-6 space-y-6">
                            {/* Basic Information */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-sm font-medium mb-2">الاسم الكامل *</label>
                                    <input
                                        type="text"
                                        name="fullName"
                                        value={editForm.fullName}
                                        onChange={handleEditInputChange}
                                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                        placeholder="أدخل الاسم الكامل"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">البريد الإلكتروني *</label>
                                    <input
                                        type="email"
                                        name="email"
                                        value={editForm.email}
                                        onChange={handleEditInputChange}
                                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                        placeholder="أدخل البريد الإلكتروني"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">سنوات الخبرة</label>
                                    <input
                                        type="number"
                                        name="experience"
                                        value={editForm.experience}
                                        onChange={handleEditInputChange}
                                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                        placeholder="عدد سنوات الخبرة"
                                        min="0"
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium mb-2">التخصص</label>
                                    <input
                                        type="text"
                                        name="specialization"
                                        value={editForm.specialization}
                                        onChange={handleEditInputChange}
                                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                        placeholder="أدخل التخصص (مثل: رياضيات، فيزياء، إلخ)"
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium mb-2">نبذة تعريفية</label>
                                    <textarea
                                        name="bio"
                                        value={editForm.bio}
                                        onChange={handleEditInputChange}
                                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                        rows="3"
                                        placeholder="أدخل نبذة تعريفية مختصرة عن المدرس"
                                    />
                                </div>

                                <div className="md:col-span-2">
                                    <label className="block text-sm font-medium mb-2">المؤهل التعليمي</label>
                                    <input
                                        type="text"
                                        name="education"
                                        value={editForm.education}
                                        onChange={handleEditInputChange}
                                        className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                        placeholder="أدخل المؤهل التعليمي"
                                    />
                                </div>
                            </div>

                            {/* Social Media Links */}
                            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                    روابط وسائل التواصل الاجتماعي
                                </h3>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="relative">
                                        <label className="block text-sm font-medium mb-2">
                                            <FaLinkedin className="inline ml-2 text-blue-600" />
                                            LinkedIn
                                        </label>
                                        <input
                                            type="url"
                                            name="linkedin"
                                            value={editForm.socialLinks.linkedin}
                                            onChange={handleEditSocialLinksChange}
                                            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                            placeholder="https://linkedin.com/in/username"
                                        />
                                    </div>

                                    <div className="relative">
                                        <label className="block text-sm font-medium mb-2">
                                            <FaTwitter className="inline ml-2 text-blue-400" />
                                            Twitter
                                        </label>
                                        <input
                                            type="url"
                                            name="twitter"
                                            value={editForm.socialLinks.twitter}
                                            onChange={handleEditSocialLinksChange}
                                            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                            placeholder="https://twitter.com/username"
                                        />
                                    </div>

                                    <div className="relative">
                                        <label className="block text-sm font-medium mb-2">
                                            <FaFacebook className="inline ml-2 text-blue-700" />
                                            Facebook
                                        </label>
                                        <input
                                            type="url"
                                            name="facebook"
                                            value={editForm.socialLinks.facebook}
                                            onChange={handleEditSocialLinksChange}
                                            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                            placeholder="https://facebook.com/username"
                                        />
                                    </div>

                                    <div className="relative">
                                        <label className="block text-sm font-medium mb-2">
                                            <FaWhatsapp className="inline ml-2 text-green-600" />
                                            WhatsApp
                                        </label>
                                        <input
                                            type="tel"
                                            name="whatsapp"
                                            value={editForm.socialLinks.whatsapp}
                                            onChange={handleEditSocialLinksChange}
                                            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                            placeholder="+1234567890"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Image Upload Section */}
                            <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
                                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                                    صورة الملف الشخصي
                                </h3>
                                <div className="flex items-center gap-4">
                                    <div className="flex-1">
                                        <label className="block text-sm font-medium mb-2">اختيار صورة جديدة</label>
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageSelect}
                                            className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                                        />
                                        {selectedImage && (
                                            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                                                تم اختيار: {selectedImage.name}
                                            </p>
                                        )}
                                    </div>
                                    <div className="mt-6">
                                        <button
                                            type="button"
                                            onClick={() => handleImageUpload(editInstructorId)}
                                            disabled={!selectedImage || uploadingImage}
                                            className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                        >
                                            {uploadingImage ? (
                                                <>
                                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                                    جاري الرفع...
                                                </>
                                            ) : (
                                                <>
                                                    <FaUpload className="h-4 w-4" />
                                                    رفع الصورة
                                                </>
                                            )}
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center justify-end gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
                                <button
                                    type="button"
                                    onClick={() => setShowEditModal(false)}
                                    className="px-6 py-2 text-gray-700 dark:text-gray-300 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
                                >
                                    إلغاء
                                </button>
                                <button
                                    type="submit"
                                    disabled={editingInstructor}
                                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                                >
                                    {editingInstructor ? (
                                        <>
                                            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                            جاري التحديث...
                                        </>
                                    ) : (
                                        <>
                                            <FaEdit className="h-4 w-4" />
                                            تحديث البيانات
                                        </>
                                    )}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </Layout>
    );
};

export default AdminInstructors;
