    -- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Erstellungszeit: 21. Sep 2026 um 15:29
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
-- Datenbank: `agens_service`
--

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `auftrag`
--

CREATE TABLE `auftrag` (
  `auftrag_id` int(11) NOT NULL,
  `service_bereich_id` int(11) NOT NULL,
  `bezirk_id` int(11) NOT NULL,
  `mitarbeiter_id` int(11) NOT NULL,
  `status_id` int(11) NOT NULL,
  `titel` varchar(50) NOT NULL,
  `beschreibung` varchar(500) DEFAULT NULL,
  `erstellt_am` datetime NOT NULL,
  `abgeschlossen_am` datetime DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `bezirk`
--

CREATE TABLE `bezirk` (
  `bezirk_id` int(11) NOT NULL,
  `name` varchar(50) NOT NULL,
  `kürzel` varchar(25) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `mitarbeiter`
--

CREATE TABLE `mitarbeiter` (
  `mitarbeiter_id` int(11) NOT NULL,
  `vorname` varchar(50) NOT NULL,
  `nachname` varchar(50) NOT NULL,
  `email` varchar(100) DEFAULT NULL,
  `telefon` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `projekt_nummer`
--

CREATE TABLE `projekt_nummer` (
  `projekt_nummer_id` int(11) NOT NULL,
  `projekt_nummer` int(100) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `service_bereich`
--

CREATE TABLE `service_bereich` (
  `service_bereich_id` int(11) NOT NULL,
  `name` varchar(50) DEFAULT NULL,
  `beschreibung` varchar(500) DEFAULT NULL,
  `aktiv` tinyint(4) DEFAULT NULL COMMENT '"0" = nicht aktiver Bereich, sonst zeigt der Wert welcher Bereich "aktiv" ist (Projektnummer von Agentur f. Arbeit)'
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `status`
--

CREATE TABLE `status` (
  `status_id` int(11) NOT NULL,
  `status` enum('angenommen','in-bearbeitung','angelehnt','abgeschlossen') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Indizes der exportierten Tabellen
--

--
-- Indizes für die Tabelle `auftrag`
--
ALTER TABLE `auftrag`
  ADD PRIMARY KEY (`auftrag_id`),
  ADD KEY `fk_auftrag_bezirk` (`bezirk_id`),
  ADD KEY `fk_auftrag_mitarbeiter` (`mitarbeiter_id`),
  ADD KEY `fk_auftrag_service_bereich` (`service_bereich_id`),
  ADD KEY `fk_auftrag_status` (`status_id`);

--
-- Indizes für die Tabelle `bezirk`
--
ALTER TABLE `bezirk`
  ADD PRIMARY KEY (`bezirk_id`);

--
-- Indizes für die Tabelle `mitarbeiter`
--
ALTER TABLE `mitarbeiter`
  ADD PRIMARY KEY (`mitarbeiter_id`);

--
-- Indizes für die Tabelle `projekt_nummer`
--
ALTER TABLE `projekt_nummer`
  ADD PRIMARY KEY (`projekt_nummer_id`);

--
-- Indizes für die Tabelle `service_bereich`
--
ALTER TABLE `service_bereich`
  ADD PRIMARY KEY (`service_bereich_id`);

--
-- Indizes für die Tabelle `status`
--
ALTER TABLE `status`
  ADD PRIMARY KEY (`status_id`);

--
-- AUTO_INCREMENT für exportierte Tabellen
--

--
-- AUTO_INCREMENT für Tabelle `auftrag`
--
ALTER TABLE `auftrag`
  MODIFY `auftrag_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT für Tabelle `bezirk`
--
ALTER TABLE `bezirk`
  MODIFY `bezirk_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `mitarbeiter`
--
ALTER TABLE `mitarbeiter`
  MODIFY `mitarbeiter_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `projekt_nummer`
--
ALTER TABLE `projekt_nummer`
  MODIFY `projekt_nummer_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `service_bereich`
--
ALTER TABLE `service_bereich`
  MODIFY `service_bereich_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `status`
--
ALTER TABLE `status`
  MODIFY `status_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints der exportierten Tabellen
--

--
-- Constraints der Tabelle `auftrag`
--
ALTER TABLE `auftrag`
  ADD CONSTRAINT `fk_auftrag_bezirk` FOREIGN KEY (`bezirk_id`) REFERENCES `bezirk` (`bezirk_id`),
  ADD CONSTRAINT `fk_auftrag_mitarbeiter` FOREIGN KEY (`mitarbeiter_id`) REFERENCES `mitarbeiter` (`mitarbeiter_id`),
  ADD CONSTRAINT `fk_auftrag_service_bereich` FOREIGN KEY (`service_bereich_id`) REFERENCES `service_bereich` (`service_bereich_id`),
  ADD CONSTRAINT `fk_auftrag_status` FOREIGN KEY (`status_id`) REFERENCES `status` (`status_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
