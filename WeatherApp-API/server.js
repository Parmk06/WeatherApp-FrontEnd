// Setup empty JS object to act as endpoint for all routes
const projectData = {};

// Require Express to run server and routes
const express = require('express');

// Start up an instance of app
const app = express();

/* Dependencies */
const bodyParser = require('body-parser');

/* Middleware */
// Configure express to use body-parser as middleware
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Cors for cross-origin allowance
const cors = require('cors');
app.use(cors());

// Initialize the main project folder
app.use(express.static('website'));
const port = 8080;

// Spin up the server
const server = app.listen(port, listening);

// Callback to debug
function listening() {
    console.log('Server is running');
    console.log(`Running on localhost: ${port}`);
}

// GET route that returns the projectData object
app.get('/all', sendData);

// Callback function to send projectData as response
function sendData(request, response) {
    response.send(projectData);
}

// POST route
app.post('/addWeatherData', addData);

// Callback function to add weather data to projectData
function addData(request, response) {
    projectData.temperatureCelsius = request.body.temperatureCelsius;
    projectData.date = request.body.date;
    projectData.user_response = request.body.user_response;
    projectData.city = request.body.city;
    response.end();
    console.log(projectData);
}
