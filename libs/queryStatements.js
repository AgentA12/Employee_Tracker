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

module.exports = {
  viewDepartments,
  viewEmployees,
  viewRoles,
  department,
  
};
