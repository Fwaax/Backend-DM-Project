import { app } from "../../app.mjs";
import { Card, validateRequiredFields } from "./cardsTemplate.mjs";
import { userCardGuard, userBusinessGuard } from "../../guard.mjs";

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
    req.body.createdByUserId = req.user._id;
    req.body.createdAt = new Date();
    const errormsg = validateRequiredFields(req.body);
    if (errormsg) return res.status(400).send(errormsg);
    const card = new Card(req.body);
    await card.save();
    res.send(card);
})