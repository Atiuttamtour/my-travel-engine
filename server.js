require('dotenv').config();
const express = require('express');
const { Duffel } = require('@duffel/api');
const path = require('path'); // <--- NEW LINE 1

const app = express();
const port = 3000;

// Tell the server to share files from the "public" folder
app.use(express.static('public')); // <--- NEW LINE 2

// ... (rest of the code stays the same) ...

// 1. Connect to Duffel
const duffel = new Duffel({
  token: process.env.DUFFEL_TOKEN
});

// 2. Simple Home Page Check
app.get('/', (req, res) => {
  res.send('<h1>Travel Engine is Online! ✈️</h1>');
});

// 3. The Flight Search Feature
app.get('/search-flight', async (req, res) => {
  try {
    console.log("Searching for flights...");
    
    // This asks Duffel to find flights from London (LHR) to New York (JFK)
   const offerRequest = await duffel.offerRequests.create({
      slices: [
        {
          origin: 'LHR', 
          destination: 'JFK', 
          departure_date: '2026-06-20', // <--- CHANGED to June 20, 2026
        },
      ],
      passengers: [{ type: 'adult' }],
      cabin_class: 'economy',
    });
    // Send the results to the browser
    res.json(offerRequest.data.offers);
    
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send('Error finding flights: ' + error.message);
  }
});

// 4. Start the Server
app.listen(port, () => {
  console.log(`Success! Server running at http://localhost:${port}`);
});