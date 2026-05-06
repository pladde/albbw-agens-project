-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Erstellungszeit: 30. Jan 2026 um 14:25
-- Server-Version: 10.4.32-MariaDB
-- PHP-Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Datenbank: `agens_holz_spielwaren_dienstleistungen`
--

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `auftrag_x_projekt_nummer`
--

CREATE TABLE `auftrag_x_projekt_nummer` (
  `x_id` int(11) NOT NULL,
  `auftrag_id` int(11) NOT NULL,
  `projekt_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `dienstleistung`
--

CREATE TABLE `dienstleistung` (
  `auftrag_id` int(11) NOT NULL,
  `bearbeitet_von` varchar(50) NOT NULL,
  `aufnahme_datum` datetime NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `qr_code_pfad` varchar(500) DEFAULT NULL,
  `bild_pfad` varchar(500) DEFAULT NULL,
  `sonstiges` varchar(500) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `person`
--

CREATE TABLE `person` (
  `person_id` int(11) NOT NULL,
  `rolle_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `projekt_nummer`
--

CREATE TABLE `projekt_nummer` (
  `projekt_id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `projekt_nummer_x_person`
--

CREATE TABLE `projekt_nummer_x_person` (
  `x_id` int(11) NOT NULL,
  `projekt_id` int(11) NOT NULL,
  `person_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `rolle`
--

CREATE TABLE `rolle` (
  `rolle_id` int(11) NOT NULL,
  `beschreibung` varchar(100) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indizes der exportierten Tabellen
--

--
-- Indizes für die Tabelle `auftrag_x_projekt_nummer`
--
ALTER TABLE `auftrag_x_projekt_nummer`
  ADD PRIMARY KEY (`x_id`),
  ADD KEY `auftrag_id` (`auftrag_id`),
  ADD KEY `projekt_id` (`projekt_id`);

--
-- Indizes für die Tabelle `dienstleistung`
--
ALTER TABLE `dienstleistung`
  ADD PRIMARY KEY (`auftrag_id`);

--
-- Indizes für die Tabelle `person`
--
ALTER TABLE `person`
  ADD PRIMARY KEY (`person_id`),
  ADD KEY `rolle_id` (`rolle_id`);

--
-- Indizes für die Tabelle `projekt_nummer`
--
ALTER TABLE `projekt_nummer`
  ADD PRIMARY KEY (`projekt_id`);

--
-- Indizes für die Tabelle `projekt_nummer_x_person`
--
ALTER TABLE `projekt_nummer_x_person`
  ADD PRIMARY KEY (`x_id`),
  ADD UNIQUE KEY `person_id` (`person_id`),
  ADD KEY `projekt_id` (`projekt_id`);

--
-- Indizes für die Tabelle `rolle`
--
ALTER TABLE `rolle`
  ADD PRIMARY KEY (`rolle_id`);

--
-- AUTO_INCREMENT für exportierte Tabellen
--

--
-- AUTO_INCREMENT für Tabelle `auftrag_x_projekt_nummer`
--
ALTER TABLE `auftrag_x_projekt_nummer`
  MODIFY `x_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `dienstleistung`
--
ALTER TABLE `dienstleistung`
  MODIFY `auftrag_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `person`
--
ALTER TABLE `person`
  MODIFY `person_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `projekt_nummer`
--
ALTER TABLE `projekt_nummer`
  MODIFY `projekt_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `projekt_nummer_x_person`
--
ALTER TABLE `projekt_nummer_x_person`
  MODIFY `x_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `rolle`
--
ALTER TABLE `rolle`
  MODIFY `rolle_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints der exportierten Tabellen
--

--
-- Constraints der Tabelle `auftrag_x_projekt_nummer`
--
ALTER TABLE `auftrag_x_projekt_nummer`
  ADD CONSTRAINT `fk_auftrag` FOREIGN KEY (`auftrag_id`) REFERENCES `dienstleistung` (`auftrag_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_projekt_auftrag` FOREIGN KEY (`projekt_id`) REFERENCES `projekt_nummer` (`projekt_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints der Tabelle `person`
--
ALTER TABLE `person`
  ADD CONSTRAINT `fk_rolle` FOREIGN KEY (`rolle_id`) REFERENCES `rolle` (`rolle_id`) ON UPDATE CASCADE;

--
-- Constraints der Tabelle `projekt_nummer_x_person`
--
ALTER TABLE `projekt_nummer_x_person`
  ADD CONSTRAINT `fk_person_projekt` FOREIGN KEY (`person_id`) REFERENCES `person` (`person_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `fk_projekt_person` FOREIGN KEY (`projekt_id`) REFERENCES `projekt_nummer` (`projekt_id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
