import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

export const guard = (req, res, next) => {
    jwt.verify(req.headers.authorization, JWT_SECRET, (err, data) => {
        if (err) {
            res.status(401).send('User is not authorized');
        } else {
            next();
        }
    });
};

export const adminGuard = (req, res, next) => {
    jwt.verify(req.headers.authorization, JWT_SECRET, (err, data) => {
        if (err) {
            res.status(401).send('An error occured.');
            return; // <-----
        }

        if (!data.isAdmin && data._id !== req.params.id) {
            res.status(401).send('User is not authorized');
            return; // <-----
        }

        next();
    });
}

// export const adGuard = (req, res, next) => {
//     jwt.verify(req.headers.authorization, JWT_SECRET, (err, data) => {

//         if (data.isAdmin || data._id === req.params.id) {
//             if (err) {
//                 res.status(401).send('User is not authorized');
//             } else {
//                 next();
//             }
//         }
//         else {
//             res.status(401).send('User is not authorized');
//         }
//     });
// }

// export const adminGuard = (req, res, next) => {
//     const user = getUser(req);
//     if (user.isAdmin) {
//         next();
//     } else {
//         res.status(401).send('User is not authorized');
//     }
// };

// export const getUser = req => {
//     if (!req.headers.authorization) {
//         return null;
//     }

//     const user = jwt.decode(req.headers.authorization, process.env.JWT_SECRET);

//     if (!user) {
//         return null;
//     }

//     return user;
// }

// export const bussinessGuard = (req, res, next) => {
//     const user = getUser(req);

//     if (user?.isBusiness || user?.isAdmin) {
//         next();
//     } else {
//         res.status(401).send('User is not authorized');
//     }
// };