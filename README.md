# nodejs-playground

# This repo holds a several projects:

```javascript
const commonTechnologies = [
    "Node.js",
    "NPM",
    "ES6/ES7",
    "Asynchronous programming",
    "Express",
    "GIT",
];
```

## Notes app

### Simple app for writing notes to a file using File System, Chalk(For prettier console.logging), yargs (for running node scripts with arguments and consuming them).

#### Technologies used:

```javascript
const technologies = commonTechnologies;
```

## Task manager

### An app which encapsulates good practices for writing a REST API, with authorization. It exposes a couple of endpoints for CRUD operations on tasks and users.

#### Technologies used:

```javascript
const technologies = [
    ...commonTechnologies,
    "MongoDB",
    "Mongoose",
    "JWT Authentication",
    "REST API Design",
    "Email sending",
    "File and image uploads",
    "Code testing with JEST",
];
```

## Weather App

### An app for viewing the forecast for a given location.

#### It uses the https://api.mapbox.com API for geocoding and then passes the latitude and longitude to the https://api.darksky.net API, which passes those coordinates to generate a forecast and send it back to the browser. It is deployed on Heroku with the following URL: https://alexfromsofia-weather-app.herokuapp.com.

#### Technologies used:

```javascript
const technologies = [
    ...commonTechnologies,
    "Handlebars with templates and partials",
];
```

## Chat App

```javascript
const technologies = [...commonTechnologies, "Socket.IO"];
```
