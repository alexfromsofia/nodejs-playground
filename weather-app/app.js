const request = require("request");

const city = "Sofia";

// Weather API Key
const weatherAPIKey = "a7fee2b8daf33e300a12b197b9c11993";
// Geocoding API Key
const geocodingAPIKey =
    "pk.eyJ1IjoiZG9uc2FuZGluaSIsImEiOiJjazg5MDRyOGYwMW8yM29tcHpjM3FqczY0In0.FPe1HEQTE1renfYUPpuN8w";

// Geocoding API URL
const geocodingUrl = `https://api.mapbox.com/geocoding/v5/mapbox.places/${city}.json?access_token=${geocodingAPIKey}`;

request({ url: geocodingUrl, json: true }, (error, response) => {
    const [longitude, latitude] = response.body.features[0].center;

    // Weather API URL
    const weatherUrl = `https://api.darksky.net/forecast/${weatherAPIKey}/${latitude},${longitude}?units=si`;

    request({ url: weatherUrl, json: true, units: "si" }, (error, response) => {
        const { currently } = response.body;

        console.log(`It is currently ${currently.temperature} degrees out in ${city}. There is a ${currently.precipProbability} % chance of rain.
        `);
    });
});
