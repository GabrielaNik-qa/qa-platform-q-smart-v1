// Usage: node restore-seed.js
// Puts back EXACTLY the data stored in seed-data.json (the users, reviews, scorecards, coaching ... you have now).
// If a data.json already exists it is first saved as data.backup.json.
const fs = require('fs'), path = require('path');
const SEED = path.join(__dirname, 'seed-data.json'), F = path.join(__dirname, 'data.json');
if (!fs.existsSync(SEED)) { console.log('seed-data.json was not found'); process.exit(1); }
if (fs.existsSync(F)) fs.copyFileSync(F, path.join(__dirname, 'data.backup.json'));
fs.copyFileSync(SEED, F);
console.log('data.json restored from seed-data.json' + (fs.existsSync(path.join(__dirname, 'data.backup.json')) ? ' (the previous one is in data.backup.json)' : ''));
