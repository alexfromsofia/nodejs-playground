const { model, Schema } = require("mongoose");
const validator = require("validator");

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },
    password: {
        type: String,
        trim: true,
        minLength: 7,
        validate(value) {
            if (value.includes("password")) {
                throw new Error("Please provide a stronger password.");
            }
        }
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        validate(value) {
            if (!validator.isEmail(value)) {
                throw new Error("Invalid email.");
            }
        }
    },
    age: {
        type: Number,
        default: 1,
        validate(value) {
            if (value <= 0) {
                throw new Error("Age must be a positive number.");
            }
        }
    }
});

const userEnums = ["age", "email", "name", "password"];

const User = model("User", userSchema);

module.exports = {
    User,
    userEnums
};
