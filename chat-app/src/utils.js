const generateMessage = (message) => ({
    text: message,
    createdAt: +new Date(),
});

module.exports = {
    generateMessage,
};
