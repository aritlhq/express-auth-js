import {PrismaClient} from '../../generated/prisma/index.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Joi from 'joi';
import crypto from 'crypto';
import sendEmail from '../utils/sendEmail.js';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET;

// --- Validation Schemas ---
const registerSchema = Joi.object({
    name: Joi.string().min(3).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
});

const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
});

const forgotPasswordSchema = Joi.object({
    email: Joi.string().email().required(),
});

const resetPasswordSchema = Joi.object({
    token: Joi.string().required(),
    password: Joi.string().min(6).required(),
    // Ensure confirmPassword matches password
    confirmPassword: Joi.string().required().valid(Joi.ref('password')),
});

// --- Controller Functions ---

export const forgotPassword = async (req, res) => {
    try {
        // 1. Validate email
        const {error, value} = forgotPasswordSchema.validate(req.body);
        if (error) {
            return res.status(400).render('forgot-password', {
                error: error.details[0].message,
                message: null,
                user: null
            });
        }
        const {email} = value;

        // 2. Find the user by email
        const user = await prisma.user.findUnique({where: {email}});

        // If a user exists, proceed with token generation and email sending
        if (user) {
            // 3. Generate a random reset token
            const resetToken = crypto.randomBytes(32).toString('hex');

            // 4. Hash token and set expiry (10 minutes)
            const passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
            const passwordResetTokenExpires = new Date(Date.now() + 10 * 60 * 1000);

            await prisma.user.update({
                where: {email: user.email},
                data: {passwordResetToken, passwordResetTokenExpires},
            });

            // 5. Send token to user's email
            const resetURL = `${req.protocol}://${req.get('host')}/reset-password/${resetToken}`;
            const message = `Forgot your password? Click the link to reset it: ${resetURL}\n\nThis link is valid for 10 minutes. If you didn't request this, please ignore this email.`;

            try {
                await sendEmail({
                    email: user.email,
                    subject: 'Your Password Reset Link (valid for 10 min)',
                    message,
                });
            } catch (emailError) {
                console.error('Email sending error:', emailError);
                // Clear the token if email fails to prevent a locked-out state
                await prisma.user.update({
                    where: {email: user.email},
                    data: {passwordResetToken: null, passwordResetTokenExpires: null},
                });
                return res.status(500).render('forgot-password', {
                    error: 'There was an error sending the email. Please try again later.',
                    message: null,
                    user: null
                });
            }
        }

        // 6. Send a generic success message to prevent user enumeration
        res.render('forgot-password', {
            error: null,
            message: 'If a user with that email exists, a password reset link has been sent.',
            user: null
        });

    } catch (error) {
        console.error(error);
        res.status(500).render('forgot-password', {error: 'An unexpected error occurred.', message: null, user: null});
    }
};

export const resetPassword = async (req, res) => {
    try {
        // 1. Validate the form data
        const {error, value} = resetPasswordSchema.validate(req.body, {abortEarly: false});
        if (error) {
            const errorMessage = error.details.map((d) => d.message).join('. ');
            return res.status(400).render('reset-password', {error: errorMessage, token: req.body.token, user: null});
        }
        const {token, password} = value;

        // 2. Hash the token from the request to match the one in the DB
        const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

        // 3. Find the user by the hashed token and check if it's not expired
        const user = await prisma.user.findFirst({
            where: {
                passwordResetToken: hashedToken,
                passwordResetTokenExpires: {
                    gte: new Date(), // gte = greater than or equal to now
                },
            },
        });

        // 4. If the token is invalid or has expired, send an error
        if (!user) {
            return res.status(400).render('reset-password', {
                error: 'Token is invalid or has expired.',
                token: token,
                user: null
            });
        }

        // 5. If the token is valid, hash a new password and update the user
        const hashedPassword = await bcrypt.hash(password, 10);

        await prisma.user.update({
            where: {id: user.id},
            data: {
                password: hashedPassword,
                passwordResetToken: null, // Clear the token
                passwordResetTokenExpires: null,
            },
        });

        // 6. Log the user out of any old sessions and redirect to login
        res.clearCookie('token');
        res.redirect('/login');

    } catch (error) {
        console.error(error);
        res.status(500).render('reset-password', {
            error: 'An unexpected error occurred.',
            token: req.body.token,
            user: null
        });
    }
};


export const registerUser = async (req, res) => {
    try {
        // 1. Validate user input
        const {error, value} = registerSchema.validate(req.body);
        if (error) {
            return res.status(400).render('register', {error: error.details[0].message, user: null});
        }
        const {name, email, password} = value;

        // 2. Check if user already exists
        const existingUser = await prisma.user.findUnique({where: {email}});
        if (existingUser) {
            return res.status(400).render('register', {error: 'Email already in use.', user: null});
        }

        // 3. Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // 4. Create the new user
        await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
            },
        });

        // 5. Redirect to login page
        res.redirect('/login');
    } catch (error) {
        console.error(error);
        res.status(500).render('register', {error: 'An unexpected error occurred.', user: null});
    }
};

export const loginUser = async (req, res) => {
    try {
        // 1. Validate user input
        const {error, value} = loginSchema.validate(req.body);
        if (error) {
            return res.status(400).render('login', {error: error.details[0].message, user: null});
        }
        const {email, password} = value;

        // 2. Find the user by email
        const user = await prisma.user.findUnique({where: {email}});
        if (!user) {
            return res.status(401).render('login', {error: 'Invalid email or password.', user: null});
        }

        // 3. Compare passwords
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).render('login', {error: 'Invalid email or password.', user: null});
        }

        // 4. Generate JWT
        const token = jwt.sign({userId: user.id}, JWT_SECRET, {
            expiresIn: '1h', // Token expires in 1 hour
        });

        // 5. Set JWT in an HTTP-Only cookie
        res.cookie('token', token, {
            httpOnly: true, // Prevents client-side JS from accessing the cookie
            secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
            maxAge: 3600000, // 1 hour
        });

        // 6. Redirect to the dashboard
        res.redirect('/dashboard');
    } catch (error) {
        console.error(error);
        res.status(500).render('login', {error: 'An unexpected error occurred.', user: null});
    }
};

export const logoutUser = (req, res) => {
    res.clearCookie('token');
    res.redirect('/login');
};