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

    socket.emit("submitMessage", value, (error) => {
        if (error) {
            return console.log(error);
        }

        console.log("Delivered!");
    });

    input.value = "";
});

document.getElementById("send-location").addEventListener("click", (event) => {
    if (!navigator.geolocation) {
        return alert("Geolocation is not supported by your browser.");
    }

    navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        socket.emit("sendLocation", { latitude, longitude }, () => {
            console.log("Location shared");
        });
    });
});
