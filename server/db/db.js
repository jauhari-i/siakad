const express = require("express");
const mysql = require("mysql");
const myconnection = require("express-myconnection");

const app = express();

app.use(
  myconnection(
    mysql,
    {
      host: "localhost",
      user: "root",
      password: "",
      port: 3306,
      database: "db_siakad",
    },
    "pool"
  )
);

module.exports = app;
