import {prisma} from '~/server/utils/db';
import bcrypt from 'bcrypt';
import Joi from 'joi';

const schema = Joi.object({
    name: Joi.string().min(3).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
});

export default defineEventHandler(async (event) => {
    const body = await readBody(event);

    // 1. Validasi input
    const {error, value} = schema.validate(body);
    if (error) {
        throw createError({statusCode: 400, statusMessage: error.details[0].message});
    }
    const {name, email, password} = value;

    // 2. Cek user
    const existingUser = await prisma.user.findUnique({where: {email}});
    if (existingUser) {
        throw createError({statusCode: 400, statusMessage: 'Email already in use.'});
    }

    // 3. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Buat user baru
    const user = await prisma.user.create({
        data: {name, email, password: hashedPassword},
    });

    return {message: 'User registered successfully'};
});