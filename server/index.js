const express = require("express");
const log = require("morgan");
const bodyParser = require("body-parser");
const cors = require("cors");
const app = express();
const port = 8080;

app.use(cors());

// use database
let db = require("./db/db");

if (db) {
  app.use(db);
} else {
  console.log("No database connection");
}

app.use(log("combined"));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use("/api", require("./routes/api/api"));

app.listen(port, () => console.log(`Siakad api port: ${port}!`));
