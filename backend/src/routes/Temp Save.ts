// import express from 'express';
// import { pool } from '../Datenbankverbindung';
//
// const router = express.Router();
//
// // GET - Alle Projekte abrufen
// router.get('/', async (req, res) => {
//     try {
//         const [rows] = await pool.query('SELECT * FROM projekt ORDER BY erstellt_am DESC');
//         res.json(rows);
//     } catch (error) {
//         console.error('Fehler beim Abrufen der Projekte:', error);
//         res.status(500).json({
//             status: 'error',
//             message: 'Fehler beim Abrufen der Projekte',
//             error: error instanceof Error ? error.message : 'Unbekannter Fehler'
//         });
//     }
// });
//
// // GET - Einzelnes Projekt abrufen
// router.get('/:id', async (req, res) => {
//     try {
//         const [rows]: any = await pool.query(
//             'SELECT * FROM projekt WHERE projekt_id = ?',
//             [req.params.id]
//         );
//         if (rows.length === 0) {
//             return res.status(404).json({
//                 status: 'error',
//                 message: 'Projekt nicht gefunden'
//             });
//         }
//         res.json(rows[0]);
//     } catch (error) {
//         console.error('Fehler beim Abrufen des Projekts:', error);
//         res.status(500).json({
//             status: 'error',
//             message: 'Fehler beim Abrufen des Projekts',
//             error: error instanceof Error ? error.message : 'Unbekannter Fehler'
//         });
//     }
// });
//
// // POST - Neues Projekt erstellen
// router.post('/', async (req, res) => {
//     try {
//         const { name, beschreibung, aktiv } = req.body;
//
//         if (!name) {
//             return res.status(400).json({
//                 status: 'error',
//                 message: 'Name ist erforderlich'
//             });
//         }
//
//         const [result]: any = await pool.query(
//             'INSERT INTO projekt (name, beschreibung, aktiv) VALUES (?, ?, ?)',
//             [name, beschreibung || null, aktiv !== undefined ? aktiv : 1]
//         );
//
//         res.status(201).json({
//             status: 'success',
//             message: 'Projekt erfolgreich erstellt',
//             data: {
//                 projekt_id: result.insertId,
//                 name,
//                 beschreibung,
//                 aktiv: aktiv !== undefined ? aktiv : 1
//             }
//         });
//     } catch (error) {
//         console.error('Fehler beim Erstellen des Projekts:', error);
//         res.status(500).json({
//             status: 'error',
//             message: 'Fehler beim Erstellen des Projekts',
//             error: error instanceof Error ? error.message : 'Unbekannter Fehler'
//         });
//     }
// });
//
// // PUT - Projekt aktualisieren
// router.put('/:id', async (req, res) => {
//     try {
//         const { name, beschreibung, aktiv } = req.body;
//
//         if (!name) {
//             return res.status(400).json({
//                 status: 'error',
//                 message: 'Name ist erforderlich'
//             });
//         }
//
//         const [result]: any = await pool.query(
//             'UPDATE projekt SET name = ?, beschreibung = ?, aktiv = ? WHERE projekt_id = ?',
//             [name, beschreibung || null, aktiv !== undefined ? aktiv : 1, req.params.id]
//         );
//
//         if (result.affectedRows === 0) {
//             return res.status(404).json({
//                 status: 'error',
//                 message: 'Projekt nicht gefunden'
//             });
//         }
//
//         res.json({
//             status: 'success',
//             message: 'Projekt erfolgreich aktualisiert',
//             data: {
//                 projekt_id: req.params.id,
//                 name,
//                 beschreibung,
//                 aktiv
//             }
//         });
//     } catch (error) {
//         console.error('Fehler beim Aktualisieren des Projekts:', error);
//         res.status(500).json({
//             status: 'error',
//             message: 'Fehler beim Aktualisieren des Projekts',
//             error: error instanceof Error ? error.message : 'Unbekannter Fehler'
//         });
//     }
// });
//
// // DELETE - Projekt löschen
// router.delete('/:id', async (req, res) => {
//     try {
//         const [result]: any = await pool.query(
//             'DELETE FROM projekt WHERE projekt_id = ?',
//             [req.params.id]
//         );
//
//         if (result.affectedRows === 0) {
//             return res.status(404).json({
//                 status: 'error',
//                 message: 'Projekt nicht gefunden'
//             });
//         }
//
//         res.json({
//             status: 'success',
//             message: 'Projekt erfolgreich gelöscht'
//         });
//     } catch (error) {
//         console.error('Fehler beim Löschen des Projekts:', error);
//         res.status(500).json({
//             status: 'error',
//             message: 'Fehler beim Löschen des Projekts',
//             error: error instanceof Error ? error.message : 'Unbekannter Fehler'
//         });
//     }
// });
//
// export default router;
//
//
//
//
//
//
//
//
//
// import express from 'express';
// import { pool } from '../Datenbankverbindung';
//
// const router = express.Router();
//
// // GET - Alle Personen abrufen
// router.get('/', async (req, res) => {
//     try {
//         const [rows] = await pool.query('SELECT * FROM person ORDER BY nachname, vorname');
//         res.json(rows);
//     } catch (error) {
//         console.error('Fehler beim Abrufen der Personen:', error);
//         res.status(500).json({
//             status: 'error',
//             message: 'Fehler beim Abrufen der Personen',
//             error: error instanceof Error ? error.message : 'Unbekannter Fehler'
//         });
//     }
// });
//
// // GET - Einzelne Person abrufen
// router.get('/:id', async (req, res) => {
//     try {
//         const [rows]: any = await pool.query(
//             'SELECT * FROM person WHERE person_id = ?',
//             [req.params.id]
//         );
//         if (rows.length === 0) {
//             return res.status(404).json({
//                 status: 'error',
//                 message: 'Person nicht gefunden'
//             });
//         }
//         res.json(rows[0]);
//     } catch (error) {
//         console.error('Fehler beim Abrufen der Person:', error);
//         res.status(500).json({
//             status: 'error',
//             message: 'Fehler beim Abrufen der Person',
//             error: error instanceof Error ? error.message : 'Unbekannter Fehler'
//         });
//     }
// });
//
// // POST - Neue Person erstellen
// router.post('/', async (req, res) => {
//     try {
//         const { vorname, nachname, email } = req.body;
//
//         if (!email) {
//             return res.status(400).json({
//                 status: 'error',
//                 message: 'E-Mail ist erforderlich'
//             });
//         }
//
//         const [result]: any = await pool.query(
//             'INSERT INTO person (vorname, nachname, email) VALUES (?, ?, ?)',
//             [vorname || null, nachname || null, email]
//         );
//
//         res.status(201).json({
//             status: 'success',
//             message: 'Person erfolgreich erstellt',
//             data: {
//                 person_id: result.insertId,
//                 vorname,
//                 nachname,
//                 email
//             }
//         });
//     } catch (error) {
//         console.error('Fehler beim Erstellen der Person:', error);
//         res.status(500).json({
//             status: 'error',
//             message: 'Fehler beim Erstellen der Person',
//             error: error instanceof Error ? error.message : 'Unbekannter Fehler'
//         });
//     }
// });
//
// // PUT - Person aktualisieren
// router.put('/:id', async (req, res) => {
//     try {
//         const { vorname, nachname, email } = req.body;
//
//         if (!email) {
//             return res.status(400).json({
//                 status: 'error',
//                 message: 'E-Mail ist erforderlich'
//             });
//         }
//
//         const [result]: any = await pool.query(
//             'UPDATE person SET vorname = ?, nachname = ?, email = ? WHERE person_id = ?',
//             [vorname || null, nachname || null, email, req.params.id]
//         );
//
//         if (result.affectedRows === 0) {
//             return res.status(404).json({
//                 status: 'error',
//                 message: 'Person nicht gefunden'
//             });
//         }
//
//         res.json({
//             status: 'success',
//             message: 'Person erfolgreich aktualisiert',
//             data: {
//                 person_id: req.params.id,
//                 vorname,
//                 nachname,
//                 email
//             }
//         });
//     } catch (error) {
//         console.error('Fehler beim Aktualisieren der Person:', error);
//         res.status(500).json({
//             status: 'error',
//             message: 'Fehler beim Aktualisieren der Person',
//             error: error instanceof Error ? error.message : 'Unbekannter Fehler'
//         });
//     }
// });
//
// // DELETE - Person löschen
// router.delete('/:id', async (req, res) => {
//     try {
//         const [result]: any = await pool.query(
//             'DELETE FROM person WHERE person_id = ?',
//             [req.params.id]
//         );
//
//         if (result.affectedRows === 0) {
//             return res.status(404).json({
//                 status: 'error',
//                 message: 'Person nicht gefunden'
//             });
//         }
//
//         res.json({
//             status: 'success',
//             message: 'Person erfolgreich gelöscht'
//         });
//     } catch (error) {
//         console.error('Fehler beim Löschen der Person:', error);
//         res.status(500).json({
//             status: 'error',
//             message: 'Fehler beim Löschen der Person',
//             error: error instanceof Error ? error.message : 'Unbekannter Fehler'
//         });
//     }
// });
//
// export default router;
//
//
//
//
//
//
//
//
//
//
// import express from 'express';
// import { pool } from '../Datenbankverbindung';
//
// const router = express.Router();
//
// // GET - Alle Rollen abrufen
// router.get('/', async (req, res) => {
//     try {
//         const [rows] = await pool.query('SELECT * FROM rolle ORDER BY bezeichnung');
//         res.json(rows);
//     } catch (error) {
//         console.error('Fehler beim Abrufen der Rollen:', error);
//         res.status(500).json({
//             status: 'error',
//             message: 'Fehler beim Abrufen der Rollen',
//             error: error instanceof Error ? error.message : 'Unbekannter Fehler'
//         });
//     }
// });
//
// // GET - Einzelne Rolle abrufen
// router.get('/:id', async (req, res) => {
//     try {
//         const [rows]: any = await pool.query(
//             'SELECT * FROM rolle WHERE rolle_id = ?',
//             [req.params.id]
//         );
//         if (rows.length === 0) {
//             return res.status(404).json({
//                 status: 'error',
//                 message: 'Rolle nicht gefunden'
//             });
//         }
//         res.json(rows[0]);
//     } catch (error) {
//         console.error('Fehler beim Abrufen der Rolle:', error);
//         res.status(500).json({
//             status: 'error',
//             message: 'Fehler beim Abrufen der Rolle',
//             error: error instanceof Error ? error.message : 'Unbekannter Fehler'
//         });
//     }
// });
//
// // POST - Neue Rolle erstellen
// router.post('/', async (req, res) => {
//     try {
//         const { bezeichnung } = req.body;
//
//         if (!bezeichnung) {
//             return res.status(400).json({
//                 status: 'error',
//                 message: 'Bezeichnung ist erforderlich'
//             });
//         }
//
//         const [result]: any = await pool.query(
//             'INSERT INTO rolle (bezeichnung) VALUES (?)',
//             [bezeichnung]
//         );
//
//         res.status(201).json({
//             status: 'success',
//             message: 'Rolle erfolgreich erstellt',
//             data: {
//                 rolle_id: result.insertId,
//                 bezeichnung
//             }
//         });
//     } catch (error) {
//         console.error('Fehler beim Erstellen der Rolle:', error);
//         res.status(500).json({
//             status: 'error',
//             message: 'Fehler beim Erstellen der Rolle',
//             error: error instanceof Error ? error.message : 'Unbekannter Fehler'
//         });
//     }
// });
//
// // PUT - Rolle aktualisieren
// router.put('/:id', async (req, res) => {
//     try {
//         const { bezeichnung } = req.body;
//
//         if (!bezeichnung) {
//             return res.status(400).json({
//                 status: 'error',
//                 message: 'Bezeichnung ist erforderlich'
//             });
//         }
//
//         const [result]: any = await pool.query(
//             'UPDATE rolle SET bezeichnung = ? WHERE rolle_id = ?',
//             [bezeichnung, req.params.id]
//         );
//
//         if (result.affectedRows === 0) {
//             return res.status(404).json({
//                 status: 'error',
//                 message: 'Rolle nicht gefunden'
//             });
//         }
//
//         res.json({
//             status: 'success',
//             message: 'Rolle erfolgreich aktualisiert',
//             data: {
//                 rolle_id: req.params.id,
//                 bezeichnung
//             }
//         });
//     } catch (error) {
//         console.error('Fehler beim Aktualisieren der Rolle:', error);
//         res.status(500).json({
//             status: 'error',
//             message: 'Fehler beim Aktualisieren der Rolle',
//             error: error instanceof Error ? error.message : 'Unbekannter Fehler'
//         });
//     }
// });
//
// // DELETE - Rolle löschen
// router.delete('/:id', async (req, res) => {
//     try {
//         const [result]: any = await pool.query(
//             'DELETE FROM rolle WHERE rolle_id = ?',
//             [req.params.id]
//         );
//
//         if (result.affectedRows === 0) {
//             return res.status(404).json({
//                 status: 'error',
//                 message: 'Rolle nicht gefunden'
//             });
//         }
//
//         res.json({
//             status: 'success',
//             message: 'Rolle erfolgreich gelöscht'
//         });
//     } catch (error) {
//         console.error('Fehler beim Löschen der Rolle:', error);
//         res.status(500).json({
//             status: 'error',
//             message: 'Fehler beim Löschen der Rolle',
//             error: error instanceof Error ? error.message : 'Unbekannter Fehler'
//         });
//     }
// });
//
// export default router;
//
//
//
//
//
//
//
//
//
//
// import express from 'express';
// import { pool } from '../Datenbankverbindung';
//
// const router = express.Router();
//
// // GET - Alle Aufträge abrufen
// router.get('/', async (req, res) => {
//     try {
//         const [rows] = await pool.query(`
//              SELECT a.*, p.name as projekt_name
//              FROM auftrag a
//              LEFT JOIN projekt p ON a.projekt_id = p.projekt_id
//              ORDER BY a.aufnahme_datum DESC
//          `);
//         res.json(rows);
//     } catch (error) {
//         console.error('Fehler beim Abrufen der Aufträge:', error);
//         res.status(500).json({
//             status: 'error',
//             message: 'Fehler beim Abrufen der Aufträge',
//             error: error instanceof Error ? error.message : 'Unbekannter Fehler'
//         });
//     }
// });
//
// // GET - Einzelnen Auftrag abrufen
// router.get('/:id', async (req, res) => {
//     try {
//         const [rows]: any = await pool.query(`
//              SELECT a.*, p.name as projekt_name
//              FROM auftrag a
//              LEFT JOIN projekt p ON a.projekt_id = p.projekt_id
//              WHERE a.auftrag_id = ?
//          `, [req.params.id]);
//
//         if (rows.length === 0) {
//             return res.status(404).json({
//                 status: 'error',
//                 message: 'Auftrag nicht gefunden'
//             });
//         }
//         res.json(rows[0]);
//     } catch (error) {
//         console.error('Fehler beim Abrufen des Auftrags:', error);
//         res.status(500).json({
//             status: 'error',
//             message: 'Fehler beim Abrufen des Auftrags',
//             error: error instanceof Error ? error.message : 'Unbekannter Fehler'
//         });
//     }
// });
//
// // GET - Aufträge nach Projekt abrufen
// router.get('/projekt/:projektId', async (req, res) => {
//     try {
//         const [rows] = await pool.query(`
//              SELECT a.*, p.name as projekt_name
//              FROM auftrag a
//              LEFT JOIN projekt p ON a.projekt_id = p.projekt_id
//              WHERE a.projekt_id = ?
//              ORDER BY a.aufnahme_datum DESC
//          `, [req.params.projektId]);
//
//         res.json(rows);
//     } catch (error) {
//         console.error('Fehler beim Abrufen der Aufträge:', error);
//         res.status(500).json({
//             status: 'error',
//             message: 'Fehler beim Abrufen der Aufträge',
//             error: error instanceof Error ? error.message : 'Unbekannter Fehler'
//         });
//     }
// });
//
// // POST - Neuen Auftrag erstellen
// router.post('/', async (req, res) => {
//     try {
//         const { projekt_id, bearbeitet_von, status, daten } = req.body;
//
//         if (!projekt_id || !bearbeitet_von) {
//             return res.status(400).json({
//                 status: 'error',
//                 message: 'Projekt-ID und Bearbeiter sind erforderlich'
//             });
//         }
//
//         // Validiere JSON-Daten falls vorhanden
//         let jsonDaten = null;
//         if (daten) {
//             try {
//                 jsonDaten = typeof daten === 'string' ? daten : JSON.stringify(daten);
//             } catch (e) {
//                 return res.status(400).json({
//                     status: 'error',
//                     message: 'Ungültiges JSON-Format für Daten'
//                 });
//             }
//         }
//
//         const [result]: any = await pool.query(
//             'INSERT INTO auftrag (projekt_id, bearbeitet_von, status, daten) VALUES (?, ?, ?, ?)',
//             [projekt_id, bearbeitet_von, status || 'offen', jsonDaten]
//         );
//
//         res.status(201).json({
//             status: 'success',
//             message: 'Auftrag erfolgreich erstellt',
//             data: {
//                 auftrag_id: result.insertId,
//                 projekt_id,
//                 bearbeitet_von,
//                 status: status || 'offen',
//                 daten: jsonDaten
//             }
//         });
//     } catch (error) {
//         console.error('Fehler beim Erstellen des Auftrags:', error);
//         res.status(500).json({
//             status: 'error',
//             message: 'Fehler beim Erstellen des Auftrags',
//             error: error instanceof Error ? error.message : 'Unbekannter Fehler'
//         });
//     }
// });
//
// // PUT - Auftrag aktualisieren
// router.put('/:id', async (req, res) => {
//     try {
//         const { projekt_id, bearbeitet_von, status, daten } = req.body;
//
//         if (!projekt_id || !bearbeitet_von) {
//             return res.status(400).json({
//                 status: 'error',
//                 message: 'Projekt-ID und Bearbeiter sind erforderlich'
//             });
//         }
//
//         // Validiere JSON-Daten falls vorhanden
//         let jsonDaten = null;
//         if (daten) {
//             try {
//                 jsonDaten = typeof daten === 'string' ? daten : JSON.stringify(daten);
//             } catch (e) {
//                 return res.status(400).json({
//                     status: 'error',
//                     message: 'Ungültiges JSON-Format für Daten'
//                 });
//             }
//         }
//
//         const [result]: any = await pool.query(
//             'UPDATE auftrag SET projekt_id = ?, bearbeitet_von = ?, status = ?, daten = ? WHERE auftrag_id = ?',
//             [projekt_id, bearbeitet_von, status || 'offen', jsonDaten, req.params.id]
//         );
//
//         if (result.affectedRows === 0) {
//             return res.status(404).json({
//                 status: 'error',
//                 message: 'Auftrag nicht gefunden'
//             });
//         }
//
//         res.json({
//             status: 'success',
//             message: 'Auftrag erfolgreich aktualisiert',
//             data: {
//                 auftrag_id: req.params.id,
//                 projekt_id,
//                 bearbeitet_von,
//                 status,
//                 daten: jsonDaten
//             }
//         });
//     } catch (error) {
//         console.error('Fehler beim Aktualisieren des Auftrags:', error);
//         res.status(500).json({
//             status: 'error',
//             message: 'Fehler beim Aktualisieren des Auftrags',
//             error: error instanceof Error ? error.message : 'Unbekannter Fehler'
//         });
//     }
// });
//
// // PATCH - Auftragsstatus aktualisieren
// router.patch('/:id/status', async (req, res) => {
//     try {
//         const { status } = req.body;
//
//         if (!status) {
//             return res.status(400).json({
//                 status: 'error',
//                 message: 'Status ist erforderlich'
//             });
//         }
//
//         const validStatuses = ['offen', 'in_bearbeitung', 'abgeschlossen', 'storniert'];
//         if (!validStatuses.includes(status)) {
//             return res.status(400).json({
//                 status: 'error',
//                 message: `Ungültiger Status. Erlaubt sind: ${validStatuses.join(', ')}`
//             });
//         }
//
//         const [result]: any = await pool.query(
//             'UPDATE auftrag SET status = ? WHERE auftrag_id = ?',
//             [status, req.params.id]
//         );
//
//         if (result.affectedRows === 0) {
//             return res.status(404).json({
//                 status: 'error',
//                 message: 'Auftrag nicht gefunden'
//             });
//         }
//
//         res.json({
//             status: 'success',
//             message: 'Status erfolgreich aktualisiert',
//             data: {
//                 auftrag_id: req.params.id,
//                 status
//             }
//         });
//     } catch (error) {
//         console.error('Fehler beim Aktualisieren des Status:', error);
//         res.status(500).json({
//             status: 'error',
//             message: 'Fehler beim Aktualisieren des Status',
//             error: error instanceof Error ? error.message : 'Unbekannter Fehler'
//         });
//     }
// });
//
// // DELETE - Auftrag löschen
// router.delete('/:id', async (req, res) => {
//     try {
//         const [result]: any = await pool.query(
//             'DELETE FROM auftrag WHERE auftrag_id = ?',
//             [req.params.id]
//         );
//
//         if (result.affectedRows === 0) {
//             return res.status(404).json({
//                 status: 'error',
//                 message: 'Auftrag nicht gefunden'
//             });
//         }
//
//         res.json({
//             status: 'success',
//             message: 'Auftrag erfolgreich gelöscht'
//         });
//     } catch (error) {
//         console.error('Fehler beim Löschen des Auftrags:', error);
//         res.status(500).json({
//             status: 'error',
//             message: 'Fehler beim Löschen des Auftrags',
//             error: error instanceof Error ? error.message : 'Unbekannter Fehler'
//         });
//     }
// });
//
// export default router;
//
//
//
//
//
// import express from 'express';
// import { pool } from '../Datenbankverbindung';
//
// const router = express.Router();
//
// // GET - Alle Personen eines Projekts abrufen
// router.get('/projekt/:projektId/personen', async (req, res) => {
//     try {
//         const [rows] = await pool.query(`
//              SELECT p.*, pp.x_id
//              FROM person p
//              INNER JOIN projekt_x_person pp ON p.person_id = pp.person_id
//              WHERE pp.projekt_id = ?
//              ORDER BY p.nachname, p.vorname
//          `, [req.params.projektId]);
//
//         res.json(rows);
//     } catch (error) {
//         console.error('Fehler beim Abrufen der Personen:', error);
//         res.status(500).json({
//             status: 'error',
//             message: 'Fehler beim Abrufen der Personen',
//             error: error instanceof Error ? error.message : 'Unbekannter Fehler'
//         });
//     }
// });
//
// // GET - Alle Projekte einer Person abrufen
// router.get('/person/:personId/projekte', async (req, res) => {
//     try {
//         const [rows] = await pool.query(`
//              SELECT pr.*, pp.x_id
//              FROM projekt pr
//              INNER JOIN projekt_x_person pp ON pr.projekt_id = pp.projekt_id
//              WHERE pp.person_id = ?
//              ORDER BY pr.erstellt_am DESC
//          `, [req.params.personId]);
//
//         res.json(rows);
//     } catch (error) {
//         console.error('Fehler beim Abrufen der Projekte:', error);
//         res.status(500).json({
//             status: 'error',
//             message: 'Fehler beim Abrufen der Projekte',
//             error: error instanceof Error ? error.message : 'Unbekannter Fehler'
//         });
//     }
// });
//
// // POST - Person zu Projekt zuordnen
// router.post('/', async (req, res) => {
//     try {
//         const { projekt_id, person_id } = req.body;
//
//         if (!projekt_id || !person_id) {
//             return res.status(400).json({
//                 status: 'error',
//                 message: 'Projekt-ID und Person-ID sind erforderlich'
//             });
//         }
//
//         // Prüfe ob Zuordnung bereits existiert
//         const [existing]: any = await pool.query(
//             'SELECT * FROM projekt_x_person WHERE projekt_id = ? AND person_id = ?',
//             [projekt_id, person_id]
//         );
//
//         if (existing.length > 0) {
//             return res.status(409).json({
//                 status: 'error',
//                 message: 'Diese Zuordnung existiert bereits'
//             });
//         }
//
//         const [result]: any = await pool.query(
//             'INSERT INTO projekt_x_person (projekt_id, person_id) VALUES (?, ?)',
//             [projekt_id, person_id]
//         );
//
//         res.status(201).json({
//             status: 'success',
//             message: 'Person erfolgreich dem Projekt zugeordnet',
//             data: {
//                 x_id: result.insertId,
//                 projekt_id,
//                 person_id
//             }
//         });
//     } catch (error) {
//         console.error('Fehler beim Zuordnen:', error);
//         res.status(500).json({
//             status: 'error',
//             message: 'Fehler beim Zuordnen der Person zum Projekt',
//             error: error instanceof Error ? error.message : 'Unbekannter Fehler'
//         });
//     }
// });
//
// // DELETE - Zuordnung löschen
// router.delete('/:id', async (req, res) => {
//     try {
//         const [result]: any = await pool.query(
//             'DELETE FROM projekt_x_person WHERE x_id = ?',
//             [req.params.id]
//         );
//
//         if (result.affectedRows === 0) {
//             return res.status(404).json({
//                 status: 'error',
//                 message: 'Zuordnung nicht gefunden'
//             });
//         }
//
//         res.json({
//             status: 'success',
//             message: 'Zuordnung erfolgreich gelöscht'
//         });
//     } catch (error) {
//         console.error('Fehler beim Löschen der Zuordnung:', error);
//         res.status(500).json({
//             status: 'error',
//             message: 'Fehler beim Löschen der Zuordnung',
//             error: error instanceof Error ? error.message : 'Unbekannter Fehler'
//         });
//     }
// });
//
// // DELETE - Zuordnung nach Projekt und Person löschen
// router.delete('/projekt/:projektId/person/:personId', async (req, res) => {
//     try {
//         const [result]: any = await pool.query(
//             'DELETE FROM projekt_x_person WHERE projekt_id = ? AND person_id = ?',
//             [req.params.projektId, req.params.personId]
//         );
//
//         if (result.affectedRows === 0) {
//             return res.status(404).json({
//                 status: 'error',
//                 message: 'Zuordnung nicht gefunden'
//             });
//         }
//
//         res.json({
//             status: 'success',
//             message: 'Zuordnung erfolgreich gelöscht'
//         });
//     } catch (error) {
//         console.error('Fehler beim Löschen der Zuordnung:', error);
//         res.status(500).json({
//             status: 'error',
//             message: 'Fehler beim Löschen der Zuordnung',
//             error: error instanceof Error ? error.message : 'Unbekannter Fehler'
//         });
//     }
// });
//
// export default router;
//
//
//
//
//
//
//
//
//
//
//
// import express from 'express';
// import { pool } from '../Datenbankverbindung';
//
// const router = express.Router();
//
// // GET - Alle Rollen einer Person abrufen
// router.get('/person/:personId/rollen', async (req, res) => {
//     try {
//         const [rows] = await pool.query(`
//              SELECT r.*, pr.x_id
//              FROM rolle r
//              INNER JOIN person_x_rolle pr ON r.rolle_id = pr.rolle_id
//              WHERE pr.person_id = ?
//              ORDER BY r.bezeichnung
//          `, [req.params.personId]);
//
//         res.json(rows);
//     } catch (error) {
//         console.error('Fehler beim Abrufen der Rollen:', error);
//         res.status(500).json({
//             status: 'error',
//             message: 'Fehler beim Abrufen der Rollen',
//             error: error instanceof Error ? error.message : 'Unbekannter Fehler'
//         });
//     }
// });
//
// // GET - Alle Personen mit einer bestimmten Rolle abrufen
// router.get('/rolle/:rolleId/personen', async (req, res) => {
//     try {
//         const [rows] = await pool.query(`
//              SELECT p.*, pr.x_id
//              FROM person p
//              INNER JOIN person_x_rolle pr ON p.person_id = pr.person_id
//              WHERE pr.rolle_id = ?
//              ORDER BY p.nachname, p.vorname
//          `, [req.params.rolleId]);
//
//         res.json(rows);
//     } catch (error) {
//         console.error('Fehler beim Abrufen der Personen:', error);
//         res.status(500).json({
//             status: 'error',
//             message: 'Fehler beim Abrufen der Personen',
//             error: error instanceof Error ? error.message : 'Unbekannter Fehler'
//         });
//     }
// });
//
// // POST - Rolle zu Person zuordnen
// router.post('/', async (req, res) => {
//     try {
//         const { person_id, rolle_id } = req.body;
//
//         if (!person_id || !rolle_id) {
//             return res.status(400).json({
//                 status: 'error',
//                 message: 'Person-ID und Rolle-ID sind erforderlich'
//             });
//         }
//
//         // Prüfe ob Zuordnung bereits existiert
//         const [existing]: any = await pool.query(
//             'SELECT * FROM person_x_rolle WHERE person_id = ? AND rolle_id = ?',
//             [person_id, rolle_id]
//         );
//
//         if (existing.length > 0) {
//             return res.status(409).json({
//                 status: 'error',
//                 message: 'Diese Zuordnung existiert bereits'
//             });
//         }
//
//         const [result]: any = await pool.query(
//             'INSERT INTO person_x_rolle (person_id, rolle_id) VALUES (?, ?)',
//             [person_id, rolle_id]
//         );
//
//         res.status(201).json({
//             status: 'success',
//             message: 'Rolle erfolgreich der Person zugeordnet',
//             data: {
//                 x_id: result.insertId,
//                 person_id,
//                 rolle_id
//             }
//         });
//     } catch (error) {
//         console.error('Fehler beim Zuordnen:', error);
//         res.status(500).json({
//             status: 'error',
//             message: 'Fehler beim Zuordnen der Rolle zur Person',
//             error: error instanceof Error ? error.message : 'Unbekannter Fehler'
//         });
//     }
// });
//
// // DELETE - Zuordnung löschen
// router.delete('/:id', async (req, res) => {
//     try {
//         const [result]: any = await pool.query(
//             'DELETE FROM person_x_rolle WHERE x_id = ?',
//             [req.params.id]
//         );
//
//         if (result.affectedRows === 0) {
//             return res.status(404).json({
//                 status: 'error',
//                 message: 'Zuordnung nicht gefunden'
//             });
//         }
//
//         res.json({
//             status: 'success',
//             message: 'Zuordnung erfolgreich gelöscht'
//         });
//     } catch (error) {
//         console.error('Fehler beim Löschen der Zuordnung:', error);
//         res.status(500).json({
//             status: 'error',
//             message: 'Fehler beim Löschen der Zuordnung',
//             error: error instanceof Error ? error.message : 'Unbekannter Fehler'
//         });
//     }
// });
//
// // DELETE - Zuordnung nach Person und Rolle löschen
// router.delete('/person/:personId/rolle/:rolleId', async (req, res) => {
//     try {
//         const [result]: any = await pool.query(
//             'DELETE FROM person_x_rolle WHERE person_id = ? AND rolle_id = ?',
//             [req.params.personId, req.params.rolleId]
//         );
//
//         if (result.affectedRows === 0) {
//             return res.status(404).json({
//                 status: 'error',
//                 message: 'Zuordnung nicht gefunden'
//             });
//         }
//
//         res.json({
//             status: 'success',
//             message: 'Zuordnung erfolgreich gelöscht'
//         });
//     } catch (error) {
//         console.error('Fehler beim Löschen der Zuordnung:', error);
//         res.status(500).json({
//             status: 'error',
//             message: 'Fehler beim Löschen der Zuordnung',
//             error: error instanceof Error ? error.message : 'Unbekannter Fehler'
//         });
//     }
// });
//
//
//
//
//
//
//
//
//
// import cors from 'cors';
// import {pool} from "../Datenbankverbindung";
//
// // Import Routes
// import projektRoutes from './projektRoutes';
// import personRoutes from './routes/personRoutes';
// import rolleRoutes from './routes/rolleRoutes';
// import auftragRoutes from './routes/auftragRoutes';
// import projektPersonRoutes from './routes/projektPersonRoutes';
// import personRolleRoutes from './routes/personRolleRoutes';
//
// dotenv.config();
//
// const app = express();
// [ 3 lines hidden ]
// app.use(cors());
// app.use(express.json());
//
// // API Routes
// app.use('/api/projekte', projektRoutes);
// app.use('/api/personen', personRoutes);
// app.use('/api/rollen', rolleRoutes);
// app.use('/api/auftraege', auftragRoutes);
// app.use('/api/projekt-person', projektPersonRoutes);
// app.use('/api/person-rolle', personRolleRoutes);
//
// // Health Check Endpunkt
//
// export default router;
//
//
//
//
//
//
//
//
//
//
//
//
//
// host: process.env.DB_HOST || 'localhost',
//     user: process.env.DB_USER || 'root',
//     password: process.env.DB_PASSWORD || '',
//     database: process.env.DB_DATABASE || 'json_hybrid_db',
//     database: process.env.DB_NAME || 'json_hybrid_db',
//     waitForConnections: true,
//     connectionLimit: 10,
//     queueLimit: 0
//
//
//



/*



## 📋 Zusätzliche Routen für Aufträge

### GET – Weitere Abfragen

1. `GET /auftraege/status/:status` – Alle Aufträge mit einem bestimmten Status abrufen (z.B. `/offen`, `/in_bearbeitung`)
2. `GET /auftraege/nachname/:nachname` – Aufträge nach Bearbeiter-Nachname suchen (Teilsuche mit `LIKE`)
3. `GET /auftraege/datum/zwischen?von=YYYY-MM-DD&bis=YYYY-MM-DD` – Aufträge in einem Zeitraum (Aufnahmedatum) abrufen
4. `GET /auftraege/suche?q=suchbegriff` – Volltextsuche über Name/Beschreibung
5. `GET /auftraege/anzahl` – Anzahl aller Aufträge (für Dashboard/Statistik)
6. `GET /auftraege/anzahl/status` – Anzahl pro Status (z.B. offen: 5, in_bearbeitung: 3)
7. `GET /auftraege/statistik` – Statistiken: Ø Bearbeitungszeit, Aufträge pro Monat, etc.
8. `GET /auftraege/neueste/:limit` – Die neuesten X Aufträge (z.B. `/neueste/5`)
9. `GET /auftraege/person/:personId` – Aufträge, die einer bestimmten Person zugeordnet sind
10. `GET /auftraege/:id/verlauf` – Änderungshistorie eines einzelnen Auftrags
11. `GET /auftraege/:id/qr-code` – QR-Code-Bild/Pfad eines Auftrags abrufen
12. `GET /auftraege/:id/bild` – Bild eines Auftrags abrufen
13. `GET /auftraege/export` – Alle Aufträge als CSV/Excel exportieren
14. `GET /auftraege/pagination?seite=1&limit=10` – Pagination für große Listen

### POST – Weitere Anlegen-Operationen

1. `POST /auftraege/bulk` – Mehrere Aufträge auf einmal anlegen (Array im Body)
2. `POST /auftraege/:id/qr-code` – QR-Code für einen Auftrag generieren und Speicherpfad setzen
3. `POST /auftraege/:id/bild` – Bild (Base64 oder Multipart) hochladen und Pfad speichern
4. `POST /auftraege/:id/kommentar` – Kommentar/Notiz zu einem Auftrag hinzufügen
5. `POST /auftraege/:id/zuweisen` – Auftrag einer Person/Projekt zuweisen
6. `POST /auftraege/:id/kopieren` – Auftrag duplizieren (neuer Auftrag mit gleichen Daten)

### PUT – Weitere Aktualisierungen

1. `PUT /auftraege/:id/daten` – Nur die JSON-Daten (`daten`) eines Auftrags ersetzen
2. `PUT /auftraege/:id/bearbeiter` – Nur den Bearbeiter ändern
3. `PUT /auftraege/:id/bild` – Bild ersetzen/aktualisieren
4. `PUT /auftraege/:id/qr-code` – QR-Code-Pfad aktualisieren (falls neu generiert)

### PATCH – Weitere Teil-Aktualisierungen

1. `PATCH /auftraege/:id/name` – Nur Name/Beschreibung aktualisieren
2. `PATCH /auftraege/:id/bearbeiter` – Nur Bearbeiter aktualisieren
3. `PATCH /auftraege/:id/aufnahme-datum` – Aufnahmedatum nachträglich ändern
4. `PATCH /auftraege/:id` – Generisches Teil-Update: Nur übergebene Felder aktualisieren (z.B. nur `{ "sonstiges": "neu" }`)
5. `PATCH /auftraege/:id/sonstiges` – Nur das Feld `sonstiges` aktualisieren

*Hinweis: `PATCH /auftraege/:id/status` existiert bereits.*

### DELETE – Weitere Lösch-Operationen

1. `DELETE /auftraege/:id/kommentar/:kommentarId` – Einzelnen Kommentar löschen
2. `DELETE /auftraege/:id/bild` – Bild eines Auftrags löschen
3. `DELETE /auftraege/:id/qr-code` – QR-Code eines Auftrags löschen
4. `DELETE /auftraege/bulk` – Mehrere Aufträge auf einmal löschen (IDs im Body: `{ "ids": [1,2,3] }`)
5. `DELETE /auftraege/projekt/:projektId` – Alle Aufträge eines Projekts löschen
6. `DELETE /auftraege/status/:status` – Alle Aufträge mit bestimmtem Status löschen (Vorsicht!)

### Zusätzliche sinnvolle Routen-Muster

1. `HEAD /auftraege/:id` – Prüfen ob ein Auftrag existiert (ohne Body)
2. `GET /auftraege/:id/existiert` – Boolean zurückgeben: `{ "existiert": true }`
3. `GET /auftraege/naechste-id` – Nächste verfügbare Auftrags-ID abrufen (für Neuanlage im Frontend)

---

### Besonders empfehlenswert für dein Projekt:

    - __`GET /auftraege/status/:status`__ – Sehr nützlich für Filteransichten im Frontend
- __`GET /auftraege/suche?q=...`__ – Wichtig für die Suchseite (`DienstleistungSuchenPage.tsx`)
- __`GET /auftraege/pagination?seite=1&limit=10`__ – Wichtig bei großen Datenmengen
- __`PATCH /auftraege/:id`__ – Generisches Teil-Update, flexibler als der bestehende Status-PATCH
- __`DELETE /auftraege/bulk`__ – Praktisch für Massenverwaltung



 */