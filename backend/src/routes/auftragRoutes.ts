import express from 'express';
import { pool } from '../Datenbankverbindung.ts';

const router = express.Router();

// Route für:
// GET:
// Alle Aufträge abrufen
// Einen spezifischen Auftrag abrufen
// Alle Aufträge nach Bezirk abrufen
//
// POST
// Einen neuen Auftrag speichern
//
// PUT
// Einen Auftrag aktualisieren
//
// DELETE
// Einen Auftrag nach ID Löschen

// GET - Alle Aufträge abrufen (mit Bezirk-Name, Mitarbeiter-Name, Service-Bereich-Name und Status via JOIN)
router.get('/', async (_req, res) => {
    try {
        const [rows] = await pool.query(
            `SELECT a.*, 
                    b.name as bezirk_name, 
                    m.vorname as mitarbeiter_vorname, 
                    m.nachname as mitarbeiter_nachname,
                    sb.name as service_bereich_name,
                    s.status as status_name
             FROM auftrag a
             LEFT JOIN bezirk b ON a.bezirk_id = b.bezirk_id
             LEFT JOIN mitarbeiter m ON a.mitarbeiter_id = m.mitarbeiter_id
             LEFT JOIN service_bereich sb ON a.service_bereich_id = sb.service_bereich_id
             LEFT JOIN status s ON a.status_id = s.status_id
             ORDER BY a.erstellt_am DESC`
        );
        res.json(rows);
    } catch (error) {
        console.error('Fehler beim Abrufen der Aufträge:', error);
        res.status(500).json({
            status: 'error',
            message: 'Fehler beim Abrufen der Aufträge',
            error: error instanceof Error ? error.message : 'Unbekannter Fehler'
        });
    }
});

// GET - Aufträge nach Bezirk abrufen
router.get('/bezirk/:bezirkId', async (req, res) => {
    try {
        const [rows] = await pool.query(
            `SELECT a.*, 
                    b.name as bezirk_name, 
                    m.vorname as mitarbeiter_vorname, 
                    m.nachname as mitarbeiter_nachname,
                    sb.name as service_bereich_name,
                    s.status as status_name
             FROM auftrag a
             LEFT JOIN bezirk b ON a.bezirk_id = b.bezirk_id
             LEFT JOIN mitarbeiter m ON a.mitarbeiter_id = m.mitarbeiter_id
             LEFT JOIN service_bereich sb ON a.service_bereich_id = sb.service_bereich_id
             LEFT JOIN status s ON a.status_id = s.status_id
             WHERE a.bezirk_id = ?
             ORDER BY a.erstellt_am DESC`,
            [req.params.bezirkId]
        );

        res.json(rows);
    } catch (error) {
        console.error('Fehler beim Abrufen der Aufträge:', error);
        res.status(500).json({
            status: 'error',
            message: 'Fehler beim Abrufen der Aufträge',
            error: error instanceof Error ? error.message : 'Unbekannter Fehler'
        });
    }
});

// GET - Aufträge nach Service-Bereich abrufen
router.get('/service-bereich/:serviceBereichId', async (req, res) => {
    try {
        const [rows] = await pool.query(
            `SELECT a.*, 
                    b.name as bezirk_name, 
                    m.vorname as mitarbeiter_vorname, 
                    m.nachname as mitarbeiter_nachname,
                    sb.name as service_bereich_name,
                    s.status as status_name
             FROM auftrag a
             LEFT JOIN bezirk b ON a.bezirk_id = b.bezirk_id
             LEFT JOIN mitarbeiter m ON a.mitarbeiter_id = m.mitarbeiter_id
             LEFT JOIN service_bereich sb ON a.service_bereich_id = sb.service_bereich_id
             LEFT JOIN status s ON a.status_id = s.status_id
             WHERE a.service_bereich_id = ?
             ORDER BY a.erstellt_am DESC`,
            [req.params.serviceBereichId]
        );

        res.json(rows);
    } catch (error) {
        console.error('Fehler beim Abrufen der Aufträge:', error);
        res.status(500).json({
            status: 'error',
            message: 'Fehler beim Abrufen der Aufträge',
            error: error instanceof Error ? error.message : 'Unbekannter Fehler'
        });
    }
});

// GET - Aufträge nach Status abrufen
router.get('/status/:statusId', async (req, res) => {
    try {
        const [rows] = await pool.query(
            `SELECT a.*, 
                    b.name as bezirk_name, 
                    m.vorname as mitarbeiter_vorname, 
                    m.nachname as mitarbeiter_nachname,
                    sb.name as service_bereich_name,
                    s.status as status_name
             FROM auftrag a
             LEFT JOIN bezirk b ON a.bezirk_id = b.bezirk_id
             LEFT JOIN mitarbeiter m ON a.mitarbeiter_id = m.mitarbeiter_id
             LEFT JOIN service_bereich sb ON a.service_bereich_id = sb.service_bereich_id
             LEFT JOIN status s ON a.status_id = s.status_id
             WHERE a.status_id = ?
             ORDER BY a.erstellt_am DESC`,
            [req.params.statusId]
        );

        res.json(rows);
    } catch (error) {
        console.error('Fehler beim Abrufen der Aufträge:', error);
        res.status(500).json({
            status: 'error',
            message: 'Fehler beim Abrufen der Aufträge',
            error: error instanceof Error ? error.message : 'Unbekannter Fehler'
        });
    }
});

// GET - Einzelnen Auftrag abrufen (mit Bezirk-Name, Mitarbeiter-Name, Service-Bereich-Name und Status)
router.get('/:id', async (req, res) => {
    try {
        const [rows]: any = await pool.query(
            `SELECT a.*, 
                    b.name as bezirk_name, 
                    m.vorname as mitarbeiter_vorname, 
                    m.nachname as mitarbeiter_nachname,
                    sb.name as service_bereich_name,
                    s.status as status_name
             FROM auftrag a
             LEFT JOIN bezirk b ON a.bezirk_id = b.bezirk_id
             LEFT JOIN mitarbeiter m ON a.mitarbeiter_id = m.mitarbeiter_id
             LEFT JOIN service_bereich sb ON a.service_bereich_id = sb.service_bereich_id
             LEFT JOIN status s ON a.status_id = s.status_id
             WHERE a.auftrag_id = ?`,
            [req.params.id]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                status: 'error',
                message: 'Auftrag nicht gefunden'
            });
        }
        res.json(rows[0]);
    } catch (error) {
        console.error('Fehler beim Abrufen des Auftrags:', error);
        res.status(500).json({
            status: 'error',
            message: 'Fehler beim Abrufen des Auftrags',
            error: error instanceof Error ? error.message : 'Unbekannter Fehler'
        });
    }
});

// POST - Neuen Auftrag erstellen
router.post('/', async (req, res) => {
    try {
        const { service_bereich_id, bezirk_id, mitarbeiter_id, status_id, titel, beschreibung, erstellt_am, abgeschlossen_am } = req.body;

        // Validierung: Pflichtfelder prüfen
        if (!service_bereich_id || !bezirk_id || !mitarbeiter_id || !status_id || !titel) {
            return res.status(400).json({
                status: 'error',
                message: 'Service-Bereich-ID, Bezirk-ID, Mitarbeiter-ID, Status-ID und Titel sind erforderlich'
            });
        }

        // Validierung: Prüfe ob Service-Bereich existiert (Fremdschlüssel-Validierung)
        const [serviceBereichExists]: any = await pool.query(
            'SELECT service_bereich_id FROM service_bereich WHERE service_bereich_id = ?',
            [service_bereich_id]
        );

        if (serviceBereichExists.length === 0) {
            return res.status(404).json({
                status: 'error',
                message: 'Service-Bereich mit dieser ID existiert nicht'
            });
        }

        // Validierung: Prüfe ob Bezirk existiert (Fremdschlüssel-Validierung)
        const [bezirkExists]: any = await pool.query(
            'SELECT bezirk_id FROM bezirk WHERE bezirk_id = ?',
            [bezirk_id]
        );

        if (bezirkExists.length === 0) {
            return res.status(404).json({
                status: 'error',
                message: 'Bezirk mit dieser ID existiert nicht'
            });
        }

        // Validierung: Prüfe ob Mitarbeiter existiert (Fremdschlüssel-Validierung)
        const [mitarbeiterExists]: any = await pool.query(
            'SELECT mitarbeiter_id FROM mitarbeiter WHERE mitarbeiter_id = ?',
            [mitarbeiter_id]
        );

        if (mitarbeiterExists.length === 0) {
            return res.status(404).json({
                status: 'error',
                message: 'Mitarbeiter mit dieser ID existiert nicht'
            });
        }

        // Validierung: Prüfe ob Status existiert (Fremdschlüssel-Validierung)
        const [statusExists]: any = await pool.query(
            'SELECT status_id FROM status WHERE status_id = ?',
            [status_id]
        );

        if (statusExists.length === 0) {
            return res.status(404).json({
                status: 'error',
                message: 'Status mit dieser ID existiert nicht'
            });
        }

        // Auftrag erstellen
        const [result]: any = await pool.query(
            'INSERT INTO auftrag (service_bereich_id, bezirk_id, mitarbeiter_id, status_id, titel, beschreibung, erstellt_am, abgeschlossen_am) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
            [
                service_bereich_id,
                bezirk_id,
                mitarbeiter_id,
                status_id,
                titel,
                beschreibung || null,
                erstellt_am || new Date(),
                abgeschlossen_am || null
            ]
        );

        res.status(201).json({
            status: 'success',
            message: 'Auftrag erfolgreich erstellt',
            data: {
                auftrag_id: result.insertId,
                service_bereich_id,
                bezirk_id,
                mitarbeiter_id,
                status_id,
                titel,
                beschreibung: beschreibung || null,
                erstellt_am: erstellt_am || new Date(),
                abgeschlossen_am: abgeschlossen_am || null
            }
        });
    } catch (error) {
        console.error('Fehler beim Erstellen des Auftrags:', error);
        res.status(500).json({
            status: 'error',
            message: 'Fehler beim Erstellen des Auftrags',
            error: error instanceof Error ? error.message : 'Unbekannter Fehler'
        });
    }
});

// PUT - Auftrag aktualisieren
router.put('/:id', async (req, res) => {
    try {
        const { service_bereich_id, bezirk_id, mitarbeiter_id, status_id, titel, beschreibung, erstellt_am, abgeschlossen_am } = req.body;

        // Validierung: Pflichtfelder prüfen
        if (!service_bereich_id || !bezirk_id || !mitarbeiter_id || !status_id || !titel) {
            return res.status(400).json({
                status: 'error',
                message: 'Service-Bereich-ID, Bezirk-ID, Mitarbeiter-ID, Status-ID und Titel sind erforderlich'
            });
        }

        // Validierung: Prüfe ob Service-Bereich existiert
        const [serviceBereichExists]: any = await pool.query(
            'SELECT service_bereich_id FROM service_bereich WHERE service_bereich_id = ?',
            [service_bereich_id]
        );

        if (serviceBereichExists.length === 0) {
            return res.status(404).json({
                status: 'error',
                message: 'Service-Bereich mit dieser ID existiert nicht'
            });
        }

        // Validierung: Prüfe ob Bezirk existiert
        const [bezirkExists]: any = await pool.query(
            'SELECT bezirk_id FROM bezirk WHERE bezirk_id = ?',
            [bezirk_id]
        );

        if (bezirkExists.length === 0) {
            return res.status(404).json({
                status: 'error',
                message: 'Bezirk mit dieser ID existiert nicht'
            });
        }

        // Validierung: Prüfe ob Mitarbeiter existiert
        const [mitarbeiterExists]: any = await pool.query(
            'SELECT mitarbeiter_id FROM mitarbeiter WHERE mitarbeiter_id = ?',
            [mitarbeiter_id]
        );

        if (mitarbeiterExists.length === 0) {
            return res.status(404).json({
                status: 'error',
                message: 'Mitarbeiter mit dieser ID existiert nicht'
            });
        }

        // Validierung: Prüfe ob Status existiert
        const [statusExists]: any = await pool.query(
            'SELECT status_id FROM status WHERE status_id = ?',
            [status_id]
        );

        if (statusExists.length === 0) {
            return res.status(404).json({
                status: 'error',
                message: 'Status mit dieser ID existiert nicht'
            });
        }

        // Auftrag aktualisieren
        const [result]: any = await pool.query(
            'UPDATE auftrag SET service_bereich_id = ?, bezirk_id = ?, mitarbeiter_id = ?, status_id = ?, titel = ?, beschreibung = ?, erstellt_am = ?, abgeschlossen_am = ? WHERE auftrag_id = ?',
            [
                service_bereich_id,
                bezirk_id,
                mitarbeiter_id,
                status_id,
                titel,
                beschreibung || null,
                erstellt_am || new Date(),
                abgeschlossen_am || null,
                req.params.id
            ]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                status: 'error',
                message: 'Auftrag nicht gefunden'
            });
        }

        res.json({
            status: 'success',
            message: 'Auftrag erfolgreich aktualisiert',
            data: {
                auftrag_id: req.params.id,
                service_bereich_id,
                bezirk_id,
                mitarbeiter_id,
                status_id,
                titel,
                beschreibung: beschreibung || null,
                erstellt_am: erstellt_am || new Date(),
                abgeschlossen_am: abgeschlossen_am || null
            }
        });
    } catch (error) {
        console.error('Fehler beim Aktualisieren des Auftrags:', error);
        res.status(500).json({
            status: 'error',
            message: 'Fehler beim Aktualisieren des Auftrags',
            error: error instanceof Error ? error.message : 'Unbekannter Fehler'
        });
    }
});

// DELETE - Auftrag löschen
router.delete('/:id', async (req, res) => {
    try {
        const [result]: any = await pool.query(
            'DELETE FROM auftrag WHERE auftrag_id = ?',
            [req.params.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                status: 'error',
                message: 'Auftrag nicht gefunden'
            });
        }

        res.json({
            status: 'success',
            message: 'Auftrag erfolgreich gelöscht'
        });
    } catch (error) {
        console.error('Fehler beim Löschen des Auftrags:', error);
        res.status(500).json({
            status: 'error',
            message: 'Fehler beim Löschen des Auftrags',
            error: error instanceof Error ? error.message : 'Unbekannter Fehler'
        });
    }
});

export default router;