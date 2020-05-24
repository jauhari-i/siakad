const express = require('express');
const log = require('morgan');
const body_parser = require('body-parser');
const cors = require('cors');
const app = express();
const port = 8080;

app.use(cors());

// use database
let db = require('./db/db');

if (db) {
  app.use(db);
} else {
  console.log('No database connection');
}

app.use(log('dev'));

app.use(body_parser.json());
app.use(body_parser.urlencoded({ extended: false }));

app.get('/', (req, res) => {
  res.redirect('/api');
});

app.use('/api', require('./routes/api/api'));

app.listen(port, () => console.log(`Siakad api port: ${port}!`));
