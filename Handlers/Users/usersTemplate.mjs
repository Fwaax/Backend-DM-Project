// import mongoose, { Schema } from "mongoose";

// const schema = new Schema({
//     name: {
//         firstName: String,
//         middleName: String,
//         lastName: String,
//     },
//     phone: String,
//     email: String,
//     password: String,
//     web: String,
//     image: {
//         url: String,
//         alt: String
//     },
//     address: {
//         state: String,
//         city: String,
//         country: String,
//         street: String,
//         houseNumber: Number,
//         zip: Number,
//     },
//     isBusiness: Boolean,
//     isAdmin: {
//         type: Boolean,
//         default: false
//     },
//     createdAt: Date,
// });

// export const User = mongoose.model("users", schema);

// ------------------------------------------------------------------
// A schema for nested subdocuments
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


// TODO: add new schemas for name and address and image

// Define a schema for nested subdocuments
// const nestedSchema = new mongoose.Schema({
//     detail: String
// }, { _id: true }); // Ensure _id is included

// Define a parent schema
// const parentSchema = new mongoose.Schema({
//     name: String,
//     nestedObjects: [nestedSchema] // Array of nested subdocuments
// });