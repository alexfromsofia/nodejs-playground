const path = require("path");
const express = require("express");
const hbs = require("hbs");

const app = express();

// Define paths for Express config
const publcPath = path.join(__dirname, "../public");
const viewsPath = path.join(__dirname, "../templates/views");
const partialsPath = path.join(__dirname, "../templates/partials");

// Setup handlebars engine and views location
app.set("view engine", "hbs");
app.set("views", viewsPath);
hbs.registerPartials(partialsPath);

app.use(express.static(publcPath));

app.get("", (req, res) => {
    res.render("index", {
        title: "Home page",
        name: "Alexander Georgiev"
    });
});

app.get("/about", (req, res) => {
    res.render("about", {
        title: "About page",
        name: "Alexander Georgiev"
    });
});

app.get("/help", (req, res) => {
    res.render("help", {
        title: "Help page",
        name: "Alexander Georgiev"
    });
});

app.get("/help/*", (req, res) => {
    res.render("404", {
        title: "Page not found",
        errorMessage: "Help article not found!",
        name: "Alexander Georgiev"
    });
});

app.get("/weather", (req, res) => {
    res.send({
        forecast: "It is snowing!",
        location: "Sofia"
    });
});

// All other pages (404)
app.get("*", (req, res) => {
    res.render("404", {
        title: "Page not found",
        errorMessage: "Oops, something went wrong!",
        name: "Alexander Georgiev"
    });
});

app.listen(3000, () => {
    console.log("Server is up on port 3000.");
});
