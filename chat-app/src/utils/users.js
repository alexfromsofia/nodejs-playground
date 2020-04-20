const users = [];

const removeUser = (id) => {
    const index = users.findIndex((user) => user.id === id);

    if (index === -1) {
        return {
            error: "No user with this id is found.",
        };
    }

    if (index !== -1) {
        return users.splice(index, 1)[0];
    }
};

const addUser = ({ id, username, room }) => {
    // Clean the data
    username = username.trim().toLowerCase();
    room = room.trim().toLowerCase();

    // Validate the data
    if (!username || !room) {
        return {
            error: "Username and room are required!",
        };
    }

    // Check for existing user
    const existingUser = users.find(
        (user) => user.username === username && user.room === room
    );

    if (existingUser) {
        return {
            error: "Username is in use!",
        };
    }

    // Store users
    const user = { id, username, room };
    users.push(user);

    return { user };
};

const getUser = (id) => users.find((user) => user.id === id);
const getUsersInRoom = (room) =>
    users.filter((user) => user.room === room.trim().toLowerCase());

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom,
};
