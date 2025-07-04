import prisma from '~/server/utils/prisma.js';
import Joi from 'joi';
import crypto from 'crypto';
import {sendEmail} from '~/server/utils/sendEmail.js';

const forgotPasswordSchema = Joi.object({
    email: Joi.string().email().required(),
});

export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const config = useRuntimeConfig(event);

    // 1. Validasi email
    const {error, value} = forgotPasswordSchema.validate(body);
    if (error) {
        throw createError({statusCode: 400, statusMessage: error.details[0].message});
    }
    const {email} = value;

    // 2. Cari user
    const user = await prisma.user.findUnique({where: {email}});

    // Penting: Jika user ada, baru proses token. Jika tidak, tetap kirim respons sukses
    // untuk mencegah orang menebak-nebak email yang terdaftar.
    if (user) {
        // 3. Buat token reset
        const resetToken = crypto.randomBytes(32).toString('hex');

        // 4. Hash token dan atur masa berlakunya (10 menit)
        const passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
        const passwordResetTokenExpires = new Date(Date.now() + 1 * 60 * 1000);

        await prisma.user.update({
            where: {email: user.email},
            data: {passwordResetToken, passwordResetTokenExpires},
        });

        // 5. Kirim email
        // Dapatkan URL basis dari request (e.g., http://localhost:3000)
        const origin = getRequestURL(event).origin;
        const resetURL = `${origin}/reset-password/${resetToken}`;
        const message = `Forgot your password? Click the link to reset it: ${resetURL}\n\nThis link is valid for 10 minutes. If you didn't request this, please ignore this email.`;

        try {
            await sendEmail({
                config: config, // Teruskan config ke utilitas email
                email: user.email,
                subject: 'Your Password Reset Link (valid for 10 min)',
                message,
            });
        } catch (emailError) {
            console.error('Email sending error:', emailError);
            // Bersihkan token jika email gagal terkirim
            await prisma.user.update({
                where: {email: user.email},
                data: {passwordResetToken: null, passwordResetTokenExpires: null},
            });
            throw createError({statusCode: 500, statusMessage: 'Error sending email. Please try again.'});
        }
    }

    // 6. Kirim respons generik
    return {message: 'If a user with that email exists, a password reset link has been sent.'};
});