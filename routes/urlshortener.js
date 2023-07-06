// Router to handle API Endpoint Requests
const express = require('express')
const router = express.Router()
const { v4: uuidv4 } = require('uuid');
const validUrl = require('valid-url')

// In-memory storage urlMap to store UUID : URL mappings
// Alternatively we can use a model/schema structure with mongoose as DB
const urlMap = {};

// Test GET route to ensure service is running
router.get('/', (req, res) => {
    res.send("Shorten URL Service is running!")
})


// POST Request endpoint
// Uses validateURL middleware helper function to help validateURL provided
router.post('/', validateURL, async (req, res) => {

    try {
        // Store URL in request body as url
        const url = req.body.url

        // Check if UUID already exists for the URL provided
        for (const uuid in urlMap) {
            const storedUrl = urlMap[uuid];

            // If yes, just return the UUID matched with the URL provided
            if (url === storedUrl) {
                return res.status(200).json(uuid)
            }
        }

        // Generate a UUID, store as uuid
        const uuid = uuidv4();

        // Store UUID by mapping uuid:url as key:value pairs
        // using in-memory storage urlMap
        urlMap[uuid] = url;

        // Return uuid in response as 201 Created
        res.status(201).json(uuid)


    }
    // Some other error with our server
    catch (err) {
        res.status(500).json({ message: err.message })
    }
})


// GET One Request Endpoint
// Redirect user to correct URL based on key (UUID) provided
router.get('/:key', async (req, res) => {

    // Assign request key (UUID) as as variable
    const uuid = req.params.key;

    // Check if UUID is found in our In-memory storage urlMap
    // If yes, redirect user to the original URL, or provide response
    if (urlMap.hasOwnProperty(uuid)) {

        // Retrieve the url based on the stored UUID
        const url = urlMap[uuid]

        // Redirect user to the URL
        res.redirect(url);
        // res.status(200).json({ message: 'URL is ' + url })
    }

    // If no, return an error message
    else {
        res.status(404).json({ message: 'UUID not found' })
    }
})

// Middleware function to help validate URL if URL is valid and accessible
// Uses valid-url library to check if URL is valid format
// Uses fetch to check if URL is accessible
async function validateURL(req, res, next) {

    const url = req.body.url

    // Base Case: Return error response if invalid URL format
    if (!validUrl.isWebUri(url)) {
        return res.status(404).json({ message: "Invalid URL provided." })
    }

    // Here means URL is at least valid format
    // Edge Case not handled: if website is https://www.google.com.com
    // Use fetch to make HTTP request, if 200 means website is accessible
    fetch(url)
        .then(response => {

            // If response is 200 OK, move on to next middleware or requests
            if (response.ok) {
                next()

                // If here, means URL is not accessible
                // Return error 404 URL is not accessible
            } else {
                res.status(404).json({ message: "URL is not accessible" });
            }
        })

        // Some other error with our server
        .catch(error => {
            res.status(500).json({ message: error.message })
        });

}

module.exports = router