import prisma from "~/server/utils/prisma.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import joi from "joi";

const loginSchema = joi.object({
    email: joi.string().email().required(),
    password: joi.string().required()
});

export default defineEventHandler(async (event) => {
    // 1. Baca body dari request
    const body = await readBody(event);
    const {error, value} = loginSchema.validate(body);

    if (error) {
        throw createError({
            statusCode: 400,
            statusMessage: error.message
        });
    }

    const {email, password} = value;
    const config = useRuntimeConfig(event);

    // 2. Cari user berdasarkan email
    const user = await prisma.user.findUnique({
        where: {
            email
        }
    });

    if (!user) {
        throw createError({
            statusCode: 401,
            statusMessage: 'Invalid email or password.'
        });
    }

    // 3. Bandingkan password
    const isPaswordValid = await bcrypt.compare(password, user.password);

    if (!isPaswordValid) {
        throw createError({
            statusCode: 401,
            statusMessage: 'Invalid email or password.'
        });
    }

    // 4. Generate JWT
    const token = jwt.sign({userId: user.id}, config.jwtSecret, {
        expiresIn: '1h',
    });

    // 5. Set JWT di cookie
    setCookie(event, 'token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 3600000, // 1 jam
        path: '/',
    });

    // 6. Kembalikan data user (tanpa password)
    const {password: _, ...userWithoutPassword} = user;
    return userWithoutPassword;
});