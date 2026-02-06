ALTER TABLE employees ADD COLUMN gender VARCHAR(20);
ALTER TABLE employees ADD COLUMN position_id BIGINT NULL;
ALTER TABLE employees ADD CONSTRAINT fk_employees_position FOREIGN KEY (position_id) REFERENCES positions(id);

UPDATE employees e
SET e.position_id = (
    SELECT p.id FROM positions p WHERE p.employee_id = e.id LIMIT 1
);

ALTER TABLE employees DROP COLUMN IF EXISTS department_id;
ALTER TABLE positions DROP COLUMN IF EXISTS employee_id;
