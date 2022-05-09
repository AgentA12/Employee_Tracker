const inquirer = require("inquirer");
const ctable = require("console.table");
// const Connection = require("mysql2/typings/mysql/lib/Connection");
const mysql = require("mysql2");
// const db = require("/lib/connection.js");
// console.table([
//   {
//     name: "foo",
//     age: 10,
//   },
//   {
//     name: "bar",
//     age: 20,
//   },
// ]);

const db = mysql.createConnection(
  {
    user: "root",
    password: "andrew",
    database: "employee_tracker",
  },
  console.log("jacked in!")
);

//view all tables-----
db.query(`SELECT * FROM departments`, (err, results) => {
  if (err) console.log(err);
  console.log("Departments:", results);
});

db.query(`SELECT * FROM role`, (err, results) => {
  if (err) console.log(err);
  console.log("Roles:", results);
});

db.query(`SELECT * FROM employee`, (err, results) => {
  if (err) console.log(err);
  console.log("Employees:", results);
});

//add role
db.query(
  `INSERT INTO role (title, salary, department_id)
VALUES (?,?,?)`,
  (err, results) => {
    if (err) console.log(err);
    console.log(results);
  }
);

// inquirer
//   .prompt([
//     {
//       type: "list",
//       name: "Choice",
//       message: "What would you like to do?",
//       choices: [
//         "View all departments",
//         "View all employees",
//         "View all roles",
//         "Add a department",
//         "Add a role",
//         "Add an employee",
//         "Update an employee role",
//       ],
//     },
//   ])
//   .then((answer) => {
//     getAction(answer.Choice);
//   });

// function getAction(action) {
//   if (action.includes("View")) {
//     ViewData(action);
//   } else if (action.includes("Add")) {
//     AddData(action);
//   } else UpdateEmpoyee(action);
// }

// function ViewData(params) {
//   console.log(params, "view data");
// }

// function AddData(params) {
//   console.log(params, "add data");
// }

// function UpdateEmpoyee(params) {
//   console.log(params, " update data");
// }
