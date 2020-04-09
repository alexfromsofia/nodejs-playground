const express = require("express");
require("./src/db/mongoose");

const userRoutes = require("./src/routes/user");
const taskRoutes = require("./src/routes/task");

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
/**
 * Routes
 */
app.use(userRoutes);
app.use(taskRoutes);

app.listen(port, () => {
    console.log(`Server is runnung in port ${port}`);
});
