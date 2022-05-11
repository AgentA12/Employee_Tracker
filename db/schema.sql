CREATE TABLE departments (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(30)
);

CREATE TABLE role (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(30),
    salary DEC,
    department_id INT,
    FOREIGN KEY (department_id) REFERENCES departments(id) ON DELETE
    SET
        NULL
);

CREATE TABLE employee (
    id INT PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(30),
    last_name VARCHAR(30),
    role_id INT,
    FOREIGN KEY (role_id) REFERENCES role(id) ON DELETE CASCADE,
    manager_id INT REFERENCES employee(id)
);

DESCRIBE departments;

DESCRIBE role;

DESCRIBE employee;

SELECT
    title
from
    role
select
    *
from
    employee
where
    manager_id is null;

select
    id
from
    employee
where
    CONCAT(first_name, " ", last_name) = ?;

select
    id
from
    role
where
    role.title = ?;

update
    employee
set
    role_id = 1
where
    employee.id = 1;