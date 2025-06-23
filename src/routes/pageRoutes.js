import express from 'express';
import {
    getHomePage,
    getLoginPage,
    getRegisterPage,
    getDashboardPage,
} from '../controllers/pageController.js';
import {protect, addUserToLocals} from '../middleware/authMiddleware.js';

const router = express.Router();

// Apply the middleware to all routes in this file
router.use(addUserToLocals);

// Public Routes
router.get('/', getHomePage);
router.get('/login', getLoginPage);
router.get('/register', getRegisterPage);

// Protected Route
router.get('/dashboard', protect, getDashboardPage);

export default router;