const path = require("path");
const http = require("http");

const express = require("express");
const socketio = require("socket.io");
const Filter = require("bad-words");

const { generateMessage } = require("./utils");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

const port = process.env.PORT || 3000;
const publicPath = path.join(__dirname, "../public");

app.use(express.static(publicPath));

app.get("", (req, res) => {
    res.render(`${publicPath}/index.html`);
});

io.on("connection", (socket) => {
    console.log("New WS connection");

    socket.emit("message", generateMessage("Welcome!"));
    socket.broadcast.emit("message", generateMessage("A new user has joined!"));

    socket.on("sendMessage", (message, callback) => {
        const filter = new Filter();

        if (filter.isProfane(message)) {
            return callback("Profanity is not allowed!");
        }

        io.emit("message", generateMessage(message));
        callback();
    });

    socket.on("sendLocation", ({ latitude, longitude }, callback) => {
        io.emit(
            "locationMessage",
            generateMessage(
                `https://google.com/maps?q=${latitude},${longitude}`
            )
        );

        callback();
    });

    socket.on("disconnect", () => {
        io.emit("message", generateMessage("A user has left!"));
    });
});

server.listen(port, () => {
    console.log(`App listening on port ${port}`);
});
