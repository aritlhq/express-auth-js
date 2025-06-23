import express from 'express';
import { registerUser, loginUser, logoutUser } from '../controllers/authController.js';

const router = express.Router();

// POST /auth/register
router.post('/register', registerUser);

// POST /auth/login
router.post('/login', loginUser);

// POST /auth/logout
router.post('/logout', logoutUser);

export default router;