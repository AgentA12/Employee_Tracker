INSERT INTO
    departments (name)
VALUES
    ("sales"),
    ("finance"),
    ("engineering"),
    ("legal"),
    ("human resources");

INSERT INTO
    role (title, salary, department_id)
VALUES
    ("Senior Engineer", 100000, 3),
    ("Lead Engineer", 150000, 3),
    ("Junior Engineer", 80000, 3),
    ("Sales Manager", 120000, 1),
    ("Sales associate", 60000, 1),
    ("Accountant", 110000, 2),
    ("Account Manager", 160000, 2),
    ("Legal Team Lead", 170000, 4),
    ("Lawyer", 150000, 4),
    ("Paralegal", 55000, 4),
    ("HR Director", 120000, 5),
    ("Recruiter", 70000, 5);

INSERT INTO
    employee (first_name, last_name, role_id, manager_id)
VALUES
    ("Ariyan", "Acevedo", 3, 2),
    ("Anya", "Norton", 2, NULL),
    ("Dario", "Duke", 1, 2),
    ("Joey", "Gilmore", 4, NULL),
    ("Abbey", "Sandoval", 5, 4),
    ("Loretta", "Forster", 6, 7),
    ("Izabelle", "Hensley", 7, NULL),
    ("Eshaan", "Hirst", 6, 7),
    ("Leonidas", "Dean", 8, NULL),
    ("Monique", "Correa", 9, 9),
    ("Abdirahman", "Heaton", 9, 9),
    ("Elizabeth", "Barnes", 10, 9),
    ("Ella-Rose", "Neville", 12, 15),
    ("Desiree", "Finney", 12, 15),
    ("Ingrid", "Ingrid", 11, NULL);

SELECT
    *
FROM
    departments;

SELECT
    *
FROM
    role;

SELECT
    *
FROM
    employee;

-- SELECT
--     CONCAT(employee.first_name, ' ', employee.last_name) fullname
-- FROM
--     employee
-- where
-- where
--     employee.fullname = ?;