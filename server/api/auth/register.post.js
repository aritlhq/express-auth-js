import prisma from '~/server/utils/prisma.js';
import bcrypt from 'bcrypt';
import Joi from 'joi';

const registerSchema = Joi.object({
    name: Joi.string().min(3).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
});

export default defineEventHandler(async (event) => {
    const body = await readBody(event);

    // 1. Validasi input
    const {error, value} = registerSchema.validate(body);
    if (error) {
        throw createError({
            statusCode: 400,
            statusMessage: error.details[0].message,
        });
    }

    const {name, email, password} = value;

    // 2. Cek apakah user sudah ada
    const existingUser = await prisma.user.findUnique({where: {email}});
    if (existingUser) {
        throw createError({
            statusCode: 400,
            statusMessage: 'Email already in use.',
        });
    }

    // 3. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Buat user baru
    try {
        await prisma.user.create({
            data: {
                name,
                email,
                password: hashedPassword,
            },
        });
    } catch (dbError) {
        console.error(dbError);
        throw createError({
            statusCode: 500,
            statusMessage: 'Could not create user.',
        });
    }

    // 5. Kirim respons sukses
    event.node.res.statusCode = 201; // Created
    return {message: 'User registered successfully.'};
});