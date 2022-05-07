const mysql = require("mysql2");

const db = mysql.createConnection({
  user: "root",
  password: "andrew",
  database: "employee_tracker",
});

module.exports = db;
