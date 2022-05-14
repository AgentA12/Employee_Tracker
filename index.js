const inquirer = require("inquirer");
const ctable = require("console.table");
const mysql = require("mysql2");
const { prompts } = require("inquirer");
const db = require("./libs/connection");
const Query = require("./libs/query-functions");
const {
  viewDepartments,
  viewEmployees,
  viewRoles,
  department,
} = require("./libs/queryStatements");

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
      if (answer.Choice === "EXIT") {
        console.log("Bye!");
        process.exit();
      }
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
    let query = { sql: viewDepartments };
    Query(query).then(promptUser);
  } else if (params === "View all employees") {
    let query = { sql: viewEmployees };
    Query(query).then(promptUser);
  } else if (params === "View all roles") {
    let query = { sql: viewRoles };
    Query(query).then(promptUser);
  }
}

function AddData(params) {
  if (params === "Add a department") {
    addDepartment().then((res) => {
      let query = {
        sql: department,
        params: res.Department,
      };
      Query(query).then(promptUser);
    });
  } else if (params === "Add a role") {
    addRole();
  } else addEmployee();
}

function addDepartment() {
  return inquirer.prompt([
    {
      type: "input",
      name: "Department",
      message: "Enter the name of the department:",
    },
  ]);
}

function addRole() {
  getDepartmentNames.then((departmentNames) => {
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
          choices: departmentNames,
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
        getManagerId(res);
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

let getDepartmentNames = new Promise((resolve, reject) => {
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
        promptUser();
      });
    });
  });
}

function getManagerId(input) {
  let sql = `select
  id
from
   employee
where
   CONCAT(first_name, " ", last_name) = ?;`;
  let params = input.employeeManager;

  db.query(sql, params, (err, results) => {
    console.log(results[0].id);
    let manager_id = results[0].id;

    sql = `select
    id
 from
    role
 where
    role.title = ?;`;
    params = input.employeeRole;
    db.query(sql, params, (err, results) => {
      console.log(results);
      let role_id = results[0].id;
      sql = `INSERT INTO employee (first_name, last_name, role_id, manager_id)
      VALUES (?,?,?,?)
            `;
      params = [
        input.employeeFirstName,
        input.employeeLastName,
        role_id,
        manager_id,
      ];
      db.query(sql, params, (err, results) => {
        if (err) {
          console.log(err);
        }
        console.table(results);
        promptUser();
      });
    });
  });
}

promptUser();
