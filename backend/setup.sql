CREATE DATABASE IF NOT EXISTS it_asset_mgmt;
USE it_asset_mgmt;

CREATE TABLE IF NOT EXISTS departments (
    dept_id INT AUTO_INCREMENT PRIMARY KEY,
    dept_name VARCHAR(255) NOT NULL
);

CREATE TABLE IF NOT EXISTS users (
    user_id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(255) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    user_role VARCHAR(50) NOT NULL,
    dept_id INT,
    FOREIGN KEY (dept_id) REFERENCES departments(dept_id)
);

CREATE TABLE IF NOT EXISTS assets (
    asset_id INT AUTO_INCREMENT PRIMARY KEY,
    asset_name VARCHAR(255) NOT NULL,
    category VARCHAR(100),
    s_no VARCHAR(100),
    location VARCHAR(255),
    amc_or_war VARCHAR(50),
    status VARCHAR(50),
    purchase_date DATE,
    warranty_expiry DATE,
    inventory INT DEFAULT 1,
    vendor_name VARCHAR(255),
    dept_id INT,
    FOREIGN KEY (dept_id) REFERENCES departments(dept_id)
);

CREATE TABLE IF NOT EXISTS complaints (
    comp_id INT AUTO_INCREMENT PRIMARY KEY,
    asset_id INT,
    raised_by INT,
    issue TEXT,
    comp_status VARCHAR(50) DEFAULT 'Open',
    priority VARCHAR(50) DEFAULT 'Medium',
    creation_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    eng_assigned INT,
    expected_res_date DATE,
    spare_req VARCHAR(255),
    total_time_taken VARCHAR(50),
    actual_res_date DATE,
    comp_type VARCHAR(50),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (asset_id) REFERENCES assets(asset_id),
    FOREIGN KEY (raised_by) REFERENCES users(user_id),
    FOREIGN KEY (eng_assigned) REFERENCES users(user_id)
);

CREATE TABLE IF NOT EXISTS call_logs (
    call_id INT AUTO_INCREMENT PRIMARY KEY,
    call_type ENUM('Phone', 'Email', 'Walk-in') NOT NULL,
    contact_person VARCHAR(255) NOT NULL,
    contact_number VARCHAR(50),
    description TEXT,
    handled_by VARCHAR(255),
    status ENUM('Open', 'In Progress', 'Closed') DEFAULT 'Open',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS pm_reports (
    report_id INT AUTO_INCREMENT PRIMARY KEY,
    asset_id INT,
    report_type ENUM('Maintenance', 'Inspection', 'Repair') NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500),
    file_size INT,
    uploaded_by INT,
    status ENUM('Pending', 'Reviewed', 'Approved') DEFAULT 'Pending',
    notes TEXT,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    reviewed_at TIMESTAMP NULL,
    FOREIGN KEY (asset_id) REFERENCES assets(asset_id),
    FOREIGN KEY (uploaded_by) REFERENCES users(user_id)
);

-- Insert some default departments
INSERT INTO departments (dept_name) VALUES ('IT'), ('HR'), ('Finance'), ('Operations') ON DUPLICATE KEY UPDATE dept_name=dept_name;
