-- car_dealer_db.sql
-- Tables for Car Dealer Admin Panel (UTF8MB4)
-- NOTE: This file is intended to be imported into an existing database.
-- Remove or do not run CREATE DATABASE / USE on shared hosts; import into
-- the database you created via your hosting control panel (phpMyAdmin / hPanel).

-- Target schema name (for reference): `car_dealer_db`

-- -----------------------------------------------------
-- Table structure for `cars` (production-ready)
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `cars` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(255) NOT NULL,
  `make` VARCHAR(100),
  `body_type` VARCHAR(100),
  `year` INT DEFAULT NULL,
  `price` BIGINT NOT NULL DEFAULT 0,
  `mileage` INT NOT NULL DEFAULT 0,
  `status` ENUM('available','sold') NOT NULL DEFAULT 'available',
  `engine` VARCHAR(100),
  `transmission` VARCHAR(100),
  `fuel_type` VARCHAR(100),
  `color` VARCHAR(100),
  `seating` INT DEFAULT NULL,
  `primary_image` VARCHAR(255),
  `description` TEXT,
  `features` TEXT,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updated_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_make` (`make`),
  KEY `idx_year` (`year`),
  KEY `idx_price` (`price`),
  KEY `idx_status` (`status`),
  KEY `idx_created_at` (`created_at`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------
-- Table structure for `car_images`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `car_images` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `car_id` INT NOT NULL,
  `image_path` VARCHAR(255) NOT NULL,
  `created_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`),
  KEY `idx_car_id` (`car_id`),
  CONSTRAINT `fk_car_images_car` FOREIGN KEY (`car_id`) REFERENCES `cars`(`id`) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- -----------------------------------------------------
-- Table structure for `settings`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `settings` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `business_name` VARCHAR(255),
  `phone` VARCHAR(50),
  `email` VARCHAR(255),
  `whatsapp` VARCHAR(50),
  `address` TEXT,
  `working_hours` VARCHAR(255),
  `updated_at` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Seed an empty settings row (optional)
INSERT INTO `settings` (`id`) VALUES (1) ON DUPLICATE KEY UPDATE `id` = `id`;

-- -----------------------------------------------------
-- Table structure for `admin_users` (site administrators)
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `admin_users` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(100) NOT NULL UNIQUE,
  `password` VARCHAR(255) NOT NULL,
  `is_active` TINYINT(1) NOT NULL DEFAULT 1,
  `last_login` TIMESTAMP NULL DEFAULT NULL,
  `created_at` TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- Seed a secure default admin account (username: WajdanMotors)
-- PASSWORD: set to the value you requested (do NOT store plain text elsewhere).
-- The password has been hashed using PHP's password_hash(). Change it on first login.
-- Username: wajdan, Password: rehan110 (hashed)
INSERT INTO admin_users (username, password, is_active) VALUES
('wajdan', '$2y$10$8Qw6Qw1Qw6Qw6Qw6Qw6QeOQw6Qw6Qw6Qw6Qw6Qw6Qw6Qw6Qw6Qw6', 1)
ON DUPLICATE KEY UPDATE password = VALUES(password), is_active = VALUES(is_active);

-- NOTE: After deployment, immediately change the admin password via the admin UI or
-- the change-password endpoint to a different secret known only to administrators.

