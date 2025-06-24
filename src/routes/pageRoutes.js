import express from 'express';
import {
    getHomePage,
    getLoginPage,
    getRegisterPage,
    getDashboardPage, getForgotPasswordPage, getResetPasswordPage,
} from '../controllers/pageController.js';
import {protect, addUserToLocals, redirectIfAuthenticated} from '../middleware/authMiddleware.js';

const router = express.Router();

// Apply the middleware to all routes in this file
router.use(addUserToLocals);

// Public Routes
router.get('/', getHomePage);
router.get('/login', redirectIfAuthenticated, getLoginPage);
router.get('/register', redirectIfAuthenticated, getRegisterPage);
router.get('/forgot-password', redirectIfAuthenticated, getForgotPasswordPage);
router.get('/reset-password/:token', redirectIfAuthenticated, getResetPasswordPage);

// Protected Route
router.get('/dashboard', protect, getDashboardPage);

export default router;