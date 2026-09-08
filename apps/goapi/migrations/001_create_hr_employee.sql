CREATE EXTENSION IF NOT EXISTS pgcrypto;
CREATE TABLE hr_employee (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    employee_no VARCHAR(50) NOT NULL UNIQUE,

    first_name VARCHAR(100) NOT NULL,
    middle_name VARCHAR(100),
    last_name VARCHAR(100),
    preferred_name VARCHAR(100),

    birth_date DATE,
    gender VARCHAR(30),
    nationality VARCHAR(100),

    email VARCHAR(255),
    phone VARCHAR(50),

    address TEXT,
    city VARCHAR(100),
    province VARCHAR(100),
    postal_code VARCHAR(20),
    country VARCHAR(100),

    emergency_contact_name VARCHAR(200),
    emergency_contact_phone VARCHAR(50),

    hire_date DATE NOT NULL,

    status VARCHAR(30) NOT NULL DEFAULT 'ACTIVE',

    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

CREATE INDEX idx_hr_employee_employee_no
    ON hr_employee(employee_no);

CREATE INDEX idx_hr_employee_email
    ON hr_employee(email);

CREATE INDEX idx_hr_employee_status
    ON hr_employee(status);

CREATE INDEX idx_hr_employee_deleted_at
    ON hr_employee(deleted_at);