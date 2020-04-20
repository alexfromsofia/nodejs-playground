const socket = io();

// Elements
const $messageForm = document.getElementById("message-form");
const $messageFormInput = $messageForm.querySelector("input");
const $messageFormButton = $messageForm.querySelector("button");
const $sendLocationButton = document.getElementById("send-location");
const $messages = document.getElementById("messages");
const $sidebar = document.getElementById("sidebar");

// Templates
const messageTemplate = document.getElementById("message-template").innerHTML;
const locationMessageTemplate = document.getElementById(
    "location-message-template"
).innerHTML;
const sidebarTemplate = document.getElementById("sidebar-template").innerHTML;

// Options
const { username, room } = Qs.parse(location.search, {
    ignoreQueryPrefix: true,
});

// Utils
const formatDate = (timestamp) => moment(timestamp).format("h:mm a");
const autoScroll = () => {
    // New message element
    const $newMessage = $messages.lastElementChild;

    // Height of $newMessage
    const newMessageStyles = getComputedStyle($newMessage);
    const newMessageMargin =
        parseInt(newMessageStyles.marginBottom) +
        parseInt(newMessageStyles.marginTop);
    const newMessageHeight = $newMessage.offsetHeight + newMessageMargin;

    // VisibleHeight
    const visibleHeight = $messages.offsetHeight;

    // Height of messages container
    const containerHeight = $messages.scrollHeight;

    // How far have I scrolled?
    const scrollOffset = $messages.scrollTop + visibleHeight;

    if (containerHeight - newMessageHeight <= scrollOffset) {
        $messages.scrollTop = $messages.scrollHeight;
    }
};

socket.on("locationMessage", ({ createdAt, ...rest }) => {
    const html = Mustache.render(locationMessageTemplate, {
        createdAt: formatDate(createdAt),
        ...rest,
    });
    $messages.insertAdjacentHTML("beforeend", html);
    autoScroll();
});

socket.on("message", ({ createdAt, ...rest }) => {
    const html = Mustache.render(messageTemplate, {
        createdAt: formatDate(createdAt),
        ...rest,
    });
    $messages.insertAdjacentHTML("beforeend", html);
    autoScroll();
});

$messageForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const { value } = $messageFormInput;

    if (value === "") return;

    $messageFormButton.setAttribute("disabled", "disabled");

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

socket.on("roomData", ({ room, users }) => {
    const html = Mustache.render(sidebarTemplate, { room, users });

    $sidebar.innerHTML = html;
});
