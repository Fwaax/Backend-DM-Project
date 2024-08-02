import { app } from "../../app.mjs";
import { User } from "./usersTemplate.mjs";


// Change isBusiness status (POST) ------
// Edit user info (PUT)

app.get("/users", async (req, res) => {
    res.send(await User.find());
});

app.get("/users/:id", async (req, res) => {
    const user = await User.findById(req.params.id);

    if (!user) {
        return res.status(403).send({ message: "User not found" });
    }

    res.send(user);
});

// I think I copied this by mistake
app.post("/users", async (req, res) => {
    const user = new User({
        name: {
            firstName: req.body.firstName,
            middleName: req.body.middleName,
            lastName: req.body.lastName
        },
        email: req.body.email,
        password: req.body.password,
        web: req.body.web,
        phone: req.body.phone,
        image: {
            url: req.body.url,
            alt: req.body.alt
        },
        address: {
            state: req.body.state,
            city: req.body.city,
            country: req.body.country,
            street: req.body.street,
            houseNumber: req.body.houseNumber,
            zip: req.body.zip
        },
        isBusiness: req.body.isBusiness
    });

    const newUser = await user.save();

    res.send(newUser);
});

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