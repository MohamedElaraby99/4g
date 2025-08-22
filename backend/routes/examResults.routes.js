import express from 'express';
import { isLoggedIn, authorisedRoles } from '../middleware/auth.middleware.js';
import {
    getAllExamResults,
    getExamResultsStats,
    getExamResultById,
    exportExamResults,
    getExamResults,
    getUserExamHistory,
    getExamStatistics,
    searchExamResults
} from '../controllers/examResults.controller.js';

const router = express.Router();

// All routes require admin authentication
router.use(isLoggedIn);
router.use(authorisedRoles('ADMIN'));

// Get all exam results with filtering and pagination
router.get('/', getAllExamResults);

// Export exam results to CSV
router.get('/export', exportExamResults);

// Get exam results statistics
router.get('/stats', getExamResultsStats);

// Get specific exam result by ID
router.get('/:id', getExamResultById);

// Get exam results for a specific lesson
router.get("/:courseId/:lessonId", isLoggedIn, getExamResults);

// Get user's exam history
router.get("/history", isLoggedIn, getUserExamHistory);

// Get exam statistics
router.get("/statistics", isLoggedIn, authorisedRoles("admin"), getExamStatistics);

// Search exam results (admin only)
router.get("/search", isLoggedIn, authorisedRoles("admin"), searchExamResults);

export default router;
