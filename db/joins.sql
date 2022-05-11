-- SELECT
--     role.id,
--     role.title,
--     role.salary,
--     departments.name
-- FROM
--     role
--     LEFT JOIN departments ON role.department_id = departments.id;
-- SELECT
--     employee.id AS employeeID,
--     employee.first_name,
--     employee.last_name,
--     role.title,
--     role.salary,
--     manager.first_name AS manager,
--     departments.name AS department
-- FROM
--     employee
--     LEFT JOIN role ON employee.role_id = role.id
--     LEFT JOIN departments ON departments.id = role.department_id
--     LEFT JOIN employee AS manager ON employee.manager_id = manager.id;
-- SELECT
--     employee.first_name,
--     manager.first_name
-- FROM
--     employee
--     LEFT JOIN employee AS manager ON employee.manager_id = manager.id
-- INSERT into
--     departments (name)
-- VALUES
--     ("SHIFT WORK");
-- SELECT
--     name
-- FROM
--     departments;
SELECT
    *
FROM
    departments
WHERE
    departments.name = ?;