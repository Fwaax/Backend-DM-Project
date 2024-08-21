import mongoose, { Schema } from "mongoose";

const NameSchema = new Schema({
    _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
    firstName: String,
    middleName: String,
    lastName: String,
});

const ImageSchema = new Schema({
    _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
    url: String,
    alt: String,
});

const AddressSchema = new Schema({
    _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
    state: String,
    city: String,
    country: String,
    street: String,
    houseNumber: Number,
    zip: Number,
});

const schema = new Schema({
    name: NameSchema,
    phone: String,
    email: String,
    password: String,
    web: String,
    image: ImageSchema,
    address: AddressSchema,
    isBusiness: Boolean,
    isAdmin: {
        type: Boolean,
        default: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export const User = mongoose.model("users", schema);