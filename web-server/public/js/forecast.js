(function() {
    const form = document.getElementById("weather-form");
    const input = document.getElementById("weather-form-input");
    const textOne = document.getElementById("message-one");
    const textTwo = document.getElementById("message-two");

    form.addEventListener("submit", async event => {
        event.preventDefault();
        const address = input.value;

        textOne.textContent = "Loading...";

        try {
            const response = await fetch(
                `http://localhost:3000/weather?address=${address}`
            );
            const responseJSON = await response.json();

            if (responseJSON.error) {
                textOne.textContent = responseJSON.error;
            } else {
                const { address, forecastData } = responseJSON;

                textOne.textContent = address;
                textTwo.textContent = `The weather is ${forecastData.summary} with ${forecastData.temperature} degrees.`;
            }
        } catch (error) {
            console.log(error);
        }
    });
})();
