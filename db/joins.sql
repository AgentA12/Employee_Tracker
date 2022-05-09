SELECT
    employee.id,
    employee.first_name,
    employee.last_name,
    employee.role_id,
    role.id,
    role.title,
    role.salary
FROM
    employee
    LEFT JOIN role ON role.id = employee.role_id;