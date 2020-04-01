const geocode = require("./utils/geocode");
const forecast = require("./utils/forecast");

const getForecast = async () => {
    const geoCode = await geocode("Sofia");

    if (geoCode) {
        forecast(geoCode);
    }
};

getForecast();
