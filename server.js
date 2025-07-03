import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import path from 'path';
import {fileURLToPath} from 'url';
import cors from 'cors';

// Import Routes
import authRoutes from './src/routes/authRoutes.js';
import userRoutes from "./src/routes/userRoutes.js";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// EJS Setup
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Middleware
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));
app.use(express.json()); // To parse JSON bodies
app.use(express.urlencoded({extended: true})); // To parse URL-encoded bodies
app.use(cookieParser()); // To parse cookies
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);

// Serve Vue app in Production
if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'client/dist')));

    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, 'client/dist', 'index.html'));
    })
}

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});