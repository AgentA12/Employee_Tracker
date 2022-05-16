const viewDepartments = `SELECT * FROM departments`;

const viewEmployees = `SELECT
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
LEFT JOIN employee AS manager ON employee.manager_id = manager.id;`;

const viewRoles = `SELECT
role.id,
role.title,
role.salary,
departments.name AS department
FROM
role
LEFT JOIN departments ON role.department_id = departments.id;`;

const department = `INSERT INTO departments (name) VALUES (?);`;

const departmentId = `SELECT * FROM departments WHERE  departments.name = ?;`;

const insertNewRole = `INSERT INTO role (title, salary, department_id)
VALUES (?,?,?);`;

const departmentNamesSQL = `SELECT name FROM departments;`;

const roleTitles = `SELECT title from role`;
const employeeFullName = `SELECT
CONCAT(employee.first_name, ' ', employee.last_name) fullname
FROM
employee
where
manager_id is null;`;

const selectEmployeeFullName = `select
id
from
 employee
where
 CONCAT(first_name, " ", last_name) = ?;`;

const selectRoleId = `select
id
from
role
where
role.title = ?;`;

const insertNewEmployee = `INSERT INTO employee (first_name, last_name, role_id, manager_id)
         VALUES (?,?,?,?);`;

const employeeNames = `SELECT
CONCAT(employee.first_name, ' ', employee.last_name) fullname
FROM
employee;`;

const updatedEmployeeRoles = `update employee
set role_id = ? 
where employee.id = ?`

module.exports = {
  viewDepartments,
  viewEmployees,
  viewRoles,
  department,
  departmentId,
  insertNewRole,
  departmentNamesSQL,
  roleTitles,
  employeeFullName,
  selectEmployeeFullName,
  selectRoleId,
  insertNewEmployee,
  employeeNames,
  updatedEmployeeRoles
};
