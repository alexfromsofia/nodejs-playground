const request = require("request-promise");

const weatherAPIKey = "a7fee2b8daf33e300a12b197b9c11993";

const forecast = async ({ locationName, latitude, longitude }) => {
    const url = `https://api.darksky.net/forecast/${weatherAPIKey}/${latitude},${longitude}?units=si`;

    try {
        const response = await request({ url, json: true, units: "si" });
        const { precipProbability, temperature } = response.currently;

        console.log(
            `It is currently ${temperature} degrees out in ${locationName}. There is a ${precipProbability} % chance of rain.`
        );
    } catch (error) {
        console.log(error.message);
    }
};

module.exports = forecast;
