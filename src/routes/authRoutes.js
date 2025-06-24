import express from 'express';
import {registerUser, loginUser, logoutUser, resetPassword, forgotPassword} from '../controllers/authController.js';

const router = express.Router();

// POST /auth/register
router.post('/register', registerUser);

// POST /auth/login
router.post('/login', loginUser);

// POST /auth/logout
router.post('/logout', logoutUser);

// POST /auth/forgot-password
router.post('/forgot-password', forgotPassword);

// POST /auth/reset-password
router.post('/reset-password', resetPassword);

export default router;