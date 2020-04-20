const path = require("path");
const http = require("http");

const express = require("express");
const socketio = require("socket.io");
const Filter = require("bad-words");

const { generateMessage } = require("./utils/messages");
const {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom,
} = require("./utils/users");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const port = process.env.PORT || 3000;
const publicPath = path.join(__dirname, "../public");
const systemMessage = "System message";

app.use(express.static(publicPath));

app.get("", (req, res) => {
    res.render(`${publicPath}/index.html`);
});

io.on("connection", (socket) => {
    socket.on("sendMessage", (message, callback) => {
        const user = getUser(socket.id);
        const filter = new Filter();

        if (filter.isProfane(message)) {
            return callback("Profanity is not allowed!");
        }
        io.to(user.room).emit("message", generateMessage(message, user));
        callback();
    });

    socket.on("sendLocation", ({ latitude, longitude }, callback) => {
        const user = getUser(socket.id);

        io.to(user.room).emit(
            "locationMessage",
            generateMessage(
                `https://google.com/maps?q=${latitude},${longitude}`,
                user
            )
        );

        callback();
    });

    socket.on("join", ({ username, room }, callback) => {
        const { error, user } = addUser({
            id: socket.id,
            username,
            room,
        });

        if (error) {
            return callback(error);
        }

        socket.join(user.room);

        socket.emit(
            "message",
            generateMessage("Welcome!", { ...user, username: systemMessage })
        );
        socket.broadcast.to(user.room).emit(
            "message",
            generateMessage(`${user.username} has joined!`, {
                ...user,
                username: systemMessage,
            })
        );
        io.to(user.room).emit("roomData", {
            room: user.room,
            users: getUsersInRoom(user.room),
        });

        callback();
    });

    socket.on("disconnect", () => {
        const user = removeUser(socket.id);

        if (user) {
            io.to(user.room).emit(
                "message",
                generateMessage(`${user.username} has left!`, {
                    ...user,
                    username: systemMessage,
                })
            );
            io.to(user.room).emit("roomData", {
                room: user.room,
                users: getUsersInRoom(user.room),
            });
        }
    });
});

server.listen(port, () => {
    console.log(`App listening on port ${port}`);
});
