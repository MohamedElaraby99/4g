import express from 'express';
import { 
    createInstructor, 
    assignCoursesToInstructor, 
    getInstructorCourses, 
    getInstructorProfile,
    getAllInstructors,
    removeCourseFromInstructor,
    getFeaturedInstructors
} from '../controllers/instructor.controller.js';
import { isLoggedIn } from '../middleware/auth.middleware.js';
import { authorisedRoles } from '../middleware/auth.middleware.js';

const router = express.Router();

// Public routes
router.get('/featured', getFeaturedInstructors);

// Routes for admin/super admin to manage instructors
router.post('/create', isLoggedIn, authorisedRoles('SUPER_ADMIN'), createInstructor);
router.post('/assign-courses', isLoggedIn, authorisedRoles('SUPER_ADMIN', 'ADMIN'), assignCoursesToInstructor);
router.post('/remove-course', isLoggedIn, authorisedRoles('SUPER_ADMIN', 'ADMIN'), removeCourseFromInstructor);
router.get('/all', isLoggedIn, authorisedRoles('SUPER_ADMIN', 'ADMIN', 'ASSISTANT'), getAllInstructors);

// Routes for instructors to access their data
router.get('/my-courses', isLoggedIn, authorisedRoles('INSTRUCTOR'), getInstructorCourses);
router.get('/profile', isLoggedIn, authorisedRoles('INSTRUCTOR'), getInstructorProfile);

export default router;