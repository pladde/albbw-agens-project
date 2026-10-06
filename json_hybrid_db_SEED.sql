-- ============================================================
-- SEED: json_hybrid_db
-- Zweck:   Befüllt die Datenbank mit statischen Beispieldaten
--          (Stammdaten + Verknüpfungen + JSON-Aufträge)
--
-- Ausführen:  mysql -u root -p < json_hybrid_db_SEED.sql
--             (muss NACH json_hybrid_db_SCHEMA.sql ausgeführt werden)
-- ============================================================

USE `json_hybrid_db`;

-- ------------------------------------------------------------
-- Leeren der Tabellen (idempotent: erneutes Ausführen möglich)
-- Reihenfolge beachten: erst Kind-Tabellen, dann Eltern-Tabellen
--
-- WICHTIG: DELETE FROM statt TRUNCATE verwenden!
-- TRUNCATE ignoriert FOREIGN_KEY_CHECKS = 0 und schlägt bei
-- referenzierten Tabellen fehl (Fehler #1701 in phpMyAdmin).
-- DELETE FROM respektiert die Foreign-Key-Checks.
-- ------------------------------------------------------------
SET FOREIGN_KEY_CHECKS = 0;
DELETE FROM `auftrag`;
DELETE FROM `projekt_x_person`;
DELETE FROM `person`;
DELETE FROM `projekt`;
DELETE FROM `bezirk`;
DELETE FROM `rolle`;
SET FOREIGN_KEY_CHECKS = 1;

-- ============================================================
-- 1. Stammdaten: rolle
-- ============================================================
INSERT INTO `rolle` (`rolle_id`, `beschreibung`) VALUES
    (1, 'Administrator'),
    (2, 'Projektleiter'),
    (3, 'Mitarbeiter');

-- ============================================================
-- 2. Stammdaten: bezirk
-- ============================================================
INSERT INTO `bezirk` (`bezirk_id`, `name`, `kuerzel`) VALUES
    (1, 'Berlin (Gesamt)', 'BE'),
    (2, 'Mitte', 'Mitte'),
    (3, 'Friedrichshain-Kreuzberg', 'FrKr'),
    (4, 'Pankow', 'Pank'),
    (5, 'Charlottenburg-Wilmersdorf', 'ChWi'),
    (6, 'Spandau', 'Span'),
    (7, 'Steglitz-Zehlendorf', 'StZe'),
    (8, 'Tempelhof-Schöneberg', 'TeSch'),
    (9, 'Neukölln', 'Neuk'),
    (10, 'Treptow-Köpenick', 'TrKö'),
    (11, 'Marzahn-Hellersdorf', 'MaHe'),
    (12, 'Lichtenberg', 'Lich'),
    (13, 'Reinickendorf', 'Rein');


-- ============================================================
-- 3. Stammdaten: projekt
-- ============================================================
INSERT INTO `projekt` (`projekt_id`, `titel`, `beschreibung`, `aktiv`, `erstellt_am`) VALUES
    (1, 'Website Relaunch',   'Überarbeitung des Firmenauftritts',        1, '2026-08-01 10:00:00'),
    (2, 'App Entwicklung',    'Mobile App für iOS und Android',           1, '2026-08-15 14:30:00'),
    (3, 'Altsystem Wartung',  'Archivierung alter Datenbanken',           0, '2026-01-10 09:15:00');

-- ============================================================
-- 4. Stammdaten: person
-- ============================================================
INSERT INTO `person` (`person_id`, `r_id`, `name`, `vorname`, `email`, `telefon`, `aktiv`, `letzter_login`) VALUES
    (1, 1, 'Mustermann', 'Max',    'max.mustermann@example.com',   '+491701111111', 1, '2026-08-19 11:00:00'),
    (2, 2, 'Müller',     'Sabine', 'sabine.mueller@example.com',   '+491702222222', 1, '2026-08-18 16:45:00'),
    (3, 3, 'Schmidt',    'Jan',    'jan.schmidt@example.com',      '+491703333333', 1, '2026-08-17 08:30:00');

-- ============================================================
-- 5. Verknüpfungstabelle: projekt_x_person
-- ============================================================
INSERT INTO `projekt_x_person` (`x_id`, `projekt_id`, `person_id`) VALUES
    (1, 1, 1),  -- Max arbeitet an Website Relaunch
    (2, 1, 2),  -- Sabine arbeitet an Website Relaunch
    (3, 2, 2);  -- Sabine arbeitet auch an App Entwicklung

-- ============================================================
-- 6. Aufträge mit JSON-Daten (Hybrid-Modell)
-- ============================================================
INSERT INTO `auftrag` (`auftrag_id`, `daten`, `erstellt_am`, `p_id`, `bez_id`) VALUES
    (1, '{"prioritaet": "hoch", "budget": 5000, "notiz": "Erster Meilenstein"}',        '2026-08-19 11:15:00', 1, 1),
    (2, '{"prioritaet": "mittel", "budget": 12000, "notiz": "Kundenfreigabe ausstehend"}', '2026-08-19 11:20:00', 2, 2);