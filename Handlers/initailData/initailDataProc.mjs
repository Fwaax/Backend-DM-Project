import { Card } from "../Cards/cardsTemplate.mjs";
import { User } from "../Users/usersTemplate.mjs";
import { initailDataUsers, initailDataCards } from './initailData.mjs';
import bcrypt from 'bcrypt';
import crypto from 'crypto';


const initailDataProc = (async () => {
    const userAmount = await User.find().countDocuments();
    if (userAmount) {
        console.log("Initial data already exists");
        return;
    }
    console.log("Inserting initial data");

    const userIds = [];

    for (const u of initailDataUsers) {
        console.log(`Inserting user ${u.email}`);
        const user = new User(u);
        user.password = await bcrypt.hash(u.password, 10);
        const obj = await user.save();

        if (obj.isBusiness) {
            userIds.push(obj._id);
        }
        console.log(`Inserted user ${u.email}`);
    }

    for (const c of initailDataCards) {
        console.log(`Inserting card ${c.title}`);
        c.createdAt = new Date();
        c.bizNumber = crypto.randomInt(0, 281474976710655);
        const i = Math.floor(Math.random() * userIds.length);
        c.createdByUserId = userIds[i];
        const card = new Card(c);
        await card.save();

        console.log(`Inserted card ${c.title}`);
    }

    console.log("Initial data inserted");
}
);

export default initailDataProc;