const inquirer = require("inquirer");
const ctable = require("console.table");
const mysql = require("mysql2");
const { prompts } = require("inquirer");
const db = require("./libs/connection");
const { Query, QueryReturnResults } = require("./libs/query-functions");
const {
  viewDepartments,
  viewEmployees,
  viewRoles,
  department,
  departmentId,
  insertNewRole,
  roleTitles,
  employeeFullName,
  selectEmployeeFullName,
  selectRoleId,
  insertNewEmployee,
  employeeNames,
  departmentNamesSQL,
  updatedEmployeeRoles,
} = require("./libs/queryStatements");
const { query } = require("./libs/connection");

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
  } else {
    getRoleTitles.then((roles) => {
      getEmployeeNames.then((employees) => {
        let employeesNames = filterResults(employees);
        promptUpdateEmployee(roles, employeesNames).then((updatedEmployee) => {
          getEmployeeID(updatedEmployee).then((employeeId) => {
            getRoleId(updatedEmployee).then((roleId) =>
              updatedEmployeeRole(roleId, employeeId)
            );
          });
        });
      });
    });
  }
  //UpdateEmployee(action);
}

function updatedEmployeeRole(roleId, employeeId) {
  let query = {
    sql: updatedEmployeeRoles,
    params: [roleId, employeeId],
  };

  Query(query).then((results) => {
    console.table(results);
    promptUser();
  });
}

function getEmployeeID(input) {
  return new Promise((resolve, reject) => {
    let query = {
      sql: selectEmployeeFullName,
      params: Object.values(input),
    };
    QueryReturnResults(query).then((results) => {
      resolve(results[0].id);
    });
  });
}

function promptUpdateEmployee(roles, employees) {
  return inquirer.prompt([
    {
      type: "list",
      name: "chooseEmployee",
      message: "Which employee would you like to update?",
      choices: employees,
    },
    {
      type: "list",
      name: "employeeRole",
      message: "choose the new role",
      choices: roles,
    },
  ]);
}

function ViewData(params) {
  if (params === "View all departments") {
    let queryObj = { sql: viewDepartments };
    Query(queryObj).then(promptUser);
  } else if (params === "View all employees") {
    let queryObj = { sql: viewEmployees };
    Query(queryObj).then(promptUser);
  } else if (params === "View all roles") {
    let queryObj = { sql: viewRoles };
    Query(queryObj).then(promptUser);
  }
}

function AddData(params) {
  if (params === "Add a department") {
    getNewDepartmentName().then((res) => {
      let queryObj = {
        sql: department,
        params: res.Department,
      };
      Query(queryObj).then(promptUser);
    });
  } else if (params === "Add a role") {
    getDepartmentNames.then((departmentNames) => {
      promptNewRole(departmentNames).then((newRole) => {
        addRole(newRole);
      });
    });
  } else {
    //else "Add an employee"
    getManagerNames.then((managerNames) => {
      getRoleTitles.then((roles) => {
        promptNewEmployee(roles, managerNames).then((newEmployee) => {
          getManagerId(newEmployee).then((managerId) => {
            getRoleId(newEmployee).then((roleId) => {
              addNewEmployee(newEmployee, roleId, managerId);
            });
          });
        });
      });
    });
  }
}

let getRoleTitles = new Promise((resolve, reject) => {
  let query = { sql: roleTitles };
  QueryReturnResults(query).then((results) => {
    let roles = filterResults(results);
    resolve(roles);
  });
});

function filterResults(results) {
  let data = [];
  results.forEach((element) => {
    for (key in element) {
      data.push(element[key]);
    }
  });
  return data;
}

let getEmployeeNames = new Promise((resolve, reject) => {
  let query = {
    sql: employeeNames,
  };
  QueryReturnResults(query).then((results) => {
    resolve(results);
  });
});

let getManagerNames = new Promise((resolve, reject) => {
  let query = { sql: employeeFullName };
  QueryReturnResults(query).then((results) => {
    let managers = filterResults(results);
    resolve(managers);
  });
});

function getNewDepartmentName() {
  return inquirer.prompt([
    {
      type: "input",
      name: "Department",
      message: "Enter the name of the department:",
    },
  ]);
}

function promptNewRole(departmentNames) {
  return inquirer.prompt([
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
  ]);
}

function addRole(newRole) {
  return new Promise((resolve, reject) => {
    let queryObj = {
      sql: departmentId,
      params: newRole.roleDepartment,
    };
    QueryReturnResults(queryObj).then((results) => {
      let params = Object.values(newRole);
      params.pop();
      params.push(results[0].id);
      let queryObj = { sql: insertNewRole, params };
      Query(queryObj).then(promptUser);
    });
  });
}

function promptNewEmployee(roles, managers) {
  return inquirer.prompt([
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
      choices: roles,
    },
    {
      type: "list",
      name: "employeeManager",
      message: "Enter the manager of the employee:",
      choices: managers,
    },
  ]);
}

let getDepartmentNames = new Promise((resolve, reject) => {
  let query = { sql: departmentNamesSQL };
  QueryReturnResults(query).then((results) => {
    let departmentNames = filterResults(results);
    resolve(results);
  });
});

function getManagerId(input) {
  return new Promise((resolve, reject) => {
    let query = {
      sql: selectEmployeeFullName,
      params: input.employeeManager,
    };
    QueryReturnResults(query).then((results) => {
      let manager_id = results[0].id;
      resolve(manager_id);
    });
  });
}

function getRoleId(input) {
  return new Promise((resolve, reject) => {
    let query = {
      sql: selectRoleId,
      params: input.employeeRole,
    };
    QueryReturnResults(query).then((results) => {
      let role_id = results[0].id;
      resolve(role_id);
    });
  });
}

function addNewEmployee(...args) {
  let query = {
    sql: insertNewEmployee,
    params: [
      args[0].employeeFirstName,
      args[0].employeeLastName,
      args[1],
      args[2],
    ],
  };

  Query(query).then((results) => {
    console.table(results);
    promptUser();
  });
}

promptUser();
