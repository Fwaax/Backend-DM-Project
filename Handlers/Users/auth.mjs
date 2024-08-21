import { app } from "../../app.mjs";
import { User } from "./usersTemplate.mjs";
import bcrypt from 'bcrypt';
import { EMAIL_REGEX, HTTPS_REGEX, PASSWORD_REGEX, UserValidationJoi, LoginValidationJoi } from "../Joi/UserValidationJoi.mjs";
import { json } from "express";
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';


// Login (POST) -----
// Signup (POST) -----
// Logout (POST) -----

app.post("/login", async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
        return res.status(403).send("email or password is incorrect");
    }

    if (!EMAIL_REGEX.test(email)) {
        return res.status(403).send("email or password is incorrect");
    }

    if (!user.password || !PASSWORD_REGEX.test(password) || !await bcrypt.compare(password, user.password)) {
        return res.status(403).send("email or password is incorrect");
    }

    // req.session.user = user;

    const token = jwt.sign({
        _id: user._id,
        firstName: user.name.firstName,
        // middleName: user.name.middleName,
        // lastName: user.name.lastName,
        // email: user.email,
        // isBusiness: user.isBusiness,
        // isAdmin: user.isAdmin,
    }, process.env.JWT_SECRET, { expiresIn: '1h' });

    res.send(token);
});

app.post("/signup", async (req, res) => {
    const validate = UserValidationJoi.validate(req.body, { allowUnknown: false });

    if (validate.error) {
        return res.status(403).send(validate.error.details[0].message);
    }

    const responseJson = req.body;

    const email = responseJson.email;
    const password = responseJson.password;
    const web = responseJson.web;
    const url = responseJson.image.url;
    const alt = responseJson.image.alt;
    const firstName = responseJson.name.firstName;
    const middleName = responseJson.name.middleName;
    const lastName = responseJson.name.lastName;
    const phone = responseJson.phone;
    const state = responseJson.address.state;
    const city = responseJson.address.city;
    const country = responseJson.address.country;
    const street = responseJson.address.street;
    const houseNumber = responseJson.address.houseNumber;
    const zip = responseJson.address.zip;
    const isBusiness = responseJson.isBusiness;

    if (responseJson.isAdmin) {
        return res.status(400).send("Admin cannot be created");
    }

    if (!EMAIL_REGEX.test(email)) {
        return res.status(400).send("Invalid email");
    }
    // Check if password is valid
    if (!PASSWORD_REGEX.test(password)) {
        return res.status(400).send("Invalid password");
    }
    // Check if web is valid
    if (!HTTPS_REGEX.test(web)) {
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