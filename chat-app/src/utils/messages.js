const generateMessage = (message, user) => ({
    text: message,
    createdAt: +new Date(),
    ...user,
});

module.exports = {
    generateMessage,
};
