const request = require("request-promise");
const queryString = require("query-string");

const weatherAPIKey = "a7fee2b8daf33e300a12b197b9c11993";

const forecast = async ({ latitude, longitude }, params = {}) => {
    const queryParamsStringified = queryString.stringify(params);
    const url = `https://api.darksky.net/forecast/${weatherAPIKey}/${latitude},${longitude}?${queryParamsStringified}`;

    try {
        const response = await request({ url, json: true });

        return response.currently;
    } catch (error) {
        return {
            error: "Unable to find weather information!"
        };
    }
};

module.exports = forecast;
