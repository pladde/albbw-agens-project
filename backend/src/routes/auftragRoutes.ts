import express from 'express';
import { pool } from '../Datenbankverbindung.ts';

const router = express.Router();

// Route für:
// GET:
// Alle Aufträge abrufen
// Einen spezifischen Auftrag abrufen
// Alle Aufträge nach Projekt-ID abrufen
//
// POST
// Einen neuen Auftrag speichern
//
// PUT
// Ein Auftrag aktualisieren
//
// DELETE
// Einen Auftrag nach ID Löschen

// GET - Alle Aufträge abrufen (mit Projekt-Titel und Bezirk-Name via JOIN)
router.get('/', async (_req, res) => {
    try {
        const [rows] = await pool.query(
            `SELECT a.*, p.titel as projekt_titel, b.name as bezirk_name
                FROM auftrag a
                LEFT JOIN projekt p ON a.p_id = p.projekt_id
                LEFT JOIN bezirk b ON a.bez_id = b.bezirk_id
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

// GET - einzelnen Auftrag abrufen (mit Projekt-Titel und Bezirk-Name)
router.get('/:id', async (req, res) => {
    try {
        const [rows]: any = await pool.query(`
            SELECT a.*, p.titel as projekt_titel, b.name as bezirk_name
            FROM auftrag a
            LEFT JOIN projekt p ON a.p_id = p.projekt_id
            LEFT JOIN bezirk b ON a.bez_id = b.bezirk_id
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
            SELECT a.*, p.titel as projekt_titel, b.name as bezirk_name
            FROM auftrag a
            LEFT JOIN projekt p ON a.p_id = p.projekt_id
            LEFT JOIN bezirk b ON a.bez_id = b.bezirk_id
            WHERE a.p_id = ?
            ORDER BY a.erstellt_am DESC
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

// GET - Aufträge nach Bezirk abrufen
router.get('/bezirk/:bezirkId', async (req, res) => {
    try {
        const [rows] = await pool.query(`
            SELECT a.*, p.titel as projekt_titel, b.name as bezirk_name
            FROM auftrag a
            LEFT JOIN projekt p ON a.p_id = p.projekt_id
            LEFT JOIN bezirk b ON a.bez_id = b.bezirk_id
            WHERE a.bez_id = ?
            ORDER BY a.erstellt_am DESC
        `, [req.params.bezirkId]);

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
        const { p_id, bez_id, daten } = req.body;

        // Validierung: Pflichtfelder prüfen
        if (!p_id || !bez_id) {
            return res.status(400).json({
                status: 'error',
                message: 'Projekt-ID (p_id) und Bezirk-ID (bez_id) sind erforderlich'
            });
        }

        // Validierung: Prüfe ob Projekt existiert (Fremdschlüssel-Validierung)
        const [projektExists]: any = await pool.query(
            'SELECT projekt_id FROM projekt WHERE projekt_id = ?',
            [p_id]
        );

        if (projektExists.length === 0) {
            return res.status(404).json({
                status: 'error',
                message: 'Projekt mit dieser ID existiert nicht'
            });
        }

        // Validierung: Prüfe ob Bezirk existiert (Fremdschlüssel-Validierung)
        const [bezirkExists]: any = await pool.query(
            'SELECT bezirk_id FROM bezirk WHERE bezirk_id = ?',
            [bez_id]
        );

        if (bezirkExists.length === 0) {
            return res.status(404).json({
                status: 'error',
                message: 'Bezirk mit dieser ID existiert nicht'
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
            'INSERT INTO auftrag (p_id, bez_id, daten) VALUES (?, ?, ?)',
            [p_id, bez_id, jsonDaten]
        );

        res.status(201).json({
            status: 'success',
            message: 'Auftrag erfolgreich erstellt',
            data: {
                auftrag_id: result.insertId,
                p_id,
                bez_id,
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
        const { p_id, bez_id, daten } = req.body;

        // Validierung: Pflichtfelder prüfen
        if (!p_id || !bez_id) {
            return res.status(400).json({
                status: 'error',
                message: 'Projekt-ID (p_id) und Bezirk-ID (bez_id) sind erforderlich'
            });
        }

        // Validierung: Prüfe ob Projekt existiert
        const [projektExists]: any = await pool.query(
            'SELECT projekt_id FROM projekt WHERE projekt_id = ?',
            [p_id]
        );

        if (projektExists.length === 0) {
            return res.status(404).json({
                status: 'error',
                message: 'Projekt mit dieser ID existiert nicht'
            });
        }

        // Validierung: Prüfe ob Bezirk existiert
        const [bezirkExists]: any = await pool.query(
            'SELECT bezirk_id FROM bezirk WHERE bezirk_id = ?',
            [bez_id]
        );

        if (bezirkExists.length === 0) {
            return res.status(404).json({
                status: 'error',
                message: 'Bezirk mit dieser ID existiert nicht'
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
            'UPDATE auftrag SET p_id = ?, bez_id = ?, daten = ? WHERE auftrag_id = ?',
            [p_id, bez_id, jsonDaten, req.params.id]
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
                p_id,
                bez_id,
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