import express from 'express';
import {
    getHomePage,
    getLoginPage,
    getRegisterPage,
    getDashboardPage, getAdminPage,
} from '../controllers/pageController.js';
import {protect, addUserToLocals, authorize, redirectIfAuthenticated} from '../middleware/authMiddleware.js';

const router = express.Router();

// Apply the middleware to all routes in this file
router.use(addUserToLocals);

// Public Routes
router.get('/', getHomePage);
router.get('/login', redirectIfAuthenticated, getLoginPage);
router.get('/register', redirectIfAuthenticated, getRegisterPage);

// Protected Route
router.get('/dashboard', protect, getDashboardPage);

// Admin-only Route
router.get('/admin', protect, authorize(['ADMIN']), getAdminPage);

export default router;