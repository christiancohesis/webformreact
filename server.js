const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
const port = 5000; // Choose a suitable port number


app.use(express.json()); 
app.use(cors()); // Enable CORS for all routes

// Define your route to fetch service areas
app.get('/getServiceArea', async (req, res) => {
  try {
    // Fetch service areas from your API
    const response = await axios.get('https://61a0-117-235-27-250.ngrok-free.app/getServiceArea');
    const data = response.data;
    res.json(data);
  } catch (error) {
    console.log('Error fetching service areas:', error);
    res.status(500).json({ error: 'Failed to fetch service areas' });
  }
});


app.get('/getRequestType', async (req, res) => {
  try {
    // Fetch service areas from your API
    const response = await axios.get('https://61a0-117-235-27-250.ngrok-free.app/getRequestType');
    const data = response.data;
    res.json(data);
  } catch (error) {
    console.log('Error fetching service areas:', error);
    res.status(500).json({ error: 'Failed to fetch service areas' });
  }
});

app.post('/createRequest', async (req, res) => {
  try {
    // Fetch service areas from your API
    console.log(req.body)
    const response = await axios.post('https://61a0-117-235-27-250.ngrok-free.app/createRequest',req.body);
    const data = response.data;
    res.json(data);
  } catch (error) {
    console.log('Error fetching service areas:', error);
    res.status(500).json({ error: 'Failed to fetch service areas' });
  }
});
// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
