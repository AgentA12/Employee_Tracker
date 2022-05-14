const mysql = require("mysql2");
require("dotenv").config();

const db = mysql.createConnection(
  {
    user: process.env.USER,
    password: process.env.PASSWORD,
    database: process.env.DATABASE,
  },
  console.log("jacked in")
);

module.exports = db;
