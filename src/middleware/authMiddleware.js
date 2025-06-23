import jwt from 'jsonwebtoken';
import {PrismaClient} from '../../generated/prisma/index.js';

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET;

// Middleware to protect routes that require authentication
export const protect = async (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).redirect('/login');
    }

    try {
        // Verify the token
        const decoded = jwt.verify(token, JWT_SECRET);

        // Find the user by ID from the token payload, but exclude the password
        const user = await prisma.user.findUnique({
            where: {id: decoded.userId},
            select: {id: true, name: true, email: true, createdAt: true},
        });

        if (!user) {
            return res.status(401).redirect('/login');
        }

        // Attach the user object to the request
        req.user = user;
        next();
    } catch (error) {
        // If token is invalid or expired
        console.error(error);
        res.clearCookie('token');
        return res.status(401).redirect('/login');
    }
};

// Middleware to add user data to res.locals if they are logged in
// This makes the user object available in all EJS templates
export const addUserToLocals = async (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        res.locals.user = null;
        return next();
    }

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await prisma.user.findUnique({
            where: {id: decoded.userId},
            select: {id: true, name: true, email: true},
        });
        res.locals.user = user || null;
    } catch (error) {
        res.locals.user = null;
    }
    next();
};