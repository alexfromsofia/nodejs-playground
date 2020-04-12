const { model, Schema } = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const validator = require("validator");
const { Task } = require("./task");

const userSchema = new Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true,
        },
        password: {
            type: String,
            trim: true,
            required: true,
            minLength: 7,
            validate(value) {
                if (value.includes("password")) {
                    throw new Error("Please provide a stronger password.");
                }
            },
        },
        email: {
            type: String,
            unique: true,
            trim: true,
            lowercase: true,
            validate(value) {
                if (!validator.isEmail(value)) {
                    throw new Error("Invalid email.");
                }
            },
        },
        age: {
            type: Number,
            default: 1,
            validate(value) {
                if (value <= 0) {
                    throw new Error("Age must be a positive number.");
                }
            },
        },
        tokens: [
            {
                token: {
                    type: String,
                    required: true,
                },
            },
        ],
        avatar: {
            type: Buffer,
        },
    },
    { timestamps: true }
);

userSchema.virtual("tasks", {
    ref: "Task",
    localField: "_id",
    foreignField: "owner",
});

const userEnums = ["age", "email", "name", "password"];

userSchema.methods.generateAuthToken = async function () {
    const user = this;
    const token = jwt.sign(
        { _id: user._id.toString() },
        process.env.JWT_SECRET
    );
    user.tokens = user.tokens.concat({ token });

    await user.save();
    return token;
};

userSchema.methods.toJSON = function () {
    const user = this;
    const userObject = user.toObject();

    delete userObject.password;
    delete userObject.tokens;
    delete userObject.avatar;

    return userObject;
};

userSchema.statics.findByCredentials = async (email, password) => {
    const user = await User.findOne({ email });

    if (!user) {
        throw new Error("Unable to login.");
    }
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
        throw new Error("Unable to login.");
    }

    return user;
};

// Schema Middleware for hashing password before save
// Must be a standart function in order to bind the this to userSchema
userSchema.pre("save", async function (next) {
    const user = this;

    if (user.isModified("password")) {
        user.password = await bcrypt.hash(user.password, 8);
    }

    next();
});

userSchema.pre("remove", async function (next) {
    const user = this;

    await Task.deleteMany({ owner: user._id });
    next();
});

const User = model("User", userSchema);

module.exports = {
    User,
    userEnums,
};
