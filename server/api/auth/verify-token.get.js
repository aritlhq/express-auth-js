import prisma from '~/server/utils/prisma.js';
import crypto from 'crypto';

export default defineEventHandler(async (event) => {
    // Ambil token dari query parameter
    const {token} = getQuery(event);

    if (!token) {
        throw createError({statusCode: 400, statusMessage: 'Token is required.'});
    }

    const hashedToken = crypto.createHash('sha256').update(String(token)).digest('hex');

    const user = await prisma.user.findFirst({
        where: {
            passwordResetToken: hashedToken,
            passwordResetTokenExpires: {
                gte: new Date(),
            },
        },
    });

    if (!user) {
        throw createError({statusCode: 400, statusMessage: 'Token is invalid or has expired.'});
    }

    // Jika valid, kembalikan status sukses
    return {valid: true};
});