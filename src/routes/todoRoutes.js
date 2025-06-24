import express from 'express';
import {
    createTodo,
    toggleTodo,
    deleteTodo, updateTodo
} from '../controllers/todoController.js';
import {protect} from '../middleware/authMiddleware.js';

const router = express.Router();

// All routes in this file are protected
router.use(protect);

// Create a new todo
router.post('/', createTodo);

// Toggle a todo's completion status
router.post('/:id/toggle', toggleTodo);

// Update a todo
router.post('/:id/update', updateTodo);

// Delete a todo
router.post('/:id/delete', deleteTodo);

export default router;