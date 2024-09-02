import { app } from "../../app.mjs";
import { Card, validateRequiredFields } from "./cardsTemplate.mjs";
import { userCardGuard, userBusinessGuard, deleteGuard } from "../../guard.mjs";
import crypto from 'crypto';
import { cardValidationCreationJoi, cardValidationEditJoi } from "../Joi/UserValidationJoi.mjs";

app.get("/cards", async (req, res) => {
    res.send(await Card.find());
});


app.get("/cards/:id", async (req, res) => {
    const card = await Card.findOne({ _id: req.params.id });
    res.send(card);
});

app.get("/cards/my-cards", userCardGuard, async (req, res) => { // Need guard here for user id check
    res.send(await Card.find({ createdBy: req.user._id }));
});

app.post("/cards", userBusinessGuard, async (req, res) => {
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
    // req.body.bizNumber = Math.floor(Math.random() * 1000000000);


    const validate = cardValidationCreationJoi.validate(req.body, { allowUnknown: false });
    if (validate.error) {
        return res.status(400).send(validate.error.details[0].message);
    }

    // let bizNumCard = await Card.findOne({ bizNumber: req.body.bizNumber });
    // while (bizNumCard) {
    //     req.body.bizNumber = Math.floor(Math.random() * 1000000000);
    //     bizNumCard = await Card.findOne({ bizNumber: req.body.bizNumber });
    // }



    const card = new Card(req.body);
    await card.save();
    res.send(card);
});

// Like and dislike array
app.patch("/cards/:id", userBusinessGuard, async (req, res) => {
    const card = await Card.findOne({ _id: req.params.id });
    if (!card) {
        return res.status(404).send("Card not found");
    }

    // Check if the user's ID is in the likes array
    if (!card.likes.includes(req.user._id.toString())) {
        // Like the card by adding the user ID if not present
        await card.updateOne({ $addToSet: { likes: req.user._id } });
    } else {
        // Dislike the card by removing the user ID if present
        await card.updateOne({ $pull: { likes: req.user._id } });
    }


    res.send(card);
});

// Edit
app.put("/cards/:id", userBusinessGuard, async (req, res) => {
    const validate = cardValidationEditJoi.validate(req.body, { allowUnknown: false });
    if (validate.error) {
        return res.status(400).send(validate.error.details[0].message);
    }
    const cardDoc = await Card.findOne({ _id: req.params.id });
    if (!cardDoc) {
        return res.status(404).send("Card not found");
    }
    const newEditedCard = { ...cardDoc.toObject({ flattenMaps: true }), ...req.body };

    // const errormsg = validateRequiredFields(req.body);
    // if (errormsg) return res.status(400).send(errormsg);
    cardDoc.set(newEditedCard);
    await cardDoc.save();
    res.send(cardDoc);
});

app.delete("/cards/:id", deleteGuard, async (req, res) => { // Need new guard for admin and creator
    const card = await Card.findOne({ _id: req.params.id });
    if (!card) {
        return res.status(404).send("Card not found");
    }

    await Card.deleteOne({ _id: req.params.id });
    res.send(card);
});