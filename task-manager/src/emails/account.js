const sgMail = require("@sendgrid/mail");
sgMail.setApiKey(
    "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"
);

const sendWelcomeEmail = (email, name) => {
    sgMail.send({
        to: email,
        from: "alexfromsofia.bg",
        subject: "Thanks for joining in!",
        text: `Welcome to the app, ${name}. Let me know how you get along with the app`,
    });
};

module.exports = {
    sendWelcomeEmail,
};
