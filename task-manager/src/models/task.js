const { model, Schema } = require("mongoose");

const taskSchema = new Schema({
    description: {
        type: String,
        required: true,
        trim: true
    },
    completed: {
        type: Boolean,
        default: false
    }
});

const taskEnums = ["description", "completed"];

const Task = model("Task", taskSchema);

module.exports = {
    Task,
    taskEnums
};
