const fs = require("fs");

const data = fs.readFileSync("./1-json.json");
const dataString = data.toString();
const dataParsed = JSON.parse(dataString);

console.log(dataParsed);

const updatedData = {
    ...dataParsed,
    name: "Alex",
    age: 29
};

const stringifiedNewData = JSON.stringify(updatedData);

fs.writeFileSync("./1-json.json", stringifiedNewData);
