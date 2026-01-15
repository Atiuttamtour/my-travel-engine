const express = require('express');
const cors = require('cors');
const { Duffel } = require('@duffel/api');
require('dotenv').config();

const app = express();
app.use(cors());

// Connect to Duffel
const duffel = new Duffel({
  token: process.env.DUFFEL_TOKEN,
});

app.get('/search-flight', async (req, res) => {
  try {
    // 🟢 DYNAMIC: Read what the user typed from the URL (e.g. ?origin=DEL&destination=BOM)
    const { origin, destination, date } = req.query;

    console.log(`Searching for: ${origin} -> ${destination} on ${date}`);

    const offerRequest = await duffel.offerRequests.create({
      slices: [
        {
          origin: origin,           // e.g., 'DEL'
          destination: destination, // e.g., 'BOM'
          departure_date: date,     // e.g., '2026-06-20'
        },
      ],
      passengers: [{ type: 'adult' }],
      cabin_class: 'economy',
    });

    const offers = await duffel.offers.list({
      offer_request_id: offerRequest.data.id,
      limit: 10, // Get top 10 results
    });

    res.json(offers.data);

  } catch (error) {
    console.error('Error fetching flights:', error);
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Engine is running on port ${PORT}`));