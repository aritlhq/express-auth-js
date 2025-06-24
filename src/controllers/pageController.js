import {PrismaClient} from '../../generated/prisma/index.js';

const prisma = new PrismaClient();

export const getHomePage = (req, res) => {
    // The 'user' object is attached by the 'addUserToLocals' middleware
    res.render('index', {user: res.locals.user || null});
};

export const getLoginPage = (req, res) => {
    res.render('login', {error: null, user: null});
};

export const getRegisterPage = (req, res) => {
    res.render('register', {error: null, user: null});
};

// export const getDashboardPage = (req, res) => {
//     // The 'user' object is attached by the 'protect' middleware
//     res.render('dashboard', { user: req.user });
// };

export const getDashboardPage = async (req, res) => {
    try {
        const todos = await prisma.todo.findMany({
            where: {
                authorId: req.user.id,
            },
            orderBy: {
                createdAt: 'desc',
            }
        });

        res.render('dashboard', { user: req.user, todos, error: null });
    } catch (error) {
        console.error(error);
        res.render('dashboard', {
            user: req.user,
            todos: [],
            error: 'Could not fetch your todos.',
        });
    }
}