const { model, Schema } = require("mongoose");

const taskSchema = new Schema({
    description: {
        type: String,
        trim: true
    },
    completed: {
        type: Boolean,
        default: false
    }
});

const Task = model("Task", taskSchema);

module.exports = Task;
