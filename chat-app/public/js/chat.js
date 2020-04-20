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

// Options
const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true,
});

const formatDate = (timestamp) => moment(timestamp).format("h:mm a");

socket.on("locationMessage", ({ createdAt, ...rest }) => {
    const html = Mustache.render(locationMessageTemplate, {
        createdAt: formatDate(createdAt),
        ...rest,
    });
    $messages.insertAdjacentHTML("beforeend", html);
});

socket.on("message", ({ createdAt, ...rest }) => {
    const html = Mustache.render(messageTemplate, {
        createdAt: formatDate(createdAt),
        ...rest,
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
            $sendLocationButton.removeAttribute("disabled");
        });
    });
});

socket.emit("join", { username, room }, (error) => {
    if (error) {
        console.log(error);
        alert(error);
        location.href = "/";
    }
});
