const mongoose = require("mongoose");

const connectionURL = process.env.MONGODB_URL;
const databaseName = process.env.MONGODB_NAME;

mongoose.connect(`${connectionURL}/${databaseName}`, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
});
