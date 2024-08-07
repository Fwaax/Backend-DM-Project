import Joi from "joi";
import { User } from "../Users/usersTemplate.mjs";


export const EMAIL_REGEX = /^[a-zA-Z0-9._+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
export const HTTPS_REGEX = /^https:\/\/.+$/;
export const PASSWORD_REGEX = /^(?=(?:.*[A-Z]){3})(?=(?:.*[a-z]){3})(?=(?:.*\d){1})(?=(?:.*[!@#$%^&*]){1}).*$/;  // at least 3 uppercase, 3 lowercase, 1 number, 1 special character



// Signup
export const UserValidationJoi = Joi.object({
    name: Joi.object({
        firstName: Joi.string().min(2).max(20).required(),
        middleName: Joi.string(),
        lastName: Joi.string().min(2).max(20).required(),
    }).required(),
    phone: Joi.string().required(),
    email: Joi.string().email().pattern(EMAIL_REGEX).required(),
    password: Joi.string().min(8).max(20).pattern(PASSWORD_REGEX).required(),
    web: Joi.string().pattern(HTTPS_REGEX).required(),
    image: Joi.object({
        url: Joi.string().pattern(HTTPS_REGEX).required(),
        alt: Joi.string().required()
    }).required(),
    address: Joi.object({
        state: Joi.string().required(),
        city: Joi.string().required(),
        country: Joi.string().required(),
        street: Joi.string().required(),
        houseNumber: Joi.number().required(),
        zip: Joi.number().required(),
    }).required(),
    isBusiness: Joi.boolean(),
});

// Login
export const LoginValidationJoi = Joi.object({
    email: Joi.string().email().pattern(EMAIL_REGEX).required(),
    password: Joi.string().min(7).max(20).pattern(PASSWORD_REGEX).required(),
});