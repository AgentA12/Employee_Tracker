DROP DATABASE IF EXISTS employee_tracker;

CREATE DATABASE employee_tracker;

USE employee_tracker;

-- select
--     role.id
-- from
--     role
-- where
--     role.title = "Lead Engineer";
update
    employee
set
    role_id = ?