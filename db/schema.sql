CREATE DATABASE IF NOT EXISTS timetracker
  CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

USE timetracker;

CREATE TABLE IF NOT EXISTS `User` (
  Id         INT AUTO_INCREMENT PRIMARY KEY,
  FirstName  VARCHAR(50) NOT NULL,
  MiddleName VARCHAR(50) NOT NULL,
  LastName   VARCHAR(50) NOT NULL,
  Email      VARCHAR(120) NOT NULL,
  UNIQUE KEY uq_user_email (Email)
);

CREATE TABLE IF NOT EXISTS `Project` (
  Id   INT AUTO_INCREMENT PRIMARY KEY,
  Name VARCHAR(50) NOT NULL,
  UNIQUE KEY uq_project_name (Name)
);

CREATE TABLE IF NOT EXISTS `TimeLog` (
  Id        BIGINT AUTO_INCREMENT PRIMARY KEY,
  UserId    INT NOT NULL,
  ProjectId INT NOT NULL,
  WorkDate  DATE NOT NULL,
  Hours     DECIMAL(4,2) NOT NULL,
  CreatedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,

  KEY idx_timelog_user_date (UserId, WorkDate),

  CONSTRAINT fk_timelog_user
    FOREIGN KEY (UserId) REFERENCES `User`(Id),

  CONSTRAINT fk_timelog_project
    FOREIGN KEY (ProjectId) REFERENCES `Project`(Id),

  CONSTRAINT chk_timelog_hours
    CHECK (Hours >= 0.25 AND Hours <= 8.00)
);

CREATE TABLE IF NOT EXISTS `CollectedBatch` (
  Id         BIGINT AUTO_INCREMENT PRIMARY KEY,
  ReceivedAt TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
  Payload    JSON NOT NULL
);
