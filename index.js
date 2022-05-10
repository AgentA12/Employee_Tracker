const inquirer = require("inquirer");
const ctable = require("console.table");
const mysql = require("mysql2");

const db = mysql.createConnection(
  {
    user: "root",
    password: "andrew",
    database: "employee_tracker",
  },
  console.log("jacked in!")
);

function promptUser() {
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
          "EXIT",
        ],
      },
    ])
    .then((answer) => {
      if (answer.Choice === "EXIT") console.log("Bye!");
      getAction(answer.Choice);
    });
}

function getAction(action) {
  if (action.includes("View")) {
    ViewData(action);
  } else if (action.includes("Add")) {
    AddData(action);
  } else UpdateEmpoyee(action);
}

function ViewData(params) {
  if (params === "View all departments") {
    db.query(`SELECT * FROM departments`, (err, results) => {
      console.table("Departments", results);
      promptUser();
    });
  } else if (params === "View all employees") {
    db.query(`SELECT * FROM employee`, (err, results) => {
      console.table("Employees", results);
      promptUser();
    });
  } else
    db.query(
      `SELECT
    role.id,
    role.title,
    role.salary,
    departments.name
FROM
    role
    LEFT JOIN departments ON role.department_id = departments.id;`,
      (err, results) => {
        console.table(`Roles`, results);
        promptUser();
      }
    );
}

function AddData(params) {
  if (params === "Add a department") {
    addDepartment();
  } else if (params === "Add a role") {
    addRole();
  } else addEmployee();
}

function addDepartment() {
  inquirer
    .prompt([
      {
        type: "input",
        name: "addDepartment",
        message: "Enter the name of the department:",
      },
    ])
    .then((res) => {
      console.log(res);
      promptUser();
    });
}

function addRole() {
  inquirer
    .prompt([
      {
        type: "input",
        name: "roleName",
        message: "Enter the name of the role:",
      },
      {
        type: "input",
        name: "roleSalary",
        message: "Enter the salary of the role:",
      },
      {
        type: "input",
        name: "roleDepartment",
        message: "Enter the department of the role:",
      },
    ])
    .then((res) => {
      console.log(res);
      promptUser();
    });
}

function addEmployee() {
  inquirer
    .prompt([
      {
        type: "input",
        name: "employeeFirstName",
        message: "Enter the first name of the employee:",
      },
      {
        type: "input",
        name: "employeeLastName",
        message: "Enter the last name of the employee:",
      },
      {
        type: "input",
        name: "employeeRole",
        message: "Enter the role of the employee:",
      },
      {
        type: "input",
        name: "employeeManager",
        message: "Enter the manager of the employee:",
      },
    ])
    .then((res) => {
      console.log(res);
      promptUser();
    });
}

function UpdateEmpoyee() {}

promptUser();
