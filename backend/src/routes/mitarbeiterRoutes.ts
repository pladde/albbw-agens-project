import express from 'express';
import { pool } from '../Datenbankverbindung.ts';

const router = express.Router();

// Route für:
// GET:
// Alle Mitarbeiter abrufen
// Einen spezifischen Mitarbeiter abrufen
//
// POST
// Einen neuen Mitarbeiter speichern
//
// PUT
// Einen Mitarbeiter aktualisieren
//
// DELETE
// Einen Mitarbeiter nach ID Löschen

// GET - Alle Mitarbeiter abrufen
router.get('/', async (_req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM mitarbeiter ORDER BY nachname, vorname');
        res.json(rows);
    } catch (error) {
        console.error('Fehler beim Abrufen der Mitarbeiter:', error);
        res.status(500).json({
            status: 'error',
            message: 'Fehler beim Abrufen der Mitarbeiter',
            error: error instanceof Error ? error.message : 'Unbekannter Fehler'
        });
    }
});

// GET - Einzelnen Mitarbeiter abrufen
router.get('/:id', async (req, res) => {
    try {
        const [rows]: any = await pool.query(
            'SELECT * FROM mitarbeiter WHERE mitarbeiter_id = ?',
            [req.params.id]
        );
        if (rows.length === 0) {
            return res.status(404).json({
                status: 'error',
                message: 'Mitarbeiter nicht gefunden'
            });
        }
        res.json(rows[0]);
    } catch (error) {
        console.error('Fehler beim Abrufen des Mitarbeiters:', error);
        res.status(500).json({
            status: 'error',
            message: 'Fehler beim Abrufen des Mitarbeiters',
            error: error instanceof Error ? error.message : 'Unbekannter Fehler'
        });
    }
});

// POST - Neuen Mitarbeiter erstellen
router.post('/', async (req, res) => {
    try {
        const { vorname, nachname, email, telefon } = req.body;

        // Validierung: Pflichtfelder prüfen
        if (!vorname || !nachname) {
            return res.status(400).json({
                status: 'error',
                message: 'Vorname und Nachname sind erforderlich'
            });
        }

        const [result]: any = await pool.query(
            'INSERT INTO mitarbeiter (vorname, nachname, email, telefon) VALUES (?, ?, ?, ?)',
            [vorname, nachname, email || null, telefon || null]
        );

        res.status(201).json({
            status: 'success',
            message: 'Mitarbeiter erfolgreich erstellt',
            data: {
                mitarbeiter_id: result.insertId,
                vorname,
                nachname,
                email: email || null,
                telefon: telefon || null
            }
        });
    } catch (error) {
        console.error('Fehler beim Erstellen des Mitarbeiters:', error);
        res.status(500).json({
            status: 'error',
            message: 'Fehler beim Erstellen des Mitarbeiters',
            error: error instanceof Error ? error.message : 'Unbekannter Fehler'
        });
    }
});

// PUT - Mitarbeiter aktualisieren
router.put('/:id', async (req, res) => {
    try {
        const { vorname, nachname, email, telefon } = req.body;

        // Validierung: Pflichtfelder prüfen
        if (!vorname || !nachname) {
            return res.status(400).json({
                status: 'error',
                message: 'Vorname und Nachname sind erforderlich'
            });
        }

        const [result]: any = await pool.query(
            'UPDATE mitarbeiter SET vorname = ?, nachname = ?, email = ?, telefon = ? WHERE mitarbeiter_id = ?',
            [vorname, nachname, email || null, telefon || null, req.params.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                status: 'error',
                message: 'Mitarbeiter nicht gefunden'
            });
        }

        res.json({
            status: 'success',
            message: 'Mitarbeiter erfolgreich aktualisiert',
            data: {
                mitarbeiter_id: req.params.id,
                vorname,
                nachname,
                email: email || null,
                telefon: telefon || null
            }
        });
    } catch (error) {
        console.error('Fehler beim Aktualisieren des Mitarbeiters:', error);
        res.status(500).json({
            status: 'error',
            message: 'Fehler beim Aktualisieren des Mitarbeiters',
            error: error instanceof Error ? error.message : 'Unbekannter Fehler'
        });
    }
});

// DELETE - Mitarbeiter löschen
router.delete('/:id', async (req, res) => {
    try {
        const [result]: any = await pool.query(
            'DELETE FROM mitarbeiter WHERE mitarbeiter_id = ?',
            [req.params.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                status: 'error',
                message: 'Mitarbeiter nicht gefunden'
            });
        }

        res.json({
            status: 'success',
            message: 'Mitarbeiter erfolgreich gelöscht'
        });
    } catch (error) {
        console.error('Fehler beim Löschen des Mitarbeiters:', error);
        res.status(500).json({
            status: 'error',
            message: 'Fehler beim Löschen des Mitarbeiters',
            error: error instanceof Error ? error.message : 'Unbekannter Fehler'
        });
    }
});

export default router;