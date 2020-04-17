const request = require("supertest");
const app = require("../src/app");
const { Task } = require("../src/models/task");
const {
    userOneBearerToken,
    userTwoBearerToken,
    setupDatabase,
    taskOne,
    taskThree,
} = require("./fixtures/db");

beforeEach(setupDatabase);

/**
 * TODO: Should sort tasks by description/completed/createdAt/updatedAt
 * TODO: Should fetch page of tasks
 */
test("Should create task for user", async () => {
    const description = "Test";
    const response = await request(app)
        .post("/tasks")
        .set("Authorization", userOneBearerToken)
        .send({ description })
        .expect(201);

    const task = await Task.findById(response.body._id);

    // Check if task has been created
    expect(task).not.toBeNull();

    // Check if description has been added and completed is set to false
    expect(task.description).toBe(description);
    expect(task.completed).toBe(false);
});

test("Should not create task with invalid description/completed", async () => {
    const response = await request(app)
        .post("/tasks")
        .set("Authorization", userOneBearerToken)
        .send({ completed: 2 })
        .expect(400);

    const { errors } = response.body;

    // Check if errors per field are being sent from server
    expect(errors.description).not.toBeNull();
    expect(errors.completed).not.toBeNull();

    const task = await Task.find();

    // Assure no new task has been created
    expect(task.length).toBe(3);
});

test("Should get tasks for a particular user", async () => {
    const response = await request(app)
        .get("/tasks")
        .set("Authorization", userOneBearerToken)
        .send()
        .expect(200);

    expect(response.body.length).toEqual(2);
});

test("Should fetch user task by id", async () => {
    const response = await request(app)
        .get(`/tasks/${taskOne._id}`)
        .set("Authorization", userOneBearerToken)
        .send()
        .expect(200);

    expect(response.body._id.toString()).toBe(taskOne._id.toString());
});

test("Should fetch user task by id", async () => {
    await request(app)
        .get(`/tasks/${taskOne._id}`)
        .set("Authorization", userTwoBearerToken)
        .send()
        .expect(404);
});

test("Should not fetch other users task by id", async () => {
    await request(app)
        .get(`/tasks/${taskThree._id}`)
        .set("Authorization", userOneBearerToken)
        .send()
        .expect(404);
});

test("Should fetch only completed tasks", async () => {
    const response = await request(app)
        .get(`/tasks?completed=true`)
        .set("Authorization", userOneBearerToken)
        .send()
        .expect(200);

    expect(response.body.length).toBe(1);
});

test("Should fetch only incomplete tasks", async () => {
    const response = await request(app)
        .get(`/tasks?completed=false`)
        .set("Authorization", userOneBearerToken)
        .send()
        .expect(200);

    expect(response.body.length).toBe(1);
});

test("Should not update other users task", async () => {
    await request(app)
        .patch(`/tasks/${taskOne._id}`)
        .set("Authorization", userTwoBearerToken)
        .send()
        .expect(404);

    const task = await Task.findById(taskOne._id);

    expect(task).not.toBeNull();
});

test("Should not update task with invalid description", async () => {
    await request(app)
        .patch(`/tasks/${taskOne._id}`)
        .set("Authorization", userOneBearerToken)
        .send({ description: null })
        .expect(500);

    const task = await Task.findById(taskOne._id);

    expect(task.description).toBe(taskOne.description);
});

test("Should not update task with invalid completed", async () => {
    await request(app)
        .patch(`/tasks/${taskOne._id}`)
        .set("Authorization", userOneBearerToken)
        .send({ completed: 2 })
        .expect(500);

    const task = await Task.findById(taskOne._id);

    expect(task.completed).toBe(taskOne.completed);
});

test("Should not delete other users task", async () => {
    await request(app)
        .delete(`/tasks/${taskOne._id}`)
        .set("Authorization", userTwoBearerToken)
        .send()
        .expect(404);

    const task = await Task.findById(taskOne._id);

    expect(task).not.toBeNull();
});

test("Should delete user task", async () => {
    await request(app)
        .delete(`/tasks/${taskOne._id}`)
        .set("Authorization", userOneBearerToken)
        .send()
        .expect(200);

    const task = await Task.findById(taskOne._id);

    expect(task).toBeNull();
});

test("Should not delete task if unauthenticated", async () => {
    await request(app)
        .delete(`/tasks/${taskOne._id}`)
        .set("Authorization", "Bearer")
        .send()
        .expect(401);
});
