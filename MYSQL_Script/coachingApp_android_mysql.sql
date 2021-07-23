-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
-- -----------------------------------------------------
-- Schema androidprojekt
-- -----------------------------------------------------

-- -----------------------------------------------------
-- Schema androidprojekt
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `androidprojekt` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_0900_ai_ci ;
USE `androidprojekt` ;

-- -----------------------------------------------------
-- Table `androidprojekt`.`coaches`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `androidprojekt`.`coaches` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `email` VARCHAR(100) NOT NULL,
  `password` VARCHAR(500) NOT NULL,
  `name` VARCHAR(500) NOT NULL,
  `phone` VARCHAR(45) NOT NULL,
  `discord` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id`),
  UNIQUE INDEX `idcoaches_UNIQUE` (`id` ASC) VISIBLE,
  UNIQUE INDEX `email_UNIQUE` (`email` ASC) VISIBLE)
ENGINE = InnoDB
AUTO_INCREMENT = 146
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `androidprojekt`.`students`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `androidprojekt`.`students` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `name` VARCHAR(45) NULL DEFAULT NULL,
  `password` VARCHAR(500) NOT NULL,
  `email` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`id`, `email`),
  UNIQUE INDEX `id_UNIQUE` (`id` ASC) VISIBLE,
  UNIQUE INDEX `name_UNIQUE` (`name` ASC) VISIBLE)
ENGINE = InnoDB
AUTO_INCREMENT = 22
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


-- -----------------------------------------------------
-- Table `androidprojekt`.`sessions`
-- -----------------------------------------------------
CREATE TABLE IF NOT EXISTS `androidprojekt`.`sessions` (
  `id` INT NOT NULL AUTO_INCREMENT,
  `coachid` INT NOT NULL,
  `studentid` INT NULL DEFAULT NULL,
  `date` DATE NOT NULL,
  `starttime` TIME NOT NULL,
  `endtime` TIME NOT NULL,
  `game` VARCHAR(50) NOT NULL,
  `description` VARCHAR(200) NULL DEFAULT NULL,
  PRIMARY KEY (`id`),
  INDEX `coachid_idx` (`coachid` ASC) VISIBLE,
  INDEX `studentid_idx` (`studentid` ASC) VISIBLE,
  CONSTRAINT `coachid`
    FOREIGN KEY (`coachid`)
    REFERENCES `androidprojekt`.`coaches` (`id`),
  CONSTRAINT `studentid`
    FOREIGN KEY (`studentid`)
    REFERENCES `androidprojekt`.`students` (`id`))
ENGINE = InnoDB
AUTO_INCREMENT = 133
DEFAULT CHARACTER SET = utf8mb4
COLLATE = utf8mb4_0900_ai_ci;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;
