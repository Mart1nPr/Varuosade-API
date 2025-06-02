const express = require('express');
const Papa = require('papaparse');
const fs = require('fs');
const app = express();
const port = 3300;

let spareParts = [];

fs.readFile('LE.csv', 'utf8', (err, data) => {
  if (err) {
    console.error('Failed to read file:', err);
    return;
  }
  const parsed = Papa.parse(data, { header: true });
  spareParts = parsed.data;
  console.log('Spare parts loaded into memory');
});

app.get('/spare-parts', (req, res) => {
  let result = [...spareParts];

  const { name, sn, page = 1 } = req.query;

  if (name) {
    result = result.filter(item => item.name?.toLowerCase().includes(name.toLowerCase()));
  }

  if (sn) {
    result = result.filter(item => item.serial_number?.includes(sn));
  }

  const limit = 30;
  const start = (page - 1) * limit;
  const paginated = result.slice(start, start + limit);

  res.json({
    page: parseInt(page),
    total: result.length,
    results: paginated
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/spare-parts`);
});