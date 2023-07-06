const request = require('supertest');
const app = require('../app');

// Testing variables, website name, UUID
const validWebsite = "https://www.google.com"
const invalidWebsite = "12313213213"
const inaccessibleWebsite = "https://www.google.com/123213"
let requestUUID = "";


// 3 Test Cases: 
// Case 1: POST returns a generated UUID when providing a valid URL
// Case 2: GET returns the original URL using the generated UUID
// Case 3: POST returns an error message when providing an invalid URL
describe('API Endpoint Tests', () => {

    test('POST valid URL to /shorten_url should return a UUID', async () => {

        const payload = { url: validWebsite };

        const response = await request(app)
            .post('/shorten_url')
            .send(payload);

        // Status Code 201 indicates resource created
        expect(response.status).toBe(201);

        // Regex pattern to match UUID
        expect(response.body).toMatch(/^[a-f\d]{8}-([a-f\d]{4}-){3}[a-f\d]{12}$/i);

        // Store the generated UUID returned
        requestUUID = response.body;
    });

    test('GET /shorten_url/:UUID should redirect to original URL of website', async () => {

        // Use the stored UUID in the GET request
        const response = await request(app)
            .get(`/shorten_url/${requestUUID}`);

        // Status Code 302 indicates redirect response
        expect(response.status).toBe(302);

        // expect the header.location to be the website we had initially
        expect(response.header.location).toBe(validWebsite)

    });

    test('POST invalid URL /shorten_url should return an error message: Invalid URL provided', async () => {

        const payload = { url: invalidWebsite };

        const response = await request(app)
            .post('/shorten_url')
            .send(payload);

        // Status Code 404 indicates not found, and message invalid URL provided
        expect(response.status).toBe(404);
        expect(response.body).toEqual({ message: "Invalid URL provided." });

    });

    test('POST inaccessible URL /shorten_url should return an error message: URL is not accessible', async () => {

        const payload = { url: inaccessibleWebsite };

        const response = await request(app)
            .post('/shorten_url')
            .send(payload);

        // Status Code 404 indicates not found, and message invalid URL provided
        expect(response.status).toBe(404);
        expect(response.body).toEqual({ message: "URL is not accessible" });

    });
});
