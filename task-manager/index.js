const express = require("express");
require("./src/db/mongoose");

const { User, userEnums } = require("./src/models/user");
const { Task, taskEnums } = require("./src/models/task");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

/**
 * USERS
 */
app.post("/users", async (req, res) => {
    const user = new User(req.body);

    try {
        await user.save();

        res.status(201).send(user);
    } catch (error) {
        res.status(400).send(error);
    }
});

app.get("/users", async (req, res) => {
    try {
        const users = await User.find({});

        res.send(users);
    } catch (error) {
        res.status(400).send(error);
    }
});

app.get("/users/:id", async (req, res) => {
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

app.patch("/users/:id", async (req, res) => {
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

/**
 * TASKS
 */
app.post("/tasks", async (req, res) => {
    const task = new Task(req.body);

    try {
        await task.save();

        res.status(201).send(task);
    } catch (error) {
        res.status(400).send(error);
    }
});

app.get("/tasks", async (req, res) => {
    try {
        const tasks = await Task.find({});

        res.send(tasks);
    } catch (error) {
        res.status(400).send(error);
    }
});

app.get("/tasks/:id", async (req, res) => {
    const _id = req.params.id;

    try {
        const task = await Task.findById(_id);

        if (!task) {
            return res.status(404).send();
        }

        res.send(task);
    } catch (error) {
        res.status(500).send(error);
    }
});

app.patch("/tasks/:id", async (req, res) => {
    const updates = Object.keys(req.body);
    const isValidOperation = updates.every(update =>
        taskEnums.includes(update)
    );

    if (!isValidOperation) {
        return res.status(400).send({ error: "Invalid update!" });
    }

    try {
        const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
            // Return new updated user, rather than the found one before editing.
            new: true,
            runValidators: true
        });

        if (!task) {
            return res.status(404).send();
        }

        res.send(task);
    } catch (error) {
        res.status(500).send(error);
    }
});

app.listen(port, () => {
    console.log(`Server is runnung in port ${port}`);
});
