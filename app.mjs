import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import session from 'express-session';
import dotenv from 'dotenv';

dotenv.config();

const PORT = process.env.PORT;

// process.env.PORT

async function main() {
    await mongoose.connect(process.env.DB_URL);
    console.log('mongodb connection established on port 27017');
}

main().catch(err => console.log(err));

export const app = express();

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

import("./Handlers/Users/auth.mjs");
import("./Handlers/Users/users.mjs");
import("./Handlers/Cards/cards.mjs");