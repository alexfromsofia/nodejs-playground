const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const { User } = require("../../src/models/user");
const { Task } = require("../../src/models/task");

// First User
const userOneId = new mongoose.Types.ObjectId();
const userOne = {
    _id: userOneId,
    name: "Mike",
    email: "mike@test.com",
    password: "123456",
    tokens: [{ token: jwt.sign({ _id: userOneId }, process.env.JWT_SECRET) }],
};
const userOneBearerToken = `Bearer ${userOne.tokens[0].token}`;

// Second User
const userTwoId = new mongoose.Types.ObjectId();
const userTwo = {
    _id: userTwoId,
    name: "David",
    email: "david@test.com",
    password: "654321",
    tokens: [{ token: jwt.sign({ _id: userTwoId }, process.env.JWT_SECRET) }],
};
const userTwoBearerToken = `Bearer ${userTwo.tokens[0].token}`;

// Tasks
const taskOne = {
    _id: new mongoose.Types.ObjectId(),
    description: "Task One Description",
    completed: false,
    owner: userOneId,
};
const taskTwo = {
    _id: new mongoose.Types.ObjectId(),
    description: "Task Two Description",
    completed: true,
    owner: userOneId,
};
const taskThree = {
    _id: new mongoose.Types.ObjectId(),
    description: "Task Three Description",
    completed: true,
    owner: userTwoId,
};

const setupDatabase = async () => {
    await User.deleteMany();
    await Task.deleteMany();
    await new User(userOne).save();
    await new User(userTwo).save();
    await new Task(taskOne).save();
    await new Task(taskTwo).save();
    await new Task(taskThree).save();
};

module.exports = {
    userOneId,
    userOne,
    userOneBearerToken,
    userTwoId,
    userTwo,
    userTwoBearerToken,
    taskOne,
    taskTwo,
    taskThree,
    setupDatabase,
};
