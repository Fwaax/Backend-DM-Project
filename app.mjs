import express from 'express';
import cors from 'cors';
import mongoose from 'mongoose';
import session from 'express-session';

const PORT = 6969;

async function main() {
    await mongoose.connect('mongodb://127.0.0.1:27017/Ryan-MongoDB-Project');
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