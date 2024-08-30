import mongoose, { Schema } from "mongoose";

const LikeSchema = new Schema({
    user_id: { type: mongoose.Schema.Types.ObjectId, ref: "users", required: true },
});

const ImageSchema = new Schema({
    _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
    url: { type: String, required: true },
    alt: { type: String, required: true },
});

const AddressSchema = new Schema({
    _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
    state: { type: String, required: true },
    city: { type: String, required: true },
    country: { type: String, required: true },
    street: { type: String, required: true },
    houseNumber: { type: Number, required: true },
    zip: { type: Number, required: true },
});

const cardSchema = new Schema({
    title: { type: String, required: true },
    subtitle: { type: String, required: true },
    description: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
    web: { type: String, required: true },
    image: { type: ImageSchema, required: true },
    address: { type: AddressSchema, required: true },
    bizNumber: { type: Number, required: true },
    likes: { type: [String], required: true },
    createdByUserId: { type: mongoose.Schema.Types.ObjectId, ref: "users", required: true },
    createdAt: { type: Date, default: Date.now },
});

// Function to validate required fields
function validateRequiredFields(data) {
    const errors = [];

    // Check for missing fields in the card schema
    if (!data.title) errors.push("title");
    if (!data.subtitle) errors.push("subtitle");
    if (!data.description) errors.push("description");
    if (!data.phone) errors.push("phone");
    if (!data.email) errors.push("email");
    if (!data.web) errors.push("web");

    // Check if image fields are provided
    if (!data.image || !data.image.url || !data.image.alt) {
        errors.push("image fields (url, alt)");
    }

    // Check if address fields are provided
    if (!data.address) {
        errors.push("address");
    } else {
        if (!data.address.state) errors.push("address.state");
        if (!data.address.city) errors.push("address.city");
        if (!data.address.country) errors.push("address.country");
        if (!data.address.street) errors.push("address.street");
        if (!data.address.houseNumber) errors.push("address.houseNumber");
        if (!data.address.zip) errors.push("address.zip");
    }

    if (!data.bizNumber) errors.push("bizNumber");
    if (!data.createdByUserId) errors.push("createdByUserId");

    // Return error if any fields are missing
    if (errors.length > 0) {
        return `Missing required fields: ${errors.join(", ")}`;
    }

    // Return null if no errors
    return null;
}

const Card = mongoose.model("cards", cardSchema);

export { Card, validateRequiredFields };
