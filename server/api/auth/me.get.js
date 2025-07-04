import prisma from '~/server/utils/prisma.js';
import jwt from 'jsonwebtoken';

export default defineEventHandler(async (event) => {
    const token = getCookie(event, 'token');
    const config = useRuntimeConfig(event);

    if (!token) {
        throw createError({statusCode: 401, statusMessage: 'Not authenticated'});
    }

    try {
        const decoded = jwt.verify(token, config.jwtSecret);
        const user = await prisma.user.findUnique({
            where: {id: decoded.userId},
            select: {id: true, name: true, email: true}, // Jangan kirim password
        });

        if (!user) {
            throw createError({statusCode: 401, statusMessage: 'User not found'});
        }
        return user;
    } catch (error) {
        throw createError({statusCode: 401, statusMessage: 'Invalid token'});
    }
});