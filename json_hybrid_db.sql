-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Erstellungszeit: 18. Aug 2026 um 14:40
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
-- Datenbank: `json_hybrid_db_test`
--

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `auftrag`
--

CREATE TABLE `auftrag` (
  `auftrag_id` int(11) NOT NULL,
  `daten` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`daten`)),
  `erstellt_am` datetime DEFAULT current_timestamp(),
  `p_id` int(11) NOT NULL,
  `bez_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `bezirk`
--

CREATE TABLE `bezirk` (
  `bezirk_id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `kuerzel` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `person`
--

CREATE TABLE `person` (
  `person_id` int(11) NOT NULL,
  `r_id` int(11) NOT NULL,
  `name` varchar(50) DEFAULT NULL,
  `vorname` varchar(50) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `telefon` varchar(25) DEFAULT NULL,
  `aktiv` tinyint(1) DEFAULT 1,
  `letzter_login` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `projekt`
--

CREATE TABLE `projekt` (
  `projekt_id` int(11) NOT NULL,
  `titel` varchar(100) NOT NULL,
  `beschreibung` text DEFAULT NULL,
  `aktiv` tinyint(1) DEFAULT 1,
  `erstellt_am` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `projekt_x_person`
--

CREATE TABLE `projekt_x_person` (
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
-- Indizes für die Tabelle `auftrag`
--
ALTER TABLE `auftrag`
  ADD PRIMARY KEY (`auftrag_id`),
  ADD KEY `auftrag_ibfk_1` (`p_id`),
  ADD KEY `auftrag_ibfk_2` (`bez_id`);

--
-- Indizes für die Tabelle `bezirk`
--
ALTER TABLE `bezirk`
  ADD PRIMARY KEY (`bezirk_id`),
  ADD UNIQUE KEY `index_unique_bezirk` (`bezirk_id`);

--
-- Indizes für die Tabelle `person`
--
ALTER TABLE `person`
  ADD PRIMARY KEY (`person_id`),
  ADD UNIQUE KEY `index_unique_email` (`email`),
  ADD UNIQUE KEY `index_unique_telefon` (`telefon`),
  ADD KEY `projekt_ibfk1` (`r_id`);

--
-- Indizes für die Tabelle `projekt`
--
ALTER TABLE `projekt`
  ADD PRIMARY KEY (`projekt_id`),
  ADD KEY `index_aktiv` (`aktiv`);

--
-- Indizes für die Tabelle `projekt_x_person`
--
ALTER TABLE `projekt_x_person`
  ADD PRIMARY KEY (`x_id`),
  ADD UNIQUE KEY `index_unique_person_in_projekt` (`projekt_id`,`person_id`),
  ADD KEY `projekt_x_person_ibfk_2` (`person_id`);

--
-- Indizes für die Tabelle `rolle`
--
ALTER TABLE `rolle`
  ADD PRIMARY KEY (`rolle_id`);

--
-- AUTO_INCREMENT für exportierte Tabellen
--

--
-- AUTO_INCREMENT für Tabelle `auftrag`
--
ALTER TABLE `auftrag`
  MODIFY `auftrag_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `person`
--
ALTER TABLE `person`
  MODIFY `person_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `projekt`
--
ALTER TABLE `projekt`
  MODIFY `projekt_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `projekt_x_person`
--
ALTER TABLE `projekt_x_person`
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
-- Constraints der Tabelle `auftrag`
--
ALTER TABLE `auftrag`
  ADD CONSTRAINT `auftrag_ibfk_1` FOREIGN KEY (`p_id`) REFERENCES `projekt` (`projekt_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `auftrag_ibfk_2` FOREIGN KEY (`bez_id`) REFERENCES `bezirk` (`bezirk_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints der Tabelle `person`
--
ALTER TABLE `person`
  ADD CONSTRAINT `projekt_ibfk1` FOREIGN KEY (`r_id`) REFERENCES `rolle` (`rolle_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints der Tabelle `projekt_x_person`
--
ALTER TABLE `projekt_x_person`
  ADD CONSTRAINT `projekt_x_person_ibfk_1` FOREIGN KEY (`projekt_id`) REFERENCES `projekt` (`projekt_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `projekt_x_person_ibfk_2` FOREIGN KEY (`person_id`) REFERENCES `person` (`person_id`) ON DELETE CASCADE ON UPDATE CASCADE;
COMMIT;



/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
