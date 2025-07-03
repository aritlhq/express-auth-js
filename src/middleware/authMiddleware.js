import jwt from 'jsonwebtoken';
import {PrismaClient} from "../../generated/prisma/index.js";

const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET;

// Middleware to protect routes that require authentication
export const protect = async (req, res, next) => {
    const token = req.cookies.token;

    if (!token) {
        return res.status(401).send('Not authorized, no token');
    }

    try {
        const decode = jwt.verify(token, JWT_SECRET);
        const user = await prisma.user.findUnique({
            where: {
                id: decode.userId
            },
            select: {
                id: true,
                name: true,
                email: true,
                createdAt: true,
            }
        });

        if (!user) {
            return res.status(401).send('Not authorized, user not found');
        }

        req.user = user;
        next();
    } catch (error) {
        console.error(error);
        res.clearCookie('token');
        return res.status(401).send('Not authorized, token failed');
    }
}