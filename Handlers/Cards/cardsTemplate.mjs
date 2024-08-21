import mongoose, { Schema } from "mongoose";

const LikeSchema = new Schema({
    _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
    likedBy: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
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
    title: String,
    subtitle: String,
    description: String,
    phone: String,
    email: String,
    password: String,
    web: String,
    image: ImageSchema,
    address: AddressSchema,
    bizNumber: Number,
    likes: [LikeSchema],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "users" },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export const Card = mongoose.model("cards", schema);