/* Global Variables */

// OpenWeatherMap API URL components
let baseURL = 'https://api.openweathermap.org/data/2.5/weather?zip=';
let key = '6cae80f7255f8ec471390feb8f002adf&units=metric'; // Update units to metric for Celsius

// Create a new date instance dynamically with JS
let d = new Date();
let newDate = d.toLocaleString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

// Event listener for the button click
document.getElementById('generate').addEventListener('click', performAction);

/**
 * Function to handle button click
 * @param {Event} e - The click event.
 */
function performAction(e) {
    // Get user input values
    const postCode = document.getElementById('zip').value;
    const feelings = document.getElementById('feelings').value;

    // Validate ZIP code (assuming a simple example for ZIP code length)
    if (postCode.length !== 5) {
        alert('Invalid ZIP code');
        return;
    }

    // Log the current date
    console.log(newDate);

    // Call the getTemperature function and handle the returned data
    getTemperature(baseURL, postCode, key)
        .then(function (data) {
            // Add data to POST request
            postData('http://localhost:8080/addWeatherData', {
                temperatureCelsius: data.main.temp, // Temperature is already in Celsius
                date: newDate,
                user_response: feelings,
                city: data.name // Add city name to the postData payload
            })
                // Function which updates UI
                .then(function () {
                    updateUI();
                });
        });
}

/**
 * Async GET function to fetch temperature data
 * @param {string} baseURL - The base URL for the API.
 * @param {string} code - The ZIP code.
 * @param {string} key - The API key.
 * @returns {Promise<object>} - The data received from the API.
 */
const getTemperature = async (baseURL, code, key) => {
    try {
        const response = await fetch(`${baseURL}${code}&APPID=${key}`);

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const data = await response.json();
        console.log(data);

        // Extract temperature from the API response (assuming it's in Celsius directly)
        const temperatureInCelsius = data.main.temp;

        // Log the temperature in Celsius
        console.log('Temperature in Celsius:', temperatureInCelsius);

        return data;
    } catch (error) {
        console.error('Error fetching temperature:', error);
    }
};

/**
 * Async POST function to send data to the server
 * @param {string} url - The URL for the POST request.
 * @param {object} data - The data to be sent in the request body.
 * @returns {Promise<object>} - The data received from the server.
 */
const postData = async (url = '', data = {}) => {
    const postRequest = await fetch(url, {
        method: 'POST',
        credentials: 'same-origin',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });

    try {
        const newData = await postRequest.json();
        console.log(newData, 'works!');
        return newData;
    } catch (error) {
        console.log('Error', error);
    }
};

/**
 * Update user interface function
 * @returns {Promise<void>}
 */
const updateUI = async () => {
    const request = await fetch('http://localhost:8080/all');
    try {
        const allData = await request.json();

        // Update UI elements with fetched data
        document.getElementById('date').innerHTML = 'Date: ' + allData.date;
        document.getElementById('temp').innerHTML = 'Current Temperature: ' + Math.round(allData.temperatureCelsius) + '°C';
        document.getElementById('city').innerHTML = 'City: ' + allData.city;
        document.getElementById('content').innerHTML = 'Your Current: ' + allData.user_response;
    } catch (error) {
        console.log('error', error);
    }
};

// Additional event listener to prevent default form submission behavior
document.getElementById('generate').addEventListener('click', function (e) {
    e.preventDefault(); // Prevent the default form submission behavior
    performAction();
});
