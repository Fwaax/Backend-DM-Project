import { app } from "../../app.mjs";
import { Card, validateRequiredFields } from "./cardsTemplate.mjs";
import { userCardGuard, userBusinessGuard, deleteGuard } from "../../guard.mjs";
import crypto from 'crypto';
import { cardValidationCreationJoi, cardValidationEditJoi } from "../Joi/UserValidationJoi.mjs";

import express from "express";

const router = express.Router()

router.get("/cards", async (req, res) => {
    res.send(await Card.find());
});


router.get("/cards/:id", async (req, res) => {
    const card = await Card.findOne({ _id: req.params.id });
    res.send(card);
});

router.get("/cards/my-cards", userCardGuard, async (req, res) => {
    res.send(await Card.find({ createdBy: req.user._id }));
});

router.post("/cards", userBusinessGuard, async (req, res) => {
    if (req.body.createdByUserId) {
        return res.status(400).send("You cannot insert 'createdByUserId' field");
    }
    if (req.body.bizNumber) {
        return res.status(400).send("You cannot insert 'bizNumber' field");
    }
    if (req.body.createdAt) {
        return res.status(400).send("You cannot insert 'createdAt' field");
    }
    req.body.createdByUserId = req.user._id;
    req.body.createdAt = new Date();
    req.body.bizNumber = crypto.randomInt(0, 281474976710655);


    const validate = cardValidationCreationJoi.validate(req.body, { allowUnknown: false });
    if (validate.error) {
        return res.status(400).send(validate.error.details[0].message);
    }

    const card = new Card(req.body);
    await card.save();
    res.send(card);
});

// Like and dislike array
router.patch("/cards/:id", userBusinessGuard, async (req, res) => {
    const card = await Card.findOne({ _id: req.params.id });
    if (!card) {
        return res.status(404).send("Card not found");
    }

    if (!card.likes.includes(req.user._id.toString())) {
        await card.updateOne({ $addToSet: { likes: req.user._id } });
    } else {
        await card.updateOne({ $pull: { likes: req.user._id } });
    }


    res.send(card);
});

// Edit
router.put("/cards/:id", userBusinessGuard, async (req, res) => {
    const validate = cardValidationEditJoi.validate(req.body, { allowUnknown: false });
    if (validate.error) {
        return res.status(400).send(validate.error.details[0].message);
    }
    const cardDoc = await Card.findOne({ _id: req.params.id });
    if (!cardDoc) {
        return res.status(404).send("Card not found");
    }
    const newEditedCard = { ...cardDoc.toObject({ flattenMaps: true }), ...req.body };

    cardDoc.set(newEditedCard);
    await cardDoc.save();
    res.send(cardDoc);
});

router.delete("/cards/:id", deleteGuard, async (req, res) => {
    const card = await Card.findOne({ _id: req.params.id });
    if (!card) {
        return res.status(404).send("Card not found");
    }

    await Card.deleteOne({ _id: req.params.id });
    res.send(card);
});

export default router;