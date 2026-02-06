
CREATE DATABASE IF NOT EXISTS employee_management CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;


USE employee_management;


DROP TABLE IF EXISTS contracts;
DROP TABLE IF EXISTS positions;
DROP TABLE IF EXISTS employees;
DROP TABLE IF EXISTS job_templates;
DROP TABLE IF EXISTS divisions;
DROP TABLE IF EXISTS service_units;
DROP TABLE IF EXISTS directions;
DROP TABLE IF EXISTS users;

CREATE TABLE users (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    email VARCHAR(255),
    password VARCHAR(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE directions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    missions TEXT,
    objectives TEXT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE service_units (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    code VARCHAR(50),
    direction_id BIGINT NOT NULL,
    FOREIGN KEY (direction_id) REFERENCES directions(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE divisions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    location VARCHAR(255),
    service_unit_id BIGINT NOT NULL,
    FOREIGN KEY (service_unit_id) REFERENCES service_units(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE job_templates (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    direction_id BIGINT,
    service_unit_id BIGINT,
    division_id BIGINT,
    FOREIGN KEY (direction_id) REFERENCES directions(id),
    FOREIGN KEY (service_unit_id) REFERENCES service_units(id),
    FOREIGN KEY (division_id) REFERENCES divisions(id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE positions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    level VARCHAR(100),
    category VARCHAR(100),
    status VARCHAR(50)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE employees (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    first_name VARCHAR(255) NOT NULL,
    last_name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    age INT NOT NULL,
    gender VARCHAR(20) NOT NULL,
    date_of_birth DATE,
    ssn VARCHAR(255),
    street VARCHAR(255),
    zip_code VARCHAR(50),
    city VARCHAR(255),
    country VARCHAR(255),
    mobile_phone VARCHAR(50),
    home_phone VARCHAR(50),
    emergency_contact VARCHAR(50),
    job_title VARCHAR(255),
    hire_date DATE,
    matricule VARCHAR(100),
    public_service_entry_date DATE,
    current_post_entry_date DATE,
    previous_position VARCHAR(255),
    administrative_status VARCHAR(255),
    status_category VARCHAR(255),
    highest_diploma VARCHAR(255),
    current_administrative_position VARCHAR(255),
    direction_id BIGINT,
    service_unit_id BIGINT,
    division_id BIGINT,
    job_template_id BIGINT,
    position_id BIGINT,
    user_id BIGINT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (direction_id) REFERENCES directions(id),
    FOREIGN KEY (service_unit_id) REFERENCES service_units(id),
    FOREIGN KEY (division_id) REFERENCES divisions(id),
    FOREIGN KEY (job_template_id) REFERENCES job_templates(id),
    FOREIGN KEY (position_id) REFERENCES positions(id),
    FOREIGN KEY (user_id) REFERENCES users(id),
    INDEX idx_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE employee_actions (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    employee_id BIGINT NOT NULL,
    action_type VARCHAR(50) NOT NULL,
    actor VARCHAR(255) NOT NULL,
    details TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

CREATE TABLE contracts (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    contract_type VARCHAR(100) NOT NULL,
    start_date DATE,
    end_date DATE,
    status VARCHAR(50),
    grade VARCHAR(100),
    employee_id BIGINT NOT NULL,
    FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

DELIMITER $$

CREATE TABLE IF NOT EXISTS leave_types (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL UNIQUE, -- ex: Congé Payé, RTT, Maladie
    description VARCHAR(255),
    default_days_allowed INT NOT NULL DEFAULT 0, -- Droit annuel par défaut (ex: 25)
    requires_proof BOOLEAN DEFAULT FALSE, -- Justificatif obligatoire ?
    carry_over_allowed BOOLEAN DEFAULT FALSE, -- Report autorisé N-1 ?
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci$$

-- 2. Table: leave_balances (Soldes de congés)
CREATE TABLE IF NOT EXISTS leave_balances (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    employee_id BIGINT NOT NULL,
    leave_type_id BIGINT NOT NULL,
    year INT NOT NULL, -- Année de référence (ex: 2024)
    total_days DECIMAL(5, 2) NOT NULL DEFAULT 0.00, -- Droit acquis
    used_days DECIMAL(5, 2) NOT NULL DEFAULT 0.00, -- Jours consommés
    pending_days DECIMAL(5, 2) NOT NULL DEFAULT 0.00, -- Jours en attente de validation
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE,
    FOREIGN KEY (leave_type_id) REFERENCES leave_types(id) ON DELETE CASCADE,
    UNIQUE KEY idx_balance_unique (employee_id, leave_type_id, year)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci$$

-- 3. Table: leave_requests (Demandes de congés)
CREATE TABLE IF NOT EXISTS leave_requests (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    employee_id BIGINT NOT NULL,
    leave_type_id BIGINT NOT NULL,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    days_count DECIMAL(5, 2) NOT NULL, -- Nombre de jours calculés (ex: 2.5)
    reason TEXT,
    status VARCHAR(20) NOT NULL DEFAULT 'PENDING', -- PENDING, APPROVED, REJECTED, CANCELLED
    rejection_reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (employee_id) REFERENCES employees(id) ON DELETE CASCADE,
    FOREIGN KEY (leave_type_id) REFERENCES leave_types(id) ON DELETE RESTRICT,
    INDEX idx_leave_request_employee (employee_id),
    INDEX idx_leave_request_status (status),
    INDEX idx_leave_request_dates (start_date, end_date)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci$$

-- 4. Table: leave_approvals (Audit du workflow d'approbation)
CREATE TABLE IF NOT EXISTS leave_approvals (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    leave_request_id BIGINT NOT NULL,
    approver_id BIGINT NOT NULL, -- Manager ou RH qui a validé/refusé
    status VARCHAR(20) NOT NULL, -- APPROVED, REJECTED
    comment TEXT,
    approval_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (leave_request_id) REFERENCES leave_requests(id) ON DELETE CASCADE,
    FOREIGN KEY (approver_id) REFERENCES employees(id) ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci$$

-- 5. Table: holidays (Jours fériés pour le calcul)
CREATE TABLE IF NOT EXISTS holidays (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    date DATE NOT NULL UNIQUE,
    is_recurring BOOLEAN DEFAULT TRUE -- Si vrai, revient chaque année (ex: 25 déc)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci$$

-- Initialisation des types de congés par défaut
-- INSERT IGNORE INTO leave_types (name, default_days_allowed, requires_proof) VALUES 
-- ('Congés Payés', 25, FALSE),
-- ('RTT', 10, FALSE),
-- ('Maladie', 0, TRUE),
-- ('Sans Solde', 0, FALSE);

DELIMITER ;
