const express = require("express");
require("./src/db/mongoose");

const User = require("./src/models/user");

const app = express();
const port = process.env.PORT || 3000;

// THIS LINE IS MANDATORY
app.use(express.json());

app.post("/users", async (req, res) => {
    const user = new User(req.body);

    try {
        await user.save();

        res.send(user);
    } catch (error) {
        res.status(400);
        res.send(error);
    }
});

app.listen(port, () => {
    console.log(`Server is runnung in port ${port}`);
});
