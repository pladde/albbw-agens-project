/* 
*   Fügt zwei Mitarbeiter hinzu.
*/

INSERT INTO mitarbeiter (vorname, nachname)
VALUES ("Max", "Mustermann"),
("Maria", "Musterfrau");

/* TODO:
*   Fügt Fahrräder hinzu
*/  

INSERT INTO farbe (farbe) 
VALUES ("grün"), ("weiß");

INSERT INTO marke (marke) 
VALUES ("Bianchi"), ("Canyon");

INSERT INTO fahrrad_eigenschaft (farbe_id, marke_id) 
VALUES (1, 1), (2, 2);

INSERT INTO fahrrad (fahrrad_eigenschaft, rahmennummer, erfasst_von, bearbeitungsstatus_id) 
VALUES (1, "B-0815", 1, 1),
       (2, "12345-67890", 2, 3);