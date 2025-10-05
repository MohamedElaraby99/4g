import userModel from '../models/user.model.js';
import instructorModel from '../models/instructor.model.js';
import courseModel from '../models/course.model.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';

// Create instructor user account
export const createInstructor = asyncHandler(async (req, res, next) => {
    const { fullName, email, password, instructorId } = req.body;

    // Validate required fields
    if (!fullName || !email || !password || !instructorId) {
        return next(new ApiError("Full name, email, password, and instructor profile are required", 400));
    }

    // Check if instructor profile exists
    const instructorProfile = await instructorModel.findById(instructorId);
    if (!instructorProfile) {
        return next(new ApiError("Instructor profile not found", 404));
    }

    // Check if user already exists
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
        return next(new ApiError("Email already exists", 400));
    }

    // Create instructor user
    const instructorUser = await userModel.create({
        fullName,
        email,
        password,
        role: 'INSTRUCTOR',
        instructorProfile: instructorId,
        assignedCourses: []
    });

    if (!instructorUser) {
        return next(new ApiError("Failed to create instructor user", 500));
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
        return next(new ApiError("Instructor user ID and course IDs array are required", 400));
    }

    // Check if instructor user exists
    const instructorUser = await userModel.findById(instructorUserId);
    if (!instructorUser || instructorUser.role !== 'INSTRUCTOR') {
        return next(new ApiError("Instructor user not found", 404));
    }

    // Validate course IDs exist
    const courses = await courseModel.find({ _id: { $in: courseIds } });
    if (courses.length !== courseIds.length) {
        return next(new ApiError("Some courses not found", 400));
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
        return next(new ApiError("Instructor not found", 404));
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
        return next(new ApiError("Instructor not found", 404));
    }

    res.status(200).json(
        new ApiResponse(200, instructor, "Instructor profile retrieved successfully")
    );
});

// Get all instructors (for admin)
export const getAllInstructors = asyncHandler(async (req, res, next) => {
    const instructors = await userModel.find({ role: 'INSTRUCTOR' })
        .populate('instructorProfile')
        .populate('assignedCourses')
        .select('-password');

    res.status(200).json(
        new ApiResponse(200, instructors, "Instructors retrieved successfully")
    );
});

// Remove course assignment from instructor
export const removeCourseFromInstructor = asyncHandler(async (req, res, next) => {
    const { instructorUserId, courseId } = req.body;

    if (!instructorUserId || !courseId) {
        return next(new ApiError("Instructor user ID and course ID are required", 400));
    }

    // Check if instructor user exists
    const instructorUser = await userModel.findById(instructorUserId);
    if (!instructorUser || instructorUser.role !== 'INSTRUCTOR') {
        return next(new ApiError("Instructor user not found", 404));
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

// Get featured instructors (public endpoint)
export const getFeaturedInstructors = asyncHandler(async (req, res, next) => {
    const { limit = 6 } = req.query;
    
    const instructors = await instructorModel.find({ 
        featured: true, 
        isActive: true 
    })
    .populate('courses', 'title thumbnail')
    .select('-__v')
    .limit(parseInt(limit))
    .sort({ rating: -1, totalStudents: -1 });

    res.status(200).json(
        new ApiResponse(200, instructors, "Featured instructors retrieved successfully")
    );
});