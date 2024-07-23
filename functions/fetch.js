const express = require('express');
const axios = require('axios');
const app = express();
const port = 3000;

// Enable CORS
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

app.get('/aggregate-counters', async (req, res) => {
  try {
    // Replace with actual URLs of the counters
    const urls = [
      'https://burgerslicy.com/count',
      'https://goodbeing.pages.dev/counter',
      'https://littleindianstar.com/counter'
    ];

    const requests = urls.map(url => axios.get(url));
    const responses = await Promise.all(requests);

    const total = responses.reduce((sum, response) => sum + parseInt(response.data, 10), 0);

    res.send(total.toString());
  } catch (error) {
    res.status(500).send('Error aggregating counters');
  }
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});