const express = require('express');
const Papa = require('papaparse');
const fs = require('fs');
const app = express();
const port = 3000;

app.get('/spare-parts', (req, res) => {
  fs.readFile('LE.txt', 'utf8', (err, data) => {
    if (err) {
      return res.status(500).json({ error: 'Error reading the LE.txt file' });
    }

    const jsonData = Papa.parse(data, {
      header: true,
    });

    res.json(jsonData.data);
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/spare-parts`);
});