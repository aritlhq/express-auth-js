import {PrismaClient} from '../../generated/prisma/index.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Joi from 'joi';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET;

// --- Validation Schemas ---
const registerSchema = Joi.object({
    name: Joi.string().min(3).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    role: Joi.string().valid('ADMIN', 'LECTURER', 'STUDENT').required()
});

const loginSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
});

// --- Controller Functions ---

export const registerUser = async (req, res) => {
    try {
        // 1. Validate user input
        const {error, value} = registerSchema.validate(req.body);
        if (error) {
            return res.status(400).render('register', {error: error.details[0].message, user: null});
        }
        const {name, email, password, role} = value;

        // 2. Check if a user already exists
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
                role,
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