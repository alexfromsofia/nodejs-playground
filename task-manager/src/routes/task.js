const express = require("express");
const router = new express.Router();

const authMiddleware = require("../middleware/authentication");
const { Task, taskEnums } = require("../models/task");

router.post("/tasks", authMiddleware, async (req, res) => {
    const task = new Task({
        ...req.body,
        owner: req.user._id,
    });

    try {
        await task.save();

        res.status(201).send(task);
    } catch (error) {
        res.status(400).send(error);
    }
});

router.get("/tasks", authMiddleware, async (req, res) => {
    const match = {};
    const sort = {};

    const { query } = req;

    if (query.completed) {
        match.completed = query.completed === "true";
    }

    if (query.sortBy) {
        const { sortBy } = query;
        const [sortType, order] = sortBy.split(":");
        sort[sortType] = order === "desc" ? -1 : 1;
    }

    try {
        await req.user
            .populate({
                path: "tasks",
                match,
                options: {
                    limit: parseInt(query.limit),
                    skip: parseInt(query.skip),
                },
                sort,
            })
            .execPopulate();

        res.send(req.user.tasks);
    } catch (error) {
        res.status(400).send(error);
    }
});

router.get("/tasks/:id", authMiddleware, async (req, res) => {
    const _id = req.params.id;

    try {
        const task = await Task.findOne({ _id, owner: req.user._id });

        if (!task) {
            return res.status(404).send();
        }

        res.send(task);
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
});

router.patch("/tasks/:id", authMiddleware, async (req, res) => {
    const updates = Object.keys(req.body);
    const isValidOperation = updates.every((update) =>
        taskEnums.includes(update)
    );

    if (!isValidOperation) {
        return res.status(400).send({ error: "Invalid update!" });
    }

    try {
        const task = await Task.findOne({
            _id: req.params.id,
            owner: req.user._id,
        });

        if (!task) {
            return res.status(404).send();
        }

        updates.forEach((update) => (task[update] = req.body[update]));

        await task.save();

        res.send(task);
    } catch (error) {
        res.status(500).send(error);
    }
});

router.delete("/tasks/:id", authMiddleware, async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({
            _id: req.params.id,
            owner: req.user._id,
        });

        if (!task) {
            return res.status(404).send();
        }

        res.send(task);
    } catch (error) {
        console.log(error);
        res.status(500).send(error);
    }
});

module.exports = router;
