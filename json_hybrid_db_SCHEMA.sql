-- ============================================================
-- SCHEMA: json_hybrid_db
-- Zweck:   Erstellt die Datenbank und alle Tabellen mit
--          Best-Practice-Struktur (konsistente Namen,
--          Constraints direkt in CREATE TABLE, idempotent)
--
-- Ausführen:  mysql -u root -p < json_hybrid_db_SCHEMA.sql
-- ============================================================

-- Datenbank löschen und neu erstellen (idempotent)
DROP DATABASE IF EXISTS `json_hybrid_db`;
CREATE DATABASE `json_hybrid_db`
    CHARACTER SET utf8mb4
    COLLATE utf8mb4_unicc ode_ci;

USE `json_hybrid_db`;

-- ============================================================
-- Tabelle: rolle
-- Stammdaten: Rollen für Personen (Administrator, Projektleiter, ...)
-- ============================================================
DROP TABLE IF EXISTS `rolle`;
CREATE TABLE `rolle` (
    `rolle_id`     INT UNSIGNED NOT NULL AUTO_INCREMENT,
    `beschreibung` VARCHAR(100) NOT NULL,
    PRIMARY KEY (`rolle_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- Tabelle: bezirk
-- Stammdaten: Bezirke, in denen Aufträge ausgeführt werden
-- ============================================================
DROP TABLE IF EXISTS `bezirk`;
CREATE TABLE `bezirk` (
    `bezirk_id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
    `name`      VARCHAR(50)  NOT NULL,
    `kuerzel`   VARCHAR(50)  NOT NULL,
    PRIMARY KEY (`bezirk_id`),
    UNIQUE KEY `uq_bezirk_kuerzel` (`kuerzel`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- Tabelle: person
-- Personen mit Rolle (Fremdschlüssel auf rolle)
-- ============================================================
DROP TABLE IF EXISTS `person`;
CREATE TABLE `person` (
    `person_id`     INT UNSIGNED NOT NULL AUTO_INCREMENT,
    `r_id`          INT UNSIGNED NOT NULL,
    `name`          VARCHAR(50)  NOT NULL,
    `vorname`       VARCHAR(50)  NOT NULL,
    `email`         VARCHAR(100) NULL,
    `telefon`       VARCHAR(25)  NULL,
    `aktiv`         TINYINT(1)   NOT NULL DEFAULT TRUE,
    `letzter_login` DATETIME     NULL,
    PRIMARY KEY (`person_id`),
    UNIQUE KEY `uq_person_email` (`email`),
    UNIQUE KEY `uq_person_telefon` (`telefon`),
    KEY `idx_person_rolle` (`r_id`),
    CONSTRAINT `fk_person_rolle`
        FOREIGN KEY (`r_id`) REFERENCES `rolle` (`rolle_id`)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- Tabelle: projekt
-- Projekte, an denen Personen arbeiten
-- ============================================================
DROP TABLE IF EXISTS `projekt`;
CREATE TABLE `projekt` (
    `projekt_id`   INT UNSIGNED NOT NULL AUTO_INCREMENT,
    `titel`        VARCHAR(100) NOT NULL,
    `beschreibung` TEXT         NULL,
    `aktiv`        TINYINT(1)   NOT NULL DEFAULT TRUE,
    `erstellt_am`  DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (`projekt_id`),
    KEY `idx_projekt_aktiv` (`aktiv`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- Tabelle: projekt_x_person
-- Verknüpfungstabelle (n:m) zwischen projekt und person
-- ============================================================
DROP TABLE IF EXISTS `projekt_x_person`;
CREATE TABLE `projekt_x_person` (
    `x_id` INT UNSIGNED NOT NULL AUTO_INCREMENT,
    `projekt_id`          INT UNSIGNED NOT NULL,
    `person_id`           INT UNSIGNED NOT NULL,
    PRIMARY KEY (`x_id`),
    UNIQUE KEY `uq_projekt_person` (`projekt_id`, `person_id`),
    KEY `idx_pxp_person` (`person_id`),
    CONSTRAINT `fk_pxp_projekt`
        FOREIGN KEY (`projekt_id`) REFERENCES `projekt` (`projekt_id`)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    CONSTRAINT `fk_pxp_person`
        FOREIGN KEY (`person_id`) REFERENCES `person` (`person_id`)
        ON UPDATE CASCADE
        ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- Tabelle: auftrag
-- Aufträge mit flexiblen JSON-Daten (Hybrid-Modell)
-- ============================================================
DROP TABLE IF EXISTS `auftrag`;
CREATE TABLE `auftrag` (
    `auftrag_id`  INT UNSIGNED NOT NULL AUTO_INCREMENT,
    `daten`       JSON         NULL,
    `erstellt_am` DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    `p_id`        INT UNSIGNED NOT NULL,
    `bez_id`      INT UNSIGNED NOT NULL,
    PRIMARY KEY (`auftrag_id`),
    KEY `idx_auftrag_projekt` (`p_id`),
    KEY `idx_auftrag_bezirk` (`bez_id`),
    CONSTRAINT `fk_auftrag_projekt`
        FOREIGN KEY (`p_id`) REFERENCES `projekt` (`projekt_id`)
        ON UPDATE CASCADE
        ON DELETE CASCADE,
    CONSTRAINT `fk_auftrag_bezirk`
        FOREIGN KEY (`bez_id`) REFERENCES `bezirk` (`bezirk_id`)
        ON UPDATE CASCADE
        ON DELETE RESTRICT
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;