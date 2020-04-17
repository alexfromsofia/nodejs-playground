const socket = io();
const form = document.getElementById("message-form");

socket.on("message", (data) => {
    console.log(data);
});

socket.on("submitMessage", (data) => {
    console.log(data);
});

form.addEventListener("submit", (event) => {
    event.preventDefault();
    const { value } = event.target.elements.message;

    socket.emit("submitMessage", value);

    input.value = "";
});
