// server.js

const express = require('express');
const axios = require('axios');
const cors = require('cors');
const app = express();

// Enable CORS
app.use(cors());

// Load environment variables
require('dotenv').config();

// Endpoint to fetch bookings
app.get('/api/bookings', async (req, res) => {
  try {
    // Step 1: Authenticate with Condeco API
    const authResponse = await axios.post(
      process.env.CONDECO_AUTH_API,
      new URLSearchParams({
        password: process.env.CONDECO_PASSWORD,
        client_id: process.env.CONDECO_CLIENT_ID,
        grant_type: 'password',
      }),
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      }
    );

    const accessToken = authResponse.data.access_token;
    console.log('Good Job')

    // Step 2: Fetch booking data
    const { startDateTime, endDateTime, roomId } = req.query;
    const bookingsUrl = `${process.env.CONDECO_BOOKINGS_API}?startDateTime=${startDateTime}&endDateTime=${endDateTime}&roomId=${roomId}`;

    const bookingsResponse = await axios.get(bookingsUrl, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        'Ocp-Apim-Subscription-Key': process.env.CONDECO_SUBSCRIPTION_KEY,
      },
    });

    // Log the fetched data
    console.log('Bookings fetched from Condeco API:', bookingsResponse.data);

    // Step 3: Send data to the frontend
    res.json(bookingsResponse.data);
  } catch (error) {
    console.error('Error fetching booking data:', error.message);
    res.status(500).json({ error: 'Failed to fetch booking data' });
  }
});

// Start the server
const PORT = process.env.PORT;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(process.env.CONDECO_PASSWORD)
});
