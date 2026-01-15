const express = require('express');
const cors = require('cors');
const { Duffel } = require('@duffel/api');

const app = express();
app.use(cors());

// 🟢 1. Setup the Duffel Connection
// This uses the password you saved in Render
const duffel = new Duffel({
  token: process.env.DUFFEL_TOKEN
});

// 🟢 2. The "Home Page" (Fixes the White Screen Error)
app.get('/', (req, res) => {
  res.send(`
    <div style="font-family: sans-serif; text-align: center; padding-top: 50px;">
      <h1 style="color: green;">✅ SERVER IS ONLINE</h1>
      <p>The Skyluxe Travel Engine is running correctly.</p>
      <p>You can now use your mobile app.</p>
    </div>
  `);
});

// 🟢 3. The Search Engine
app.get('/search-flight', async (req, res) => {
  try {
    const { origin, destination, date } = req.query;
    console.log(`🔎 SEARCH REQUEST: ${origin} to ${destination} on ${date}`);

    // Check if password is missing
    if (!process.env.DUFFEL_TOKEN) {
      throw new Error("MISSING PASSWORD: The DUFFEL_TOKEN is not set in Render.");
    }

    const offerRequest = await duffel.offerRequests.create({
      slices: [{
        origin: origin,
        destination: destination,
        departure_date: date,
      }],
      passengers: [{ type: "adult" }],
      cabin_class: "economy",
    });

    const offers = await duffel.offers.list({
      offer_request_id: offerRequest.data.id, 
      limit: 10
    });

    console.log(`✅ FOUND: ${offers.data.length} flights`);
    res.json(offers.data);

  } catch (error) {
    console.error("❌ ERROR:", error.message);
    res.status(500).json({ error: error.message });
  }
});

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`🚀 Engine is running on port ${PORT}`);
});