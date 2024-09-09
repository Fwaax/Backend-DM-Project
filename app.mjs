import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import session from 'express-session';
import dotenv from 'dotenv';
import initailDataProc from './Handlers/initailData/initailDataProc.mjs';
import morgan from 'morgan';
import chalk from 'chalk';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

import authRoutes from "./Handlers/Users/auth.mjs";
import userRoutes from "./Handlers/Users/users.mjs";
import cardRoutes from "./Handlers/Cards/cards.mjs";

const __filename = fileURLToPath(import.meta.url); // get the resolved path to the file
const __dirname = path.dirname(__filename); // get the name of the directory

dotenv.config();

const PORT = process.env.PORT;

// Initialize MongoDB connection
async function main() {
    await mongoose.connect(process.env.DB_URL);
    console.log('MongoDB connection established on port 27017');
    initailDataProc();
}

main().catch(err => console.log(err));

export const app = express();

// Setup request logging using Morgan with chalk for colorization
app.use(morgan((tokens, req, res) => {
    const status = tokens.status(req, res);
    const method = tokens.method(req, res);
    const url = tokens.url(req, res);
    const responseTime = tokens['response-time'](req, res);
    const contentLength = tokens.res(req, res, 'content-length') || '0';

    const coloredStatus = status >= 500 ? chalk.red(status) :
        status >= 400 ? chalk.yellow(status) :
            status >= 300 ? chalk.cyan(status) : chalk.green(status);

    return [
        chalk.blue(method),
        chalk.magenta(url),
        coloredStatus,
        chalk.gray(`${contentLength} bytes`),
        '-',
        chalk.white(`${responseTime} ms`),
        chalk.greenBright(new Date().toString())
    ].join(' ');
}));

// Middleware for JSON body parsing
app.use(express.json());

// Session management
app.use(session({
    secret: 'cat',
    name: 'full-stack-session',
    resave: false,
    saveUninitialized: true,
}));

// CORS settings
app.use(cors({
    origin: true,
    credentials: true,
    methods: 'GET,PUT,POST,DELETE,OPTIONS,PATCH',
    allowedHeaders: 'Content-Type, Accept, Authorization',
}));

// API Endpoints
app.use('/', authRoutes);   // Auth-related routes
app.use('/', userRoutes);   // User-related routes
app.use('/', cardRoutes);   // Card-related routes

// Serve static files from 'public' folder when no API matches
app.use(express.static(path.join(__dirname, 'public')));

// Handle API and static file requests
app.use((req, res, next) => {
    // If no route matches, check for static files
    const filePath = path.join(__dirname, 'public', req.url);

    // Check if the requested file exists
    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (!err) {
            // If the file exists, serve it
            res.sendFile(filePath);
        } else {
            // If file does not exist, return 404
            res.status(404).send({
                error: "Not Found",
                message: "The requested resource was not found on this server."
            });
        }
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
