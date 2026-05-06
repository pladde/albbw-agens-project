



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
-- Tabellenstruktur für Tabelle `projekt`
--

CREATE TABLE `projekt` (
  `projekt_id` int(11) NOT NULL,
  `name` varchar(100) NOT NULL,
  `beschreibung` text DEFAULT NULL,
  `aktiv` tinyint(1) DEFAULT 1,
  `erstellt_am` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

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

-- --------------------------------------------------------

--
-- Tabellenstruktur für Tabelle `rolle`
--

CREATE TABLE `rolle` (
  `rolle_id` int(11) NOT NULL,
  `bezeichnung` varchar(50) NOT NULL
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

--
-- Tabellenstruktur für Tabelle `person_x_rolle`
--
    CREATE TABLE `person_x_rolle` (
        `x_id` int(11) NOT NULL,
        `person_id` int(11) NOT NULL,
        `rolle_id` int(11) NOT NULL
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;





--
-- Indizes für exportierte Tabellen
--

--
-- Indizes für Tabelle `auftrag`
--
ALTER TABLE `auftrag`
  ADD PRIMARY KEY (`auftrag_id`),
  ADD KEY `index_projekt_id` (`projekt_id`),
  ADD KEY `index_bearbeitet_von` (`bearbeitet_von`),
  ADD KEY `index_status` (`status`),
  ADD KEY `index_aufnahme_datum` (`aufnahme_datum`);

--
-- Indizes für Tabelle `person`
--
ALTER TABLE `person`
    ADD PRIMARY KEY (`person_id`),
    ADD UNIQUE KEY `index_unique_email` (`email`);

--
-- Indizes für Tabelle `projekt`
--
ALTER TABLE `projekt`
    ADD PRIMARY KEY (`projekt_id`),
    ADD KEY `index_aktiv` (`aktiv`);

--
-- Indizes für Tabelle `rolle`
--
ALTER TABLE `rolle`
    ADD PRIMARY KEY (`rolle_id`),
    ADD UNIQUE KEY `index_unique_bezeichnung` (`bezeichnung`);

--
-- Indizes für Tabelle `projekt_x_person`
--
ALTER TABLE `projekt_x_person`
    ADD PRIMARY KEY (`x_id`),
    ADD UNIQUE KEY `index_unique_person_in_projekt` (`projekt_id`, `person_id`);

--
-- Indizes für Tabelle `person_x_rolle`
--
ALTER TABLE `person_x_rolle`
    ADD PRIMARY KEY (`x_id`),
    ADD UNIQUE KEY `unique_person_rolle` (`person_id`, `rolle_id`);

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
-- AUTO_INCREMENT für Tabelle `rolle`
--
ALTER TABLE `rolle`
   MODIFY `rolle_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `projekt_x_person`
--
ALTER TABLE `projekt_x_person`
    MODIFY `x_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT für Tabelle `person_x_rolle`
--
ALTER TABLE `person_x_rolle`
    MODIFY `x_id` int(11) NOT NULL AUTO_INCREMENT;


--
-- Einschränkungen/Constraints für exportierte Tabellen
--

--
-- Constraints der Tabelle `auftrag`
--
ALTER TABLE `auftrag`
  ADD CONSTRAINT `auftrag_ibfk_1` FOREIGN KEY (`projekt_id`) REFERENCES `projekt` (`projekt_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints der Tabelle `projekt_x_person`
--
ALTER TABLE `projekt_x_person`
  ADD CONSTRAINT `projekt_x_person_ibfk_1` FOREIGN KEY (`projekt_id`) REFERENCES `projekt` (`projekt_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `projekt_x_person_ibfk_2` FOREIGN KEY (`person_id`) REFERENCES `person` (`person_id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Constraints der Tabelle `person_x_rolle`
--
ALTER TABLE `person_x_rolle`
  ADD CONSTRAINT `person_x_rolle_ibfk_1` FOREIGN KEY (`person_id`) REFERENCES `person` (`person_id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `person_x_rolle_ibfk_2` FOREIGN KEY (`rolle_id`) REFERENCES `rolle` (`rolle_id`) ON DELETE CASCADE ON UPDATE CASCADE;



--
-- Initialierung von Daten für Tabelle `projekt`
--

INSERT INTO `projekt` (`name`, `beschreibung`, `aktiv`, `erstellt_am`) VALUES
    ('Dienstleistung', 'Aufträge für Dienstleistungen mit QR-Codes und Bildern', 1, '2024-01-01 10:00:00'),
    ('Holzspielwaren', 'Aufträge für Holzspielwaren-Produktion', 1, '2024-01-01 10:00:00'),
    ('Spielwaren', 'Aufträge für Spielwaren-Reparatur', 1, '2024-01-01 10:00:00');

-- --------------------------------------------------------

--
-- Initialisierung von Daten für Tabelle `person`
--

INSERT INTO `person` (`vorname`, `nachname`, `email`) VALUES
    ('Max', 'Mustermann', 'max.mustermann@example.com'),
    ('Erika', 'Musterfrau', 'erika.musterfrau@example.com'),
    ('Anna', 'Musterfrau', 'anna.musterfrau@example.com'),
    ('Peter', 'Muster', 'peter.muster@example.com');

-- --------------------------------------------------------

--
-- Initialierung von Daten für Tabelle `rolle`
--

INSERT INTO `rolle` (`bezeichnung`) VALUES
    ('Mitarbeiter'),
    ('Bereichsleiter'),
    ('Administrator'),
    ('Praktikant');

-- --------------------------------------------------------

--
-- Initialisierung von Daten für Tabelle `projekt_x_person`
--

INSERT INTO `projekt_x_person` (`projekt_id`, `person_id`) VALUES
    (1, 1),
    (3, 2),
    (3, 3),
    (2, 4);

--
-- Initialisierung von Daten für Tabelle `person_x_rolle`
--
INSERT INTO `person_x_rolle` (`person_id`, `rolle_id`) VALUES
                                                           (1, 1),
                                                           (2, 2),
                                                           (3, 3),
                                                           (4, 1);









COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
