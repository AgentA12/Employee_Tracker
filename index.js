const inquirer = require("inquirer");
const mysql = require("mysql2");
const ctable = require("console.table");

inquirer
  .prompt([
    {
      type: "list",
      name: "Choice",
      message: "What would you like to do?",
      choices: [
        "View all departments",
        "View all employees",
        "View all roles",
        "Add a department",
        "Add a role",
        "Add an employee",
        "Update an employee role",
      ],
    },
  ])
  .then((answer) => {
    getAction(answer.Choice);
  });

function getAction(action) {
  if (action.includes("View")) {
    ViewData(action);
  } else if (action.includes("Add")) {
    AddData(action);
  } else UpdateEmpoyee(action);
}

function ViewData(params) {}

function AddData(params) {}

function UpdateEmpoyee(params) {}
