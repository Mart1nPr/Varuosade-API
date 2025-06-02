const express = require('express');
const Papa = require('papaparse');
const fs = require('fs');
const app = express();
const port = 3300;

const columnNames = [
  "Part Number", "Part Name", "Quantity", "Price", "Discount", 
  "Tax", "Additional Info", "Part Category", "Price (Local Currency)", 
  "Brand", "Weight"
];

let spareParts = [];

fs.readFile('LE.csv', 'utf8', (err, data) => {
  if (err) {
    console.error('Failed to read file:', err);
    return;
  }

  const parsed = Papa.parse(data, {
    header: false,
    skipEmptyLines: true
  });

  spareParts = parsed.data.map(row => {
    const item = {};
    columnNames.forEach((col, i) => {
      item[col] = row[i] ?? null;
    });
    return item;
  });

  console.log('Spare parts loaded into memory');
});

app.get('/spare-parts', (req, res) => {
  let result = [...spareParts];

  const { name, sn, page = 1 } = req.query;

  if (name) {
    result = result.filter(item =>
      item["Part Name"]?.toLowerCase().includes(name.toLowerCase())
    );
  }

  if (sn) {
    result = result.filter(item =>
      item["Part Number"]?.includes(sn)
    );
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