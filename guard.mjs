import jwt from 'jsonwebtoken';
import { User } from './Handlers/Users/usersTemplate.mjs';
import dotenv from 'dotenv';

dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;

export const adminGuard = async (req, res, next) => {
    const token = req.headers.authorization;


    if (!token) {
        return res.status(401).send('No token provided');
    }

    try {
        const data = jwt.verify(token, JWT_SECRET);
        const userId = data._id;
        const user = await User.findOne({ _id: userId }, '-password');


        if (!user) {
            return res.status(404).send('User not found');
        }

        req.user = user;
        console.log(user);
        console.log(user._id);

        if (!user.isAdmin && user._id.toString() !== req.params.id) {
            return res.status(401).send('User is not authorized');
        }

        next();
    } catch (err) {
        console.error(err);
        return res.status(401).send('Invalid token');
    }
}

export const userCardGuard = async (req, res, next) => {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).send('No token provided');
    }

    try {
        const data = jwt.verify(token, JWT_SECRET);
        const userId = data._id;

        const user = await User.findOne({ _id: userId }, '-password');

        if (!user) {
            return res.status(404).send('User not found');
        }
        req.user = user;
        next();
    } catch (err) {
        console.error(err);
        return res.status(401).send('Invalid token');
    }
}

export const userBusinessGuard = async (req, res, next) => {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).send('No token provided');
    }

    try {
        const data = jwt.verify(token, JWT_SECRET);
        const userId = data._id;

        const user = await User.findOne({ _id: userId }, '-password');

        if (!user) {
            return res.status(404).send('User not found');
        }

        if (!user.isBusiness) {
            return res.status(401).send('User is not authorized');
        }
        req.user = user;
        next();
    } catch (err) {
        console.error(err);
        return res.status(401).send('Invalid token');
    }
}

export const deleteGuard = async (req, res, next) => {
    const token = req.headers.authorization;
    if (!token) {
        return res.status(401).send('No token provided');
    }

    try {
        const data = jwt.verify(token, JWT_SECRET);
        const userId = data._id;

        const user = await User.findOne({ _id: userId }, '-password');
        if (!user) {
            return res.status(404).send('User not found');
        }

        if (user.isAdmin || req.body._id === userId) {
            next();
            return
        }
        return res.status(401).send('User is not authorized');

    } catch (err) {
        console.error(err);
        return res.status(401).send('Invalid token');
    }
}