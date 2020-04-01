const request = require("request-promise");

const geocodingAPIKey =
    "pk.eyJ1IjoiZG9uc2FuZGluaSIsImEiOiJjazg5MDRyOGYwMW8yM29tcHpjM3FqczY0In0.FPe1HEQTE1renfYUPpuN8w";

const geocode = async address => {
    const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
        address
    )}.json?access_token=${geocodingAPIKey}`;

    try {
        const response = await request({ url, json: true });
        const { features } = response;

        if (!features.length) {
            return {
                error: "Unable to find location coordinates!"
            };
        }

        const { center } = features[0];

        return {
            longitude: center[0],
            latitude: center[1]
        };
    } catch (error) {
        console.log(error.message);
    }
};

module.exports = geocode;
