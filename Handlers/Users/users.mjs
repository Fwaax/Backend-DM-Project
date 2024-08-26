import { app } from "../../app.mjs";
import { adminGuard } from "../../guard.mjs";
import { User } from "./usersTemplate.mjs";

app.get("/users", adminGuard, async (req, res) => {
    res.send(await User.find());
});

app.get("/users/:id", adminGuard, async (req, res) => {
    const user = await User.findOne({ _id: req.params.id }, '-password');
    const reqUser = req.user;

    if (!user) {
        return res.status(403).send({ message: "User not found" });
    }
    const data = { message: `Hello ${reqUser.name.firstName}`, data: user };
    res.send(data);
});

// Edit user info (PUT)
app.put("/users/:id", async (req, res) => {
    const {
        name: { firstName, middleName, lastName },
        phone,
        email,
        password,
        web,
        image: { url, alt },
        address: {
            state,
            city,
            country,
            street,
            houseNumber,
            zip
        },
        isBusiness
    } = req.body;
    const user = await User.findById(req.params.id);

    if (!user) {
        return res.status(403).send({ message: "User not found" });
    }

    user.name.firstName = firstName;
    user.name.middleName = middleName;
    user.name.lastName = lastName;
    user.email = email;
    user.password = password;
    user.web = web;
    user.phone = phone;
    user.image.url = url;
    user.image.alt = alt;
    user.address.state = state;
    user.address.city = city;
    user.address.country = country;
    user.address.street = street;
    user.address.houseNumber = houseNumber;
    user.address.zip = zip;
    user.isBusiness = isBusiness;

    await user.save();

    res.send(user);
});

app.delete("/users/:id", async (req, res) => {
    await User.findByIdAndDelete(req.params.id);
    res.end();
});

app.patch("/users/:id", async (req, res) => {
    try {
        const currentUser = await User.findById(req.params.id);
        if (!currentUser) {
            return res.status(403).send({ message: "User not found" });
        }

        const isBusinessBefore = currentUser.isBusiness;
        const inBusinessAfter = req.body.isBusiness;

        await User.findByIdAndUpdate(req.params.id, req.body);

        if (isBusinessBefore !== inBusinessAfter) {
            currentUser.isBusiness = inBusinessAfter;
            await currentUser.save();
        }
        else {
            res.send({ message: "The user already in this status" });
        }
        res.end();
    } catch (error) {
        return res.status(403).send({ message: "User not found" });
    }
});