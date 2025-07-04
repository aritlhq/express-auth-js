import prisma from '~/server/utils/prisma.js';
import bcrypt from 'bcrypt';
import Joi from 'joi';
import crypto from 'crypto';

const resetPasswordSchema = Joi.object({
    token: Joi.string().required(),
    password: Joi.string().min(6).required(),
});

export default defineEventHandler(async (event) => {
    const body = await readBody(event);

    // 1. Validasi input
    const {error, value} = resetPasswordSchema.validate(body);
    if (error) {
        throw createError({statusCode: 400, statusMessage: error.details[0].message});
    }
    const {token, password} = value;

    // 2. Hash token dari request untuk dicocokkan dengan yang ada di DB
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');

    // 3. Cari user berdasarkan token yang belum kedaluwarsa
    const user = await prisma.user.findFirst({
        where: {
            passwordResetToken: hashedToken,
            passwordResetTokenExpires: {
                gte: new Date(), // gte = greater than or equal to (masih valid)
            },
        },
    });

    // 4. Jika token tidak valid atau kedaluwarsa
    if (!user) {
        throw createError({statusCode: 400, statusMessage: 'Token is invalid or has expired.'});
    }

    // 5. Hash password baru dan perbarui data user
    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.update({
        where: {id: user.id},
        data: {
            password: hashedPassword,
            passwordResetToken: null,        // Hapus token setelah digunakan
            passwordResetTokenExpires: null,
        },
    });

    // 6. Hapus cookie login jika ada, untuk memaksa login ulang
    deleteCookie(event, 'token', {path: '/'});

    // 7. Kirim respons sukses
    return {message: 'Password has been reset successfully. Please log in.'};
});