import jwt from 'jsonwebtoken';

export const guard = (req, res, next) => {
    jwt.verify(req.headers.authorization, JWT_SECRET, (err, data) => {
        if (err) {
            res.status(401).send('User is not authorized');
        } else {
            next();
        }
    });
};

// export const bussinessGuard = (req, res, next) => {
//     const user = getUser(req);

//     if (user?.isBusiness || user?.isAdmin) {
//         next();
//     } else {
//         res.status(401).send('User is not authorized');
//     }
// };