const express = require('express');
const app = express();

app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*'); // Allow all domains
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

app.get('/goodbeing.net/counter', (req, res) => {
    res.send('123'); // Example counter value
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
});
