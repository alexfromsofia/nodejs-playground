const request = require("supertest");
const app = require("../src/app");
const { User } = require("../src/models/user");
const {
    userOneId,
    userOne,
    userOneBearerToken,
    setupDatabase,
} = require("./fixtures/db");

beforeEach(setupDatabase);

/**
 * TODO: Should not signup user with invalid name/email/password
 * TODO: Should not update user if unauthenticated
 * TODO: Should not update user with invalid name/email/password
 * TODO: Should not delete user if unauthenticated
 */

test("Should signup a new user", async () => {
    const newUserCredentials = { name: "Alex One", email: "alexxxx@test.com" };
    const response = await request(app)
        .post("/users")
        .send({
            ...newUserCredentials,
            password: "123123123123",
        })
        .expect(201);

    // Assert DB was changed correctly
    const user = await User.findById(response.body.user._id);

    // Assertions about the response
    expect(user).not.toBeNull();
    expect(user).toMatchObject({
        ...newUserCredentials,
        tokens: user.tokens,
    });
});

test("Should login existing user", async () => {
    const credentials = {
        email: userOne.email,
        password: userOne.password,
    };
    const response = await request(app)
        .post("/users/login")
        .send(credentials)
        .expect(200);

    const user = await User.findById(userOneId);

    expect(response.body.token).toBe(user.tokens[1].token);
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

test("Should get profile for user", async () => {
    await request(app)
        .get("/users/me")
        .set("Authorization", userOneBearerToken)
        .send()
        .expect(200);
});

test("Should not get profile for unauthanticated user", async () => {
    await request(app)
        .get("/users/me")
        .set("Authorization", "Bearer")
        .send()
        .expect(401);
});

test("Should delete user", async () => {
    const response = await request(app)
        .delete("/users/me")
        .set("Authorization", userOneBearerToken)
        .send()
        .expect(200);

    const user = await User.findById(userOneId);
    // Assert that user has been deleted
    expect(user).toBeNull();
});

test("Should not delete profile for unathenticated user", async () => {
    await request(app)
        .delete("/users/me")
        .set("Authorization", "Bearer")
        .send()
        .expect(401);
});

test("Should upload avatar image", async () => {
    await request(app)
        .post("/users/me/avatar")
        .set("Authorization", userOneBearerToken)
        .attach("avatar", "tests/fixtures/profile-pic.jpg")
        .expect(200);

    const user = await User.findById(userOneId);
    expect(user.avatar).toEqual(expect.any(Buffer));
});

test("Should update valid user fields", async () => {
    const name = "Alex";
    await request(app)
        .patch("/users/me")
        .set("Authorization", userOneBearerToken)
        .send({ name })
        .expect(200);

    const user = await User.findById(userOneId);
    expect(user.name).toBe(name);
});

test("Should not update invalid user fields", async () => {
    await request(app)
        .patch("/users/me")
        .set("Authorization", userOneBearerToken)
        .send({ location: "Sofia" })
        .expect(400);
});
