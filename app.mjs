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

// process.env.PORT

async function main() {
    await mongoose.connect(process.env.DB_URL);
    console.log('mongodb connection established on port 27017');
    initailDataProc();
}

main().catch(err => console.log(err));

export const app = express();

app.use(morgan((tokens, req, res) => {
    const status = tokens.status(req, res);
    const method = tokens.method(req, res);
    const url = tokens.url(req, res);
    const responseTime = tokens['response-time'](req, res);
    const contentLength = tokens.res(req, res, 'content-length') || '0';

    // Colorize different parts of the log using chalk
    const coloredStatus = status >= 500
        ? chalk.red(status)
        : status >= 400
            ? chalk.yellow(status)
            : status >= 300
                ? chalk.cyan(status)
                : chalk.green(status);

    const coloredMethod = chalk.blue(method);
    const coloredUrl = chalk.magenta(url);
    const coloredResponseTime = chalk.white(`${responseTime} ms`);
    const coloredContentLength = chalk.gray(`${contentLength} bytes`);

    // Return the formatted log string with color
    return [
        coloredMethod,
        coloredUrl,
        coloredStatus,
        coloredContentLength,
        '-',
        coloredResponseTime,
        chalk.greenBright(new Date().toString()) // Add the timestamp
    ].join(' ');
}));





app.use(express.json());

app.use(session({
    secret: 'cat',
    name: 'full-stack-session',
    resave: false,
    saveUninitialized: true,
}));

app.use(cors({
    origin: true,
    credentials: true,
    methods: 'GET,PUT,POST,DELETE,OPTIONS,PATCH',
    allowedHeaders: 'Content-Type, Accept, Authorization',
}));

app.listen(PORT, () => {
    console.log(`listening on port ${PORT}`);
});

app.get('/', (req, res) => {
    res.send({
        user: req.session.user,
        message: "Welcome to MongoDB!",
    });
});


// Serve static files from the 'public' folder
app.use(express.static(path.join(__dirname, 'public')));

// Route unsupported endpoints to public files if they exist
app.use((req, res, next) => {
    const filePath = path.join(__dirname, 'public', req.url);

    // Check if the requested file exists in the 'public' directory
    fs.access(filePath, fs.constants.F_OK, (err) => {
        if (!err) {
            // If the file exists, serve it
            res.sendFile(filePath);
        } else {
            // If the file does not exist, return a 404 error
            res.status(404).send({
                error: "Not Found",
                message: "The requested resource was not found on this server."
            });
        }
    });
});


// import("./Handlers/Users/auth.mjs");
// import("./Handlers/Users/users.mjs");
// import("./Handlers/Cards/cards.mjs");


app.use('/', authRoutes);   // All auth-related routes
app.use('/', userRoutes);  // All user-related routes
app.use('/', cardRoutes);  // All card-related routes