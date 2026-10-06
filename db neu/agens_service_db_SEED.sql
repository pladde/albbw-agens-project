USE `agens_service`;

-- 1. Status-Werte einfügen (Muss exakt den ENUM-Werten entsprechen)
INSERT INTO `status` (`status_id`, `status`) VALUES
(1, 'angenommen'),
(2, 'in-bearbeitung'),
(3, 'angelehnt'),
(4, 'abgeschlossen');

-- 2. Bezirke einfügen
INSERT INTO `bezirk` (`bezirk_id`, `name`, `kürzel`) VALUES
(1, 'Mitte', 'MIT'),
(2, 'Friedrichshain-Kreuzberg', 'XBERG'),
(3, 'Pankow', 'PNKW');

-- 3. Mitarbeiter einfügen (Handwerker und Bürokräfte)
INSERT INTO `mitarbeiter` (`mitarbeiter_id`, `vorname`, `nachname`, `email`, `telefon`) VALUES
(1, 'Walter', 'Schreiner', 'w.schreiner@agens-service.de', '030-1234561'),
(2, 'Anna', 'Kopie', 'a.kopie@agens-service.de', '030-1234562'),
(3, 'Hans', 'Hobel', 'h.hobel@agens-service.de', '030-1234563');

-- 4. Service-Bereiche einfügen
-- Der Wert in `aktiv` entspricht dem Bit-Wert (1, 2, 4, 8) der Projektnummer-Logik:
--   Bit 0 (Wert 1) = Holzwerkstatt
--   Bit 1 (Wert 2) = Fahrradwerkstatt
--   Bit 2 (Wert 4) = Textilwerkstatt
--   Bit 3 (Wert 8) = Bürodienstleistungen
INSERT INTO `service_bereich` (`service_bereich_id`, `name`, `beschreibung`, `aktiv`) VALUES
(1, 'Holzwerkstatt', 'Reparatur und Aufarbeitung von Holzmöbeln, Verleimung und Oberflächenbehandlung.', 1),
(2, 'Fahrradwerkstatt', 'Reparatur und Wartung von Fahrrädern, Austausch von Verschleißteilen.', 2),
(3, 'Textilwerkstatt', 'Näharbeiten, Änderungsschneiderei und Reparatur von Textilien.', 4),
(4, 'Bürodienstleistungen', 'Datenerfassung, Digitalisierung, Briefkuvertierung und Schreibarbeiten.', 8);

-- 5. Projekt-Nummern einfügen
INSERT INTO `projekt_nummer` (`projekt_nummer`) 
VALUES 
  (100023),
  (100024),
  (200540),
  (300912),
  (450122);

-- 6. Beispiel-Aufträge einfügen
INSERT INTO `auftrag` (`service_bereich_id`, `bezirk_id`, `mitarbeiter_id`, `status_id`, `titel`, `beschreibung`, `erstellt_am`, `abgeschlossen_am`) VALUES
-- Aufträge für Bereich 1: Holzwerkstatt
(1, 1, 1, 2, 'Küchenstuhl verleimen', 'Ein hölzerner Küchenstuhl wackelt stark an den hinteren Beinen. Muss neu verleimt werden.', '2026-09-20 09:00:00', NULL),
(1, 2, 3, 4, 'Kommode abschleifen', 'Alte Weichholzkommode von Lackresten befreien und neu ölen.', '2026-09-15 10:30:00', '2026-09-21 14:00:00'),

-- Aufträge für Bereich 4: Bürodienstleistungen
(4, 2, 2, 1, 'Flyer kuvertieren', '500 Infobriefe falten, in Umschläge stecken und für den Postversand sortieren.', '2026-09-21 11:15:00', NULL),
(4, 3, 2, 2, 'Belege digitalisieren', 'Ordner mit Quittungen aus dem Jahr 2025 einscannen und als PDF verschlagworten.', '2026-09-18 08:45:00', NULL);