-- BusID+ MySQL Schema

CREATE DATABASE IF NOT EXISTS busid_plus;
USE busid_plus;

-- Users Table
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'verifier', 'student') NOT NULL,
    roll_no VARCHAR(50),
    dept VARCHAR(100),
    semester VARCHAR(10),
    phone VARCHAR(15),
    avatar VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Routes Table
CREATE TABLE IF NOT EXISTS routes (
    id VARCHAR(10) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    stops TEXT NOT NULL,
    fare DECIMAL(10, 2) NOT NULL,
    distance VARCHAR(20) NOT NULL
);

-- Applications Table
CREATE TABLE IF NOT EXISTS applications (
    id VARCHAR(50) PRIMARY KEY,
    student_id VARCHAR(50) NOT NULL,
    student_name VARCHAR(100) NOT NULL,
    roll_no VARCHAR(50) NOT NULL,
    dept VARCHAR(100) NOT NULL,
    route_id VARCHAR(10) NOT NULL,
    receipt_no VARCHAR(50) NOT NULL,
    amount DECIMAL(10, 2) NOT NULL,
    status ENUM('pending', 'approved', 'rejected') DEFAULT 'pending',
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    reviewed_at TIMESTAMP NULL,
    reviewed_by VARCHAR(50) NULL,
    remarks TEXT,
    semester VARCHAR(10) NOT NULL,
    phone VARCHAR(15) NOT NULL,
    FOREIGN KEY (student_id) REFERENCES users(id),
    FOREIGN KEY (route_id) REFERENCES routes(id)
);

-- Passes Table
CREATE TABLE IF NOT EXISTS passes (
    id VARCHAR(50) PRIMARY KEY,
    app_id VARCHAR(50) NOT NULL,
    student_id VARCHAR(50) NOT NULL,
    student_name VARCHAR(100) NOT NULL,
    roll_no VARCHAR(50) NOT NULL,
    dept VARCHAR(100) NOT NULL,
    route_id VARCHAR(10) NOT NULL,
    issued_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    valid_from DATE NOT NULL,
    valid_to DATE NOT NULL,
    status ENUM('active', 'expired', 'cancelled') DEFAULT 'active',
    verify_count INT DEFAULT 0,
    trips_remaining INT DEFAULT 60,
    FOREIGN KEY (app_id) REFERENCES applications(id),
    FOREIGN KEY (student_id) REFERENCES users(id),
    FOREIGN KEY (route_id) REFERENCES routes(id)
);

-- Attendance Table
CREATE TABLE IF NOT EXISTS attendance (
    id INT AUTO_INCREMENT PRIMARY KEY,
    pass_id VARCHAR(50) NOT NULL,
    student_id VARCHAR(50) NOT NULL,
    route_id VARCHAR(10) NOT NULL,
    scanned_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (pass_id) REFERENCES passes(id),
    FOREIGN KEY (student_id) REFERENCES users(id),
    FOREIGN KEY (route_id) REFERENCES routes(id)
);

-- Verification Logs Table
CREATE TABLE IF NOT EXISTS verify_logs (
    id VARCHAR(50) PRIMARY KEY,
    pass_id VARCHAR(50) NOT NULL,
    student_name VARCHAR(100) NOT NULL,
    roll_no VARCHAR(50) NOT NULL,
    route_id VARCHAR(10) NOT NULL,
    result ENUM('valid', 'invalid') NOT NULL,
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ip VARCHAR(45),
    device VARCHAR(255),
    FOREIGN KEY (pass_id) REFERENCES passes(id),
    FOREIGN KEY (route_id) REFERENCES routes(id)
);

-- Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(50) NOT NULL,
    title VARCHAR(100) NOT NULL,
    message TEXT NOT NULL,
    type ENUM('info', 'success', 'warning', 'danger') DEFAULT 'info',
    is_read BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- System Settings Table
CREATE TABLE IF NOT EXISTS settings (
    setting_key VARCHAR(50) PRIMARY KEY,
    setting_value TEXT NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Audit Logs Table (For critical admin actions)
CREATE TABLE IF NOT EXISTS audit_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    admin_id VARCHAR(50),
    action VARCHAR(255) NOT NULL,
    target_type VARCHAR(50),
    target_id VARCHAR(50),
    timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (admin_id) REFERENCES users(id)
);

-- Initial Settings
INSERT IGNORE INTO settings (setting_key, setting_value) VALUES
('college_name', 'CITY COLLEGE'),
('academic_year', '2024-25'),
('pass_prefix', 'PASS-'),
('auto_approval', 'false');

-- Initial Routes Data
INSERT IGNORE INTO routes (id, name, stops, fare, distance) VALUES
('R01', 'City Center – North Campus', 'City Square → MG Road → College Gate A', 400.00, '12 km'),
('R02', 'East District – Main Campus', 'East Bus Stand → Railway Station → Main Gate', 350.00, '9 km'),
('R03', 'South Hills – Tech Block', 'South Market → Hill Top → Tech Gate', 450.00, '15 km'),
('R04', 'West Zone – Library Block', 'West Colony → Supermarket → Library Gate', 300.00, '7 km'),
('R05', 'Airport Road – Sports Complex', 'Airport Junction → Highway → Sports Gate', 500.00, '18 km');

-- Initial Users (Simulated)
-- Note: Passwords should be hashed in the actual app implementation
INSERT IGNORE INTO users (id, name, email, password, role) VALUES
('U001', 'Admin User', 'admin@college.edu', 'admin123', 'admin'),
('U002', 'Verify Staff', 'verify@college.edu', 'verify123', 'verifier');
