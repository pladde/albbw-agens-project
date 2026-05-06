import express from 'express';
import { pool } from '../Datenbankverbindung';

const router = express.Router();

// GET - Alle Aufträge abrufen (mit Projekt-Namen via JOIN)
router.get('/', async (req, res) => {
    try {
        const [rows] = await pool.query(
            `SELECT a.*, p.name as projekt_name
                FROM auftrag a
                LEFT JOIN projekt p ON a.projekt_id = p.projekt_id
                ORDER BY a.aufnahme_datum DESC`
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

// GET - Einzelnen Auftrag abrufen (mit Projekt-Namen)
router.get('/:id', async (req, res) => {
    try {
        const [rows]: any = await pool.query(`
            SELECT a.*, p.name as projekt_name
            FROM auftrag a
            LEFT JOIN projekt p ON a.projekt_id = p.projekt_id
            WHERE a.auftrag_id = ?`,
            [req.params.id]);

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

// GET - Aufträge nach Projekt abrufen
router.get('/projekt/:projektId', async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT a.*, p.name as projekt_name
            FROM auftrag a
            LEFT JOIN projekt p ON a.projekt_id = p.projekt_id
            WHERE a.projekt_id = ?
            ORDER BY a.aufnahme_datum DESC
        `, [req.params.projektId]);

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

// POST - Neuen Auftrag erstellen
router.post('/', async (req, res) => {
    try {
        const { projekt_id, name_beschreibung, bearbeitet_von, status, daten } = req.body;

        // Validierung: Pflichtfelder prüfen
        if (!projekt_id || !name_beschreibung || !bearbeitet_von) {
            return res.status(400).json({
                status: 'error',
                message: 'Projekt-ID, Name/Beschreibung und Bearbeiter sind erforderlich'
            });
        }

        // Validierung: Prüfe ob Projekt existiert (Fremdschlüssel-Validierung)
        const [projektExists]: any = await pool.query(
            'SELECT projekt_id FROM projekt WHERE projekt_id = ?',
            [projekt_id]
        );

        if (projektExists.length === 0) {
            return res.status(404).json({
                status: 'error',
                message: 'Projekt mit dieser ID existiert nicht'
            });
        }

        // Validierung: Status prüfen (falls angegeben)
        const validStatuses = ['offen', 'in_bearbeitung', 'abgeschlossen', 'storniert'];
        if (status && !validStatuses.includes(status)) {
            return res.status(400).json({
                status: 'error',
                message: `Ungültiger Status. Erlaubt sind: ${validStatuses.join(', ')}`
            });
        }

        // JSON-Daten validieren und formatieren (falls vorhanden)
        let jsonDaten = null;
        if (daten) {
            try {
                jsonDaten = typeof daten === 'string' ? daten : JSON.stringify(daten);
            } catch (e) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Ungültiges JSON-Format für Daten'
                });
            }
        }

        // Auftrag erstellen
        const [result]: any = await pool.query(
            'INSERT INTO auftrag (projekt_id, name_beschreibung, bearbeitet_von, status, daten) VALUES (?, ?, ?, ?, ?)',
            [projekt_id, name_beschreibung, bearbeitet_von, status || 'offen', jsonDaten]
        );

        res.status(201).json({
            status: 'success',
            message: 'Auftrag erfolgreich erstellt',
            data: {
                auftrag_id: result.insertId,
                projekt_id,
                name_beschreibung,
                bearbeitet_von,
                status: status || 'offen',
                daten: jsonDaten
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
        const { projekt_id, name_beschreibung, bearbeitet_von, status, daten } = req.body;

        // Validierung: Pflichtfelder prüfen
        if (!projekt_id || !name_beschreibung || !bearbeitet_von) {
            return res.status(400).json({
                status: 'error',
                message: 'Projekt-ID, Name/Beschreibung und Bearbeiter sind erforderlich'
            });
        }

        // Validierung: Prüfe ob Projekt existiert
        const [projektExists]: any = await pool.query(
            'SELECT projekt_id FROM projekt WHERE projekt_id = ?',
            [projekt_id]
        );

        if (projektExists.length === 0) {
            return res.status(404).json({
                status: 'error',
                message: 'Projekt mit dieser ID existiert nicht'
            });
        }

        // Validierung: Status prüfen
        const validStatuses = ['offen', 'in_bearbeitung', 'abgeschlossen', 'storniert'];
        if (status && !validStatuses.includes(status)) {
            return res.status(400).json({
                status: 'error',
                message: `Ungültiger Status. Erlaubt sind: ${validStatuses.join(', ')}`
            });
        }

        // JSON-Daten validieren
        let jsonDaten = null;
        if (daten) {
            try {
                jsonDaten = typeof daten === 'string' ? daten : JSON.stringify(daten);
            } catch (e) {
                return res.status(400).json({
                    status: 'error',
                    message: 'Ungültiges JSON-Format für Daten'
                });
            }
        }

        // Auftrag aktualisieren
        const [result]: any = await pool.query(
            'UPDATE auftrag SET projekt_id = ?, name_beschreibung = ?, bearbeitet_von = ?, status = ?, daten = ? WHERE auftrag_id = ?',
            [projekt_id, name_beschreibung, bearbeitet_von, status || 'offen', jsonDaten, req.params.id]
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
                projekt_id,
                name_beschreibung,
                bearbeitet_von,
                status,
                daten: jsonDaten
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

// PATCH - Nur Auftragsstatus aktualisieren
router.patch('/:id/status', async (req, res) => {
    try {
        const { status } = req.body;

        if (!status) {
            return res.status(400).json({
                status: 'error',
                message: 'Status ist erforderlich'
            });
        }

        const validStatuses = ['offen', 'in_bearbeitung', 'abgeschlossen', 'storniert'];
        if (!validStatuses.includes(status)) {
            return res.status(400).json({
                status: 'error',
                message: `Ungültiger Status. Erlaubt sind: ${validStatuses.join(', ')}`
            });
        }

        const [result]: any = await pool.query(
            'UPDATE auftrag SET status = ? WHERE auftrag_id = ?',
            [status, req.params.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                status: 'error',
                message: 'Auftrag nicht gefunden'
            });
        }

        res.json({
            status: 'success',
            message: 'Status erfolgreich aktualisiert',
            data: {
                auftrag_id: req.params.id,
                status
            }
        });
    } catch (error) {
        console.error('Fehler beim Aktualisieren des Status:', error);
        res.status(500).json({
            status: 'error',
            message: 'Fehler beim Aktualisieren des Status',
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