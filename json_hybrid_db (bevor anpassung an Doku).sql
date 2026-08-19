-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Erstellungszeit: 18. Aug 2026 um 14:38
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
-- Datenbank: `json_hybrid_db`
--

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `auftrag`
--

CREATE TABLE `auftrag` (
  `auftrag_id` int(11) NOT NULL,
  `projekt_id` int(11) NOT NULL,
  `name_beschreibung` varchar(50) NOT NULL,
  `bearbeitet_von` varchar(50) NOT NULL,
  `aufnahme_datum` datetime DEFAULT current_timestamp(),
  `status` enum('offen','in_bearbeitung','abgeschlossen','storniert') DEFAULT 'offen',
  `daten` longtext CHARACTER SET utf8mb4 COLLATE utf8mb4_bin DEFAULT NULL CHECK (json_valid(`daten`)),
  `aktualisiert_am` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `person`
--

CREATE TABLE `person` (
  `person_id` int(11) NOT NULL,
  `vorname` varchar(50) DEFAULT NULL,
  `nachname` varchar(50) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Daten für Tabelle `person`
--

INSERT INTO `person` (`person_id`, `vorname`, `nachname`, `email`) VALUES
(1, 'Max', 'Mustermann', 'max.mustermann@example.com'),
(2, 'Erika', 'Musterfrau', 'erika.musterfrau@example.com'),
(3, 'Anna', 'Musterfrau', 'anna.musterfrau@example.com'),
(4, 'Peter', 'Muster', 'peter.muster@example.com');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `person_x_rolle`
--

CREATE TABLE `person_x_rolle` (
  `x_id` int(11) NOT NULL,
  `person_id` int(11) NOT NULL,
  `rolle_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Daten für Tabelle `person_x_rolle`
--

INSERT INTO `person_x_rolle` (`x_id`, `person_id`, `rolle_id`) VALUES
(1, 1, 1),
(2, 2, 2),
(3, 3, 3),
(4, 4, 1);

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `projekt`
--

CREATE TABLE `projekt` (
  `projekt_id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `beschreibung` text DEFAULT NULL,
  `aktiv` tinyint(1) DEFAULT 1,
  `erstellt_am` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Daten für Tabelle `projekt`
--

INSERT INTO `projekt` (`projekt_id`, `name`, `beschreibung`, `aktiv`, `erstellt_am`) VALUES
(1, 'Dienstleistung', 'Aufträge für Dienstleistungen mit QR-Codes und Bildern', 1, '2024-01-01 10:00:00'),
(2, 'Holzspielwaren', 'Aufträge für Holzspielwaren-Produktion', 1, '2024-01-01 10:00:00'),
(3, 'Spielwaren', 'Aufträge für Spielwaren-Reparatur', 1, '2024-01-01 10:00:00');

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `projekt_x_person`
--

CREATE TABLE `projekt_x_person` (
  `x_id` int(11) NOT NULL,
  `projekt_id` int(11) NOT NULL,
  `person_id` int(11) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Daten für Tabelle `projekt_x_person`
--

INSERT INTO `projekt_x_person` (`x_id`, `projekt_id`, `person_id`) VALUES
(1, 1, 1),
(4, 2, 4),
(2, 3, 2),
(3, 3, 3);

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `rolle`
--

CREATE TABLE `rolle` (
  `rolle_id` int(11) NOT NULL,
  `bezeichnung` varchar(50) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Daten für Tabelle `rolle`
--

INSERT INTO `rolle` (`rolle_id`, `bezeichnung`) VALUES
(3, 'Administrator'),
(2, 'Bereichsleiter'),
(1, 'Mitarbeiter'),
(4, 'Praktikant');

--
-- Indizes der exportierten Tabellen
--

--
-- Indizes für die Tabelle `auftrag`
--
ALTER TABLE `auftrag`
  ADD PRIMARY KEY (`auftrag_id`),
  ADD KEY `index_projekt_id` (`projekt_id`),
  ADD KEY `index_bearbeitet_von` (`bearbeitet_von`),
  ADD KEY `index_status` (`status`),
  ADD KEY `index_aufnahme_datum` (`aufnahme_datum`);

--
-- Indizes für die Tabelle `person`
--
ALTER TABLE `person`
  ADD PRIMARY KEY (`person_id`),
  ADD UNIQUE KEY `index_unique_email` (`email`);

--
-- Indizes für die Tabelle `person_x_rolle`
--
ALTER TABLE `person_x_rolle`
  ADD PRIMARY KEY (`x_id`),
  ADD UNIQUE KEY `unique_person_rolle` (`person_id`,`rolle_id`),
  ADD KEY `person_x_rolle_ibfk_2` (`rolle_id`);

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
  ADD PRIMARY KEY (`rolle_id`),
  ADD UNIQUE KEY `index_unique_bezeichnung` (`bezeichnung`);

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
  MODIFY `person_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT für Tabelle `person_x_rolle`
--
ALTER TABLE `person_x_rolle`
  MODIFY `x_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT für Tabelle `projekt`
--
ALTER TABLE `projekt`
  MODIFY `projekt_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=4;

--
-- AUTO_INCREMENT für Tabelle `projekt_x_person`
--
ALTER TABLE `projekt_x_person`
  MODIFY `x_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT für Tabelle `rolle`
--
ALTER TABLE `rolle`
  MODIFY `rolle_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- Constraints der exportierten Tabellen
--

--
-- Constraints der Tabelle `auftrag`
--
ALTER TABLE `auftrag`
  ADD CONSTRAINT `auftrag_ibfk_1` FOREIGN KEY (`projekt_id`) REFERENCES `projekt` (`projekt_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints der Tabelle `person_x_rolle`
--
ALTER TABLE `person_x_rolle`
  ADD CONSTRAINT `person_x_rolle_ibfk_1` FOREIGN KEY (`person_id`) REFERENCES `person` (`person_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `person_x_rolle_ibfk_2` FOREIGN KEY (`rolle_id`) REFERENCES `rolle` (`rolle_id`) ON DELETE CASCADE ON UPDATE CASCADE;

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
