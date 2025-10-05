import userModel from '../models/user.model.js';
import courseModel from '../models/course.model.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

// Middleware to check if instructor can access a specific course
export const checkInstructorCourseAccess = asyncHandler(async (req, res, next) => {
    const { courseId } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;

    // Allow access for non-instructor roles (ADMIN, SUPER_ADMIN, etc.)
    if (userRole !== 'INSTRUCTOR') {
        return next();
    }

    // For instructors, check if they have access to this course
    const instructor = await userModel.findById(userId).populate('assignedCourses');
    
    if (!instructor) {
        return next(new ApiError("Instructor not found", 404));
    }

    // Check if the course is in the instructor's assigned courses
    const hasAccess = instructor.assignedCourses.some(course => 
        course._id.toString() === courseId
    );

    if (!hasAccess) {
        return next(new ApiError("You don't have access to this course", 403));
    }

    next();
});

// Middleware to filter course lists for instructors
export const filterCoursesForInstructor = asyncHandler(async (req, res, next) => {
    const userId = req.user.id;
    const userRole = req.user.role;

    // For non-instructor roles, continue without filtering
    if (userRole !== 'INSTRUCTOR') {
        return next();
    }

    // For instructors, filter courses to only show assigned ones
    const instructor = await userModel.findById(userId).populate({
        path: 'assignedCourses',
        populate: [
            { path: 'stage', select: 'name' },
            { path: 'subject', select: 'name' },
            { path: 'instructor', select: 'name email' }
        ]
    });

    if (!instructor) {
        return next(new ApiError("Instructor not found", 404));
    }

    // Add filtered courses to request object
    req.filteredCourses = instructor.assignedCourses;
    
    next();
});
