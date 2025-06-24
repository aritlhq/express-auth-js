import {PrismaClient} from '../../generated/prisma/index.js';
import Joi from 'joi';

const prisma = new PrismaClient();

const todoSchema = Joi.object({
    title: Joi.string().min(1).required(),
});

/**
 * @desc    Create a new todo
 * @route   POST /todos
 * @access  Private
 */
export const createTodo = async (req, res) => {
    try {
        const {error} = todoSchema.validate(req.body);
        if (error) {
            // In a real app, you'd use flash messages to show the error
            return res.redirect('/dashboard');
        }

        await prisma.todo.create({
            data: {
                title: req.body.title,
                authorId: req.user.id, // From 'protect' middleware
            },
        });

        res.redirect('/dashboard');
    } catch (err) {
        console.error(err);
        res.status(500).redirect('/dashboard'); // Redirect with an error indicator
    }
};

/**
 * @desc    Toggle todo completion status
 * @route   POST /todos/:id/toggle
 * @access  Private
 */
export const toggleTodo = async (req, res) => {
    try {
        const {id} = req.params;
        const todo = await prisma.todo.findFirst({
            where: {
                id,
                authorId: req.user.id, // Ensure the user owns the todo
            },
        });

        if (!todo) {
            return res.status(404).send('Todo not found or you are not authorized.');
        }

        await prisma.todo.update({
            where: {id},
            data: {completed: !todo.completed},
        });

        res.redirect('/dashboard');
    } catch (err) {
        console.error(err);
        res.status(500).redirect('/dashboard');
    }
};

/**
 * @desc    Update a todo's title
 * @route   POST /todos/:id/update
 * @access  Private
 */
export const updateTodo = async (req, res) => {
    try {
        const {id} = req.params;
        const {title} = req.body;

        // Validate input
        const {error} = todoSchema.validate({title});
        if (error) {
            return res.redirect('/dashboard'); // Ideally show an error with a flash message
        }

        const todo = await prisma.todo.findFirst({
            where: {
                id,
                authorId: req.user.id, // Ensure user owns the todo
            },
        });

        if (!todo) {
            return res.status(404).send('Todo not found or you are not authorized.');
        }

        await prisma.todo.update({where: {id}, data: {title}});
        res.redirect('/dashboard');
    } catch (err) {
        console.error(err);
        res.status(500).redirect('/dashboard');
    }
};

/**
 * @desc    Delete a todo
 * @route   POST /todos/:id/delete
 * @access  Private
 */
export const deleteTodo = async (req, res) => {
    try {
        const {id} = req.params;
        const todo = await prisma.todo.findFirst({
            where: {
                id,
                authorId: req.user.id,
            },
        });

        if (!todo) {
            return res.status(404).send('Todo not found or you are not authorized.');
        }

        await prisma.todo.delete({
            where: {
                id,
            },
        });

        res.redirect('/dashboard');
    } catch (err) {
        console.error(err);
        res.status(500).redirect('/dashboard');
    }
};