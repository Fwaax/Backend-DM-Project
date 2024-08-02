import mongoose, { Schema } from "mongoose";

const schema = new Schema({
    name: {
        firstName: String,
        middleName: String,
        lastName: String,
    },
    phone: String,
    email: String,
    password: String,
    web: String,
    image: {
        url: String,
        alt: String
    },
    address: {
        state: String,
        city: String,
        country: String,
        street: String,
        houseNumber: Number,
        zip: Number,
    },
    isBusiness: Boolean,
    createdAt: Date,
});

export const User = mongoose.model("users", schema);