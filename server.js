// server.js
import express from 'express';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import path from 'path';
import {fileURLToPath} from 'url';

// Import Routes
import authRoutes from './src/routes/authRoutes.js';
import pageRoutes from './src/routes/pageRoutes.js';
import todoRoutes from "./src/routes/todoRoutes.js";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// EJS Setup
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'src/views'));

// Middleware
app.use(express.json()); // To parse JSON bodies
app.use(express.urlencoded({extended: true})); // To parse URL-encoded bodies
app.use(cookieParser()); // To parse cookies
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files

// Routes
app.use('/auth', authRoutes);
app.use('/', pageRoutes);
app.use('/todos', todoRoutes);

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});