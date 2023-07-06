// App File Logic
const express = require('express');
const app = express();

//Middleware area before passing to routes
//Let server accept JSON
app.use(express.json())

// Setup Routes
const urlRouter = require('./routes/urlshortener')

// Tell app to use urlRouter when querying /shorten_url
app.use('/shorten_url', urlRouter)

// Export the app instance to be used
module.exports = app;