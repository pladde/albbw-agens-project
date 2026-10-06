-- Bestehende Datenbank löschen, falls vorhanden, und neu erstellen
DROP DATABASE IF EXISTS `agens_service`;
CREATE DATABASE `agens_service` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_general_ci;
USE `agens_service`;

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET foreign_key_checks = 0;

-- --------------------------------------------------------
-- Tabellenstruktur für Tabelle `bezirk`
-- --------------------------------------------------------
CREATE TABLE `bezirk` (
  `bezirk_id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) NOT NULL,
  `kürzel` varchar(25) NOT NULL,
  PRIMARY KEY (`bezirk_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
-- Tabellenstruktur für Tabelle `mitarbeiter`
-- --------------------------------------------------------
CREATE TABLE `mitarbeiter` (
  `mitarbeiter_id` int(11) NOT NULL AUTO_INCREMENT,
  `vorname` varchar(50) NOT NULL,
  `nachname` varchar(50) NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `telefon` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`mitarbeiter_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
-- Tabellenstruktur für Tabelle `projekt_nummer`
-- --------------------------------------------------------
CREATE TABLE `projekt_nummer` (
  `projekt_nummer_id` int(11) NOT NULL AUTO_INCREMENT,
  `projekt_nummer` int(100) DEFAULT NULL,
  PRIMARY KEY (`projekt_nummer_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
-- Tabellenstruktur für Tabelle `service_bereich`
-- --------------------------------------------------------
CREATE TABLE `service_bereich` (
  `service_bereich_id` int(11) NOT NULL AUTO_INCREMENT,
  `name` varchar(50) DEFAULT NULL,
  `beschreibung` varchar(500) DEFAULT NULL,
  `aktiv` tinyint(4) DEFAULT NULL COMMENT '"0" = nicht aktiver Bereich, sonst zeigt der Wert welcher Bereich "aktiv" ist (Projektnummer von Agentur f. Arbeit)',
  PRIMARY KEY (`service_bereich_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
-- Tabellenstruktur für Tabelle `status`
-- --------------------------------------------------------
CREATE TABLE `status` (
  `status_id` int(11) NOT NULL AUTO_INCREMENT,
  `status` enum('angenommen','in-bearbeitung','angelehnt','abgeschlossen') NOT NULL,
  PRIMARY KEY (`status_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------
-- Tabellenstruktur für Tabelle `auftrag`
-- --------------------------------------------------------
CREATE TABLE `auftrag` (
  `auftrag_id` int(11) NOT NULL AUTO_INCREMENT,
  `service_bereich_id` int(11) NOT NULL,
  `bezirk_id` int(11) NOT NULL,
  `mitarbeiter_id` int(11) NOT NULL,
  `status_id` int(11) NOT NULL,
  `titel` varchar(50) NOT NULL,
  `beschreibung` varchar(500) DEFAULT NULL,
  `erstellt_am` datetime NOT NULL,
  `abgeschlossen_am` datetime DEFAULT NULL,
  PRIMARY KEY (`auftrag_id`),
  CONSTRAINT `fk_auftrag_bezirk` FOREIGN KEY (`bezirk_id`) REFERENCES `bezirk` (`bezirk_id`),
  CONSTRAINT `fk_auftrag_mitarbeiter` FOREIGN KEY (`mitarbeiter_id`) REFERENCES `mitarbeiter` (`mitarbeiter_id`),
  CONSTRAINT `fk_auftrag_service_bereich` FOREIGN KEY (`service_bereich_id`) REFERENCES `service_bereich` (`service_bereich_id`),
  CONSTRAINT `fk_auftrag_status` FOREIGN KEY (`status_id`) REFERENCES `status` (`status_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

SET foreign_key_checks = 1;
