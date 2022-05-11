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
    db.query(
      `SELECT
    employee.id AS employeeID,
    employee.first_name,
    employee.last_name,
    role.title,
    role.salary,
    CONCAT(manager.first_name, ' ', manager.last_name) AS manager,
    departments.name AS department
FROM
    employee
    LEFT JOIN role ON employee.role_id = role.id
    LEFT JOIN departments ON departments.id = role.department_id
    LEFT JOIN employee AS manager ON employee.manager_id = manager.id;`,
      (err, results) => {
        console.table("Employees", results);
        promptUser();
      }
    );
  } else
    db.query(
      `SELECT
    role.id,
    role.title,
    role.salary,
    departments.name AS department
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
      let sql = `INSERT INTO departments (name) VALUES (?);`;
      let params = [res.addDepartment];
      db.query(sql, params, (err, results) => {
        if (err) {
          console.log(err);
          promptUser();
        }
        console.log(results);
      });
      promptUser();
    })
    .then((data) => {
      console.log();
    });
}

function addRole() {
  queryPromise.then((data) => {
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
          type: "list",
          name: "roleDepartment",
          message: "Enter the department of the role:",
          choices: data,
        },
      ])
      .then((res) => {
        let sql = `SELECT * FROM departments WHERE  departments.name = ?;`;
        let params = res.roleDepartment;
        db.query(sql, params, (err, results) => {
          if (err) {
            console.log(err);
            promptUser();
          }

          let sql = `INSERT INTO role (title, salary, department_id)
          VALUES (?,?,?);`;

          let params = Object.values(res);
          params.pop();
          params.push(results[0].id);

          db.query(sql, params, (err, results) => {
            if (err) {
              throw err;
              promptUser();
            }
          });
          promptUser();
        });
      });
  });
}

function addEmployee() {
  getRoleChoices.then((data) => {
    console.log(data.role);
    console.log(data.managers);
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
          type: "list",
          name: "employeeRole",
          message: "Enter the role of the employee:",
          choices: data.roles,
        },
        {
          type: "list",
          name: "employeeManager",
          message: "Enter the manager of the employee:",
          choices: data.managers,
        },
      ])
      .then((res) => {
        console.log(res);
        db.query(`INSERT INTO employee (first_name, last_name, role_id)`);
        promptUser();
      });
  });
}

function UpdateEmpoyee() {
  getRoleChoicesUpdate.then((data) => {
    inquirer
      .prompt([
        {
          type: "list",
          name: "chooseEmployee",
          message: "Which employee would you like to update?",
          choices: data.employees,
        },
        {
          type: "list",
          name: "updateRole",
          message: "choose you role",
          choices: data.roles,
        },
      ])
      .then((input) => {
        getIds(input);
      });
  });
}

let queryPromise = new Promise((resolve, reject) => {
  let sql = `SELECT name
  FROM
  departments;`;
  db.query(sql, (err, results) => {
    let data = [];
    results.forEach((element) => {
      for (key in element) {
        data.push(element[key]);
      }
    });
    resolve(data);
  });
});

let getRoleChoices = new Promise((resolve, reject) => {
  let data = {
    roles: [],
    managers: [],
  };
  let sql = `SELECT title from role`;
  db.query(sql, (err, results) => {
    results.forEach((element) => {
      for (key in element) {
        data.roles.push(element[key]);
      }
    });
  });
  sql = `SELECT
        CONCAT(employee.first_name, ' ', employee.last_name) fullname
        FROM
        employee
        where
        manager_id is null;`;
  db.query(sql, (err, results) => {
    results.forEach((element) => {
      for (key in element) {
        data.managers.push(element[key]);
      }
    });
    resolve(data);
  });
});

promptUser();

let getRoleChoicesUpdate = new Promise((resolve, reject) => {
  let data = {
    roles: [],
    employees: [],
  };
  let sql = `SELECT title from role`;
  db.query(sql, (err, results) => {
    results.forEach((element) => {
      for (key in element) {
        data.roles.push(element[key]);
      }
    });
  });
  sql = `SELECT
        CONCAT(employee.first_name, ' ', employee.last_name) fullname
        FROM
        employee;`;
  db.query(sql, (err, results) => {
    results.forEach((element) => {
      for (key in element) {
        data.employees.push(element[key]);
      }
    });
    resolve(data);
  });
});

function getIds(input) {
  let sql = `select
  id
from
  employee
where
  CONCAT(first_name, " ", last_name) = ?;`;
  let params = Object.values(input);
  db.query(sql, params[0], (err, results) => {
    console.log(results[0].id);
    let ids = [];
    ids.push(results[0].id);
    let sql = `select
   id
from
   role
where
   role.title = ?;`;
    let params = Object.values(input);
    console.log(params[1]);
    db.query(sql, params[1], (err, results) => {
      console.log(results.id);
      ids.push(results[0].id);
      console.log(ids);

      let sql = `update employee
      set role_id = ? 
      where employee.id = ?`;
      params = ids.reverse();
      console.log(params);
      db.query(sql, params, (err, results) => {
        console.table(results);
      });
    });
  });
}

// let sql = `SELECT
//       CONCAT(employee.first_name, ' ', employee.last_name) fullname
//   FROM
//       employee
//   where
//       where employee.fullname = ?;`;
// let params = [input.chooseEmployee, results.id];

// db.query(sql, params, (err, results) => {
//   console.table(results);
// });
