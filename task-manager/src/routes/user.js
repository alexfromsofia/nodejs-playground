const express = require("express");
const router = new express.Router();

const authMiddleware = require("../middleware/authentication");
const { User, userEnums } = require("../models/user");

router.post("/users", async (req, res) => {
    const user = new User(req.body);

    try {
        await user.save();
        const token = await user.generateAuthToken();

        res.status(201).send({ user, token });
    } catch (error) {
        res.status(400).send(error);
    }
});

router.post("/users/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findByCredentials(email, password);
        const token = await user.generateAuthToken();

        res.send({ user, token });
    } catch (error) {
        res.status(400).send();
    }
});

router.post("/users/logout", authMiddleware, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter(
            (token) => token.token !== req.token
        );

        await req.user.save();

        res.send();
    } catch (error) {
        res.status(400).send();
    }
});

router.post("/users/logoutAll", authMiddleware, async (req, res) => {
    try {
        req.user.tokens = [];
        await req.user.save();

        res.send();
    } catch (error) {
        res.status(400).send();
    }
});

router.get("/users/me", authMiddleware, async (req, res) => {
    res.send(req.user);
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

router.patch("/users/me", authMiddleware, async (req, res) => {
    const updates = Object.keys(req.body);
    const isValidOperation = updates.every((update) =>
        userEnums.includes(update)
    );

    if (!isValidOperation) {
        return res.status(400).send({ error: "Invalid updates!" });
    }

    try {
        updates.forEach((update) => (req.user[update] = req.body[update]));
        await req.user.save();

        res.send(req.user);
    } catch (error) {
        res.status(500).send(error);
    }
});

router.delete("/users/me", authMiddleware, async (req, res) => {
    try {
        await req.user.remove();

        res.send(req.user);
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
});

module.exports = router;
