import {prisma} from '~/server/utils/db';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import Joi from 'joi';

const schema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
});

export default defineEventHandler(async (event) => {
    const body = await readBody(event);
    const {jwtSecret} = useRuntimeConfig(event);

    // 1. Validasi
    const {error, value} = schema.validate(body);
    if (error) {
        throw createError({statusCode: 400, statusMessage: error.details[0].message});
    }
    const {email, password} = value;

    // 2. Cari user
    const user = await prisma.user.findUnique({where: {email}});
    if (!user) {
        throw createError({statusCode: 401, statusMessage: 'Invalid email or password.'});
    }

    // 3. Bandingkan password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        throw createError({statusCode: 401, statusMessage: 'Invalid email or password.'});
    }

    // 4. Buat JWT
    const token = jwt.sign({userId: user.id}, jwtSecret, {expiresIn: '1h'});

    // 5. Set cookie
    setCookie(event, 'token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 3600000, // 1 jam
        path: '/',
    });

    // Hapus password dari response
    const {password: _, ...userWithoutPassword} = user;
    return userWithoutPassword;
});