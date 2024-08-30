import jwt from 'jsonwebtoken';
import { User } from './Handlers/Users/usersTemplate.mjs';
import dotenv from 'dotenv';

const JWT_SECRET = process.env.JWT_SECRET;

// export const guard = async (req, res, next) => {
//     const token = req.headers.authorization;

//     if (!token) {
//         return res.status(401).send('No token provided');
//     }

//     try {
//         const user = await User.findOne({ _id })

//         if (!user) {
//             return res.status(404).send('User not found');
//         }
//         if (!user.isAdmin) {
//             return res.status(401).send('User is not authorized');
//         }

//         next();
//     }
//     catch (err) {
//         console.error(err);
//         return res.status(401).send('Invalid token');
//     }
// }

export const adminGuard = async (req, res, next) => {
    const token = req.headers.authorization;

    if (!token) {
        return res.status(401).send('No token provided');
    }

    try {
        // Verify the token and extract the user ID
        const data = jwt.verify(token, JWT_SECRET);
        const userId = data._id;

        // Look up the user in the database
        // const users = await User.find({ _id: userId }).select('-password');
        // const user = users[0];
        const user = await User.findOne({ _id: userId }, '-password');


        if (!user) {
            return res.status(404).send('User not found');
        }

        // Store the user object in req.user for further use
        req.user = user;
        console.log(user);
        console.log(user._id);

        // Check if the user is authorized (either an admin or the user with the matching _id)
        if (!user.isAdmin && user._id.toString() !== req.params.id) {
            return res.status(401).send('User is not authorized');
        }

        // Proceed to the next middleware
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
        // Verify the token and extract the user ID
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
        // Verify the token and extract the user ID
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
        // Verify the token and extract the user ID
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