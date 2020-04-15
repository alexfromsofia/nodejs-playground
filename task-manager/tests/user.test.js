const request = require("supertest");
const app = require("../src/app");
const { User } = require("../src/models/user");

const userOne = {
    name: "Mike",
    email: "mike@test.com",
    password: "123456",
};

beforeEach(async () => {
    await User.deleteMany();
    await new User(userOne).save();
});

test("Should signup a new user", async () => {
    await request(app)
        .post("/users")
        .send({
            name: "Alex One",
            email: "alexxxx@test.com",
            password: "123123123123",
        })
        .expect(201);
});

test("Should login existing user", async () => {
    await request(app)
        .post("/users/login")
        .send({
            email: userOne.email,
            password: userOne.password,
        })
        .expect(200);
});

test("Should not login if wrong email is provided", async () => {
    await request(app)
        .post("/users/login")
        .send({
            email: "wrong@gmail.bg",
            password: userOne.password,
        })
        .expect(400);
});

test("Should not login if wrong password is provided", async () => {
    await request(app)
        .post("/users/login")
        .send({
            email: userOne.email,
            password: "wrongpassword",
        })
        .expect(400);
});
