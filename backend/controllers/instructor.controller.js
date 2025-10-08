import userModel from '../models/user.model.js';
import instructorModel from '../models/instructor.model.js';
import courseModel from '../models/course.model.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';

// Create instructor user account
export const createInstructor = asyncHandler(async (req, res, next) => {
    const { fullName, email, password, courseIds } = req.body;

    // Validate required fields
    if (!fullName || !email || !password) {
        return next(new ApiError(400, "Full name, email and password are required"));
    }

    // Check if user already exists
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
        return next(new ApiError(400, "Email already exists"));
    }

    // Optionally validate courses
    let validCourseIds = [];
    if (Array.isArray(courseIds) && courseIds.length > 0) {
        const courses = await courseModel.find({ _id: { $in: courseIds } });
        if (courses.length !== courseIds.length) {
            return next(new ApiError(400, "Some courses not found"));
        }
        validCourseIds = courseIds;
    }

    // Create instructor user without requiring instructorProfile
    const instructorUser = await userModel.create({
        fullName,
        email,
        password,
        role: 'INSTRUCTOR',
        assignedCourses: validCourseIds
    });

    if (!instructorUser) {
        return next(new ApiError(500, "Failed to create instructor user"));
    }

    // Remove password from response
    const userResponse = instructorUser.toObject();
    delete userResponse.password;

    res.status(201).json(
        new ApiResponse(201, userResponse, "Instructor user created successfully")
    );
});

// Assign courses to instructor
export const assignCoursesToInstructor = asyncHandler(async (req, res, next) => {
    const { instructorUserId, courseIds } = req.body;

    // Validate required fields
    if (!instructorUserId || !courseIds || !Array.isArray(courseIds)) {
        return next(new ApiError(400, "Instructor user ID and course IDs array are required"));
    }

    // Check if instructor user exists
    const instructorUser = await userModel.findById(instructorUserId);
    if (!instructorUser || instructorUser.role !== 'INSTRUCTOR') {
        return next(new ApiError(404, "Instructor user not found"));
    }

    // Validate course IDs exist
    const courses = await courseModel.find({ _id: { $in: courseIds } });
    if (courses.length !== courseIds.length) {
        return next(new ApiError(400, "Some courses not found"));
    }

    // Update instructor's assigned courses
    instructorUser.assignedCourses = courseIds;
    await instructorUser.save();

    // Populate the response
    const updatedInstructor = await userModel.findById(instructorUserId)
        .populate('instructorProfile')
        .populate('assignedCourses');

    res.status(200).json(
        new ApiResponse(200, updatedInstructor, "Courses assigned successfully")
    );
});

// Get instructor's assigned courses
export const getInstructorCourses = asyncHandler(async (req, res, next) => {
    const instructorId = req.user.id;

    // Get instructor user with populated courses
    const instructor = await userModel.findById(instructorId)
      .populate({
            path: 'assignedCourses',
            populate: [
                { path: 'stage', select: 'name' },
                { path: 'subject', select: 'name' },
                { path: 'instructor', select: 'name email' }
            ]
        })
        .populate('instructorProfile');

    if (!instructor || instructor.role !== 'INSTRUCTOR') {
        return next(new ApiError(404, "Instructor not found"));
    }

    res.status(200).json(
        new ApiResponse(200, instructor.assignedCourses, "Instructor courses retrieved successfully")
    );
});

// Get instructor profile
export const getInstructorProfile = asyncHandler(async (req, res, next) => {
    const instructorId = req.user.id;

    const instructor = await userModel.findById(instructorId)
        .populate('instructorProfile')
        .select('-password');

    if (!instructor || instructor.role !== 'INSTRUCTOR') {
        return next(new ApiError(404, "Instructor not found"));
    }

    res.status(200).json(
        new ApiResponse(200, instructor, "Instructor profile retrieved successfully")
    );
});

// Get all instructors (for admin)
export const getAllInstructors = asyncHandler(async (req, res, next) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 100;
    const skip = (page - 1) * limit;

    // Get total count for pagination info
    const totalInstructors = await userModel.countDocuments({ role: 'INSTRUCTOR' });

    const instructors = await userModel.find({ role: 'INSTRUCTOR' })
        .populate({
            path: 'instructorProfile',
            select: 'name specialization bio experience education socialLinks profileImage rating totalStudents featured'
        })
        .populate({
            path: 'assignedCourses',
            select: 'title description image featured stage subject'
        })
        .select('-password')
        .skip(skip)
        .limit(limit);

    // Transform the data to match frontend expectations
    const transformedInstructors = instructors.map(instructor => {
        const transformed = {
            _id: instructor._id,
            name: instructor.instructorProfile?.name || instructor.fullName,
            fullName: instructor.fullName,
            email: instructor.email,
            specialization: instructor.instructorProfile?.specialization || '',
            bio: instructor.instructorProfile?.bio || '',
            experience: instructor.instructorProfile?.experience || 0,
            education: instructor.instructorProfile?.education || '',
            socialLinks: instructor.instructorProfile?.socialLinks || {},
            profileImage: instructor.instructorProfile?.profileImage || instructor.avatar || {},
            rating: instructor.instructorProfile?.rating || 0,
            totalStudents: instructor.instructorProfile?.totalStudents || 0,
            featured: instructor.instructorProfile?.featured || false,
            assignedCourses: instructor.assignedCourses || [],
            role: instructor.role,
            isActive: instructor.isActive,
            createdAt: instructor.createdAt,
            updatedAt: instructor.updatedAt
        };
        return transformed;
    });

    const totalPages = Math.ceil(totalInstructors / limit);

    res.status(200).json(
        new ApiResponse(200, {
            instructors: transformedInstructors,
            pagination: {
                currentPage: page,
                totalPages,
                totalInstructors,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1,
                limit
            }
        }, "Instructors retrieved successfully")
    );
});

// Remove course assignment from instructor
export const removeCourseFromInstructor = asyncHandler(async (req, res, next) => {
    const { instructorUserId, courseId } = req.body;

    if (!instructorUserId || !courseId) {
        return next(new ApiError(400, "Instructor user ID and course ID are required"));
    }

    // Check if instructor user exists
    const instructorUser = await userModel.findById(instructorUserId);
    if (!instructorUser || instructorUser.role !== 'INSTRUCTOR') {
        return next(new ApiError(404, "Instructor user not found"));
    }

    // Remove course from assigned courses
    instructorUser.assignedCourses = instructorUser.assignedCourses.filter(
        course => course.toString() !== courseId
    );
    await instructorUser.save();

    res.status(200).json(
        new ApiResponse(200, instructorUser, "Course removed from instructor successfully")
    );
});

// Get all instructors for admin (includes all instructors, not just featured)
export const getAllInstructorsForAdmin = asyncHandler(async (req, res, next) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 100;
    const skip = (page - 1) * limit;

    // Get total count for pagination info
    const totalInstructors = await userModel.countDocuments({ role: 'INSTRUCTOR' });

    const instructors = await userModel.find({ role: 'INSTRUCTOR' })
        .populate({
            path: 'instructorProfile',
            select: 'name specialization bio experience education socialLinks profileImage rating totalStudents featured'
        })
        .populate({
            path: 'assignedCourses',
            select: 'title description image featured stage subject'
        })
        .select('-password')
        .skip(skip)
        .limit(limit);

    // Transform the data to match frontend expectations
    const transformedInstructors = instructors.map(instructor => {
        const transformed = {
            _id: instructor._id,
            name: instructor.instructorProfile?.name || instructor.fullName,
            fullName: instructor.fullName,
            email: instructor.email,
            specialization: instructor.instructorProfile?.specialization || '',
            bio: instructor.instructorProfile?.bio || '',
            experience: instructor.instructorProfile?.experience || 0,
            education: instructor.instructorProfile?.education || '',
            socialLinks: instructor.instructorProfile?.socialLinks || {},
            profileImage: instructor.instructorProfile?.profileImage || instructor.avatar || {},
            rating: instructor.instructorProfile?.rating || 0,
            totalStudents: instructor.instructorProfile?.totalStudents || 0,
            featured: instructor.instructorProfile?.featured || false,
            assignedCourses: instructor.assignedCourses || [],
            role: instructor.role,
            isActive: instructor.isActive,
            createdAt: instructor.createdAt,
            updatedAt: instructor.updatedAt
        };
        return transformed;
    });

    const totalPages = Math.ceil(totalInstructors / limit);

    res.status(200).json(
        new ApiResponse(200, {
            instructors: transformedInstructors,
            pagination: {
                currentPage: page,
                totalPages,
                totalInstructors,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1,
                limit
            }
        }, "Instructors retrieved successfully")
    );
});

// Get featured instructors (public endpoint)
export const getFeaturedInstructors = asyncHandler(async (req, res, next) => {
    const { limit = 6 } = req.query;

    // First, get featured instructors from the Instructor collection
    const featuredInstructors = await instructorModel.find({
        featured: true,
        isActive: true
    })
    .populate('courses', 'title thumbnail')
    .select('name specialization bio experience education socialLinks profileImage rating totalStudents featured')
    .limit(parseInt(limit))
    .sort({ rating: -1, totalStudents: -1 });

    // If no featured instructors found in Instructor collection,
    // get some instructors from User collection with role INSTRUCTOR and transform them
    if (featuredInstructors.length === 0) {
        const fallbackInstructors = await userModel.find({ role: 'INSTRUCTOR', isActive: true })
            .populate({
                path: 'instructorProfile',
                select: 'name specialization bio experience education socialLinks profileImage rating totalStudents featured'
            })
            .select('fullName email instructorProfile assignedCourses isActive')
            .limit(parseInt(limit))
            .sort({ createdAt: -1 }); // Sort by newest first as fallback

        // Transform fallback instructors to match expected format
        const transformedFallback = fallbackInstructors.map(user => ({
            _id: user.instructorProfile?._id || user._id,
            name: user.instructorProfile?.name || user.fullName,
            specialization: user.instructorProfile?.specialization || '',
            bio: user.instructorProfile?.bio || '',
            experience: user.instructorProfile?.experience || 0,
            education: user.instructorProfile?.education || '',
            socialLinks: user.instructorProfile?.socialLinks || {},
            profileImage: user.instructorProfile?.profileImage || user.avatar || {},
            rating: user.instructorProfile?.rating || 0,
            totalStudents: user.instructorProfile?.totalStudents || 0,
            featured: user.instructorProfile?.featured || false,
            courses: user.assignedCourses || []
        }));

        return res.status(200).json(
            new ApiResponse(200, { instructors: transformedFallback }, "Featured instructors retrieved successfully")
        );
    }

    res.status(200).json(
        new ApiResponse(200, { instructors: featuredInstructors }, "Featured instructors retrieved successfully")
    );
});