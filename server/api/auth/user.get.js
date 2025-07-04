import {prisma} from '~/server/utils/db';
import jwt from 'jsonwebtoken';

export default defineEventHandler(async (event) => {
    const token = getCookie(event, 'token');
    const {jwtSecret} = useRuntimeConfig(event);

    if (!token) {
        return null; // Tidak ada user yang login
    }

    try {
        const decoded = jwt.verify(token, jwtSecret);
        const userId = decoded.userId;

        const user = await prisma.user.findUnique({
            where: {id: userId},
            select: {id: true, name: true, email: true}, // Jangan kirim password ke frontend
        });

        return user;
    } catch (error) {
        // Token tidak valid atau expired
        return null;
    }
});