const socket = io();

// Elements
const $messageForm = document.getElementById("message-form");
const $messageFormInput = $messageForm.querySelector("input");
const $messageFormButton = $messageForm.querySelector("button");
const $sendLocationButton = document.getElementById("send-location");
const $messages = document.getElementById("messages");

// Templates
const messageTemplate = document.getElementById("message-template").innerHTML;
const locationMessageTemplate = document.getElementById(
    "location-message-template"
).innerHTML;

socket.on("locationMessage", (message) => {
    const html = Mustache.render(locationMessageTemplate, {
        text: message.text,
        createdAt: moment(message.createdAt).format("h:mm a"),
    });
    $messages.insertAdjacentHTML("beforeend", html);
});

socket.on("message", (message) => {
    console.log(message);
    const html = Mustache.render(messageTemplate, {
        text: message.text,
        createdAt: moment(message.createdAt).format("h:mm a"),
    });
    $messages.insertAdjacentHTML("beforeend", html);
});

$messageForm.addEventListener("submit", (event) => {
    event.preventDefault();
    $messageFormButton.setAttribute("disabled", "disabled");

    const { value } = $messageFormInput;

    socket.emit("sendMessage", value, (error) => {
        $messageFormButton.removeAttribute("disabled");
        $messageFormInput.value = "";
        $messageFormButton.focus();

        if (error) {
            return console.log(error);
        }

        console.log("Delivered!");
    });
});

$sendLocationButton.addEventListener("click", (event) => {
    event.preventDefault();
    $sendLocationButton.setAttribute("disabled", "disabled");

    if (!navigator.geolocation) {
        return alert("Geolocation is not supported by your browser.");
    }

    navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        socket.emit("sendLocation", { latitude, longitude }, () => {
            console.log("Location shared");
            $sendLocationButton.removeAttribute("disabled");
        });
    });
});
