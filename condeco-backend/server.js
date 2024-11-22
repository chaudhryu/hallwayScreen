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
    console.log('Authenticated with Condeco API');

    // Step 2: Fetch booking data
    let { startDateTime, endDateTime, roomId } = req.query;

    // Set default startDateTime to today at 5:00 AM if not provided
    if (!startDateTime) {
      const now = new Date();
      startDateTime = formatDateTime(now);
    }

    // Set default endDateTime to today at 10:00 PM if not provided
    if (!endDateTime) {
      const today = new Date();
      today.setHours(22, 0, 0, 0); // Set time to 10:00 PM
      endDateTime = formatDateTime(today);
    }

    // Provide a default roomId if not provided
    if (!roomId) {
      roomId = '139'; // Replace with your actual default room ID
    }

    const bookingsUrl = `${process.env.CONDECO_BOOKINGS_API}?startDateTime=${encodeURIComponent(
      startDateTime
    )}&endDateTime=${encodeURIComponent(endDateTime)}&roomId=${encodeURIComponent(roomId)}`;

    console.log('Bookings URL:', bookingsUrl);

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
    console.error(
      'Error fetching booking data:',
      error.response ? error.response.data : error.message
    );
    res.status(500).json({ error: 'Failed to fetch booking data' });
  }
});

// Function to format Date object into 'YYYY-MM-DD HH:MM:SS' format
function formatDateTime(date) {
  const year = date.getFullYear();
  const month = padZero(date.getMonth() + 1); // Months are zero-based
  const day = padZero(date.getDate());
  const hours = padZero(date.getHours());
  const minutes = padZero(date.getMinutes());
  const seconds = padZero(date.getSeconds());

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

// Helper function to pad single-digit numbers with leading zero
function padZero(num) {
  return num.toString().padStart(2, '0');
}

// Start the server
const PORT = process.env.PORT || 5000; // Default to port 5000 if not specified
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
