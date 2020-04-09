const jwt = require("jsonwebtoken");

const myFn = async () => {
    const secret = "thisismysecret";
    const token = jwt.sign({ _id: "abc123" }, secret, {
        expiresIn: "2220 seconds"
    });

    console.log(token);

    const data = jwt.verify(token, secret);
    console.log(data);
};

myFn();
