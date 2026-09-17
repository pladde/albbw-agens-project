/*
* Diese Datei ist der ausführbare SQL-Script, um die Datenbank anzulegen.
* HINWEIS: Enthält noch keine Beziehungen zu Kunden oder Mitarbeiter - TODO:
*/

CREATE TABLE farbe (
    farbe_id INT UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
	farbe VARCHAR(100)
);

CREATE TABLE marke (
    marke_id INT UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
	marke VARCHAR(100)
);

CREATE TABLE fahrrad_eigenschaft (
    fahrrad_eigenschaft_id INT UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
    farbe_id INT UNSIGNED,
	marke_id INT UNSIGNED,

	CONSTRAINT fk_farbe
	FOREIGN KEY (farbe_id)
	REFERENCES farbe(farbe_id),
    
    CONSTRAINT fk_marke
	FOREIGN KEY (marke_id)
	REFERENCES marke(marke_id)
);

CREATE TABLE fahrrad (
	fahrrad_id INT UNSIGNED NOT NULL PRIMARY KEY AUTO_INCREMENT,
	fahrrad_eigenschaft INT UNSIGNED,
	rahmennummer VARCHAR(100),
	erfasst_am DATETIME NOT NULL,
	erfasst_von INT UNSIGNED NOT NULL,
	ausgang_am DATETIME,
	ausgegeben_an INT UNSIGNED,
    bearbeitungsstatus ENUM('angenommen', 'verschrottet', 'in Bearbeitung', 'verfügbar', 'herausgegeben') NOT NULL DEFAULT 'angenommen',

	CONSTRAINT fk_eigenschaft
	FOREIGN KEY (fahrrad_eigenschaft)
	REFERENCES fahrrad_eigenschaft(fahrrad_eigenschaft_id)
)