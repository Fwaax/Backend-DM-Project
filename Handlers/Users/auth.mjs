import { app } from "../../app.mjs";
import { User } from "./usersTemplate.mjs";
import bcrypt from 'bcrypt';
import { JWT_SECRET } from "../../config.mjs";
// import UserValidationJoi from "../Joi/UserValidationJoi.mjs";


// Login (POST) -----
// Signup (POST) -----
// Logout (POST) -----

app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
        return res.status(403).send("email or password is incorrect");
    }

    if (!user.password || !await bcrypt.compare(password, user.password)) {
        return res.status(403).send("email or password is incorrect");
    }

    req.session.user = user;

    res.send(user);
});

app.post("/signup", async (req, res) => {
    const {
        name: { firstName, middleName, lastName } = {},
        phone,
        email,
        password,
        web,
        image: { url, alt } = {},
        address: {
            state,
            city,
            country,
            street,
            houseNumber,
            zip
        } = {},
        isBusiness
    } = req.body;

    // Check for missing fields
    const requiredFields = {
        "name.firstName": firstName,
        "name.middleName": middleName,
        "name.lastName": lastName,
        phone,
        email,
        password,
        web,
        "image.url": url,
        "image.alt": alt,
        "address.state": state,
        "address.city": city,
        "address.country": country,
        "address.street": street,
        "address.houseNumber": houseNumber,
        "address.zip": zip,
        isBusiness
    };

    for (const [key, value] of Object.entries(requiredFields)) {
        if (!value) {
            return res.status(400).send(`Missing field: ${key}`);
        }
    }

    // Check if email is valid
    if (!email.match(EMAIL_REGEX)) {
        return res.status(400).send("Invalid email");
    }

    // Check if password is valid
    if (!password.match(PASSWORD_REGEX)) {
        return res.status(400).send("Invalid password");
    }

    // Check if web is valid
    if (!web.match(HTTPS_REGEX)) {
        return res.status(400).send("Invalid web");
    }

    // Check if email is already in use
    if (await User.findOne({ email })) {
        return res.status(403).send("Email already in use");
    }

    // Create a new user
    const user = new User({
        name: {
            firstName,
            middleName,
            lastName
        },
        phone,
        email,
        password: await bcrypt.hash(password, 10),
        web,
        image: {
            url,
            alt
        },
        address: {
            state,
            city,
            country,
            street,
            houseNumber,
            zip
        },
        isBusiness,
        createdAt: new Date()
    });

    const newUser = await user.save();
    res.send(newUser);
});



app.post("/logout", (req, res) => {
    delete req.session.user;
    res.end();
})