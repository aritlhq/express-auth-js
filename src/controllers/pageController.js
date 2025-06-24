import {PrismaClient} from '../../generated/prisma/index.js';
import crypto from 'crypto';

const prisma = new PrismaClient();

export const getHomePage = (req, res) => {
    // The 'user' object is attached by the 'addUserToLocals' middleware
    res.render('index', {user: res.locals.user || null});
};

export const getLoginPage = (req, res) => {
    res.render('login', {error: null, user: null});
};

export const getRegisterPage = (req, res) => {
    res.render('register', {error: null, user: null});
};

export const getDashboardPage = (req, res) => {
    // The 'user' object is attached by the 'protect' middleware
    res.render('dashboard', {user: req.user});
};

export const getForgotPasswordPage = (req, res) => {
    res.render('forgot-password', {error: null, message: null, user: null});
};

export const getResetPasswordPage = async (req, res) => {
    try {
        const {token} = req.params;
        const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

        // Check if the token is valid and not expired before rendering the page
        const user = await prisma.user.findFirst({
            where: {
                passwordResetToken: hashedToken,
                passwordResetTokenExpires: {gte: new Date()}
            }
        });

        if (!user) {
            // Render the forgot-password page with an error if the token is invalid
            return res.status(400).render('forgot-password', {
                error: 'Password reset link is invalid or has expired. Please try again.',
                message: null,
                user: null
            });
        }

        // If the token is valid, render the reset password page
        res.render('reset-password', {error: null, token: token, user: null});
    } catch (error) {
        res.status(500).render('forgot-password', {error: 'An unexpected error occurred.', message: null, user: null});
    }
};