const express = require("express");
const router = new express.Router();

const { User, userEnums } = require("../models/user");

router.post("/users", async (req, res) => {
    const user = new User(req.body);

    try {
        await user.save();

        res.status(201).send(user);
    } catch (error) {
        res.status(400).send(error);
    }
});

router.get("/users", async (req, res) => {
    try {
        const users = await User.find({});

        res.send(users);
    } catch (error) {
        res.status(400).send(error);
    }
});

router.get("/users/:id", async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).send();
        }

        res.send(user);
    } catch (error) {
        res.status(500).send(error);
    }
});

router.patch("/users/:id", async (req, res) => {
    const updates = Object.keys(req.body);
    const isValidOperation = updates.every(update =>
        userEnums.includes(update)
    );

    if (!isValidOperation) {
        res.status(400).send({ error: "Invalid updates!" });
    }

    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, {
            // Return new updated user, rather than the found one before editing.
            new: true,
            runValidators: true
        });

        if (!user) {
            return res.status(404).send();
        }

        res.send(user);
    } catch (error) {
        res.status(500).send(error);
    }
});

router.delete("/users/:id", async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);

        if (!user) {
            return res.status(404).send();
        }

        req.send(user);
    } catch (error) {
        res.status(500).send(error);
    }
});

module.exports = router;