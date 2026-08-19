import express from 'express';
import { pool } from '../Datenbankverbindung.ts';

const router = express.Router();

// Route für:
// GET:
// Alle Rollen abrufen
// Eine spezifische Rolle abrufen
//
// POST
// Eine neue Rolle speichern
//
// PUT
// Eine Rolle aktualisieren
//
// DELETE
// Eine Rolle nach ID Löschen

// GET - Alle Rollen abrufen
router.get('/', async (_req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM rolle ORDER BY beschreibung');
        res.json(rows);
    } catch (error) {
        console.error('Fehler beim Abrufen der Rollen:', error);
        res.status(500).json({
            status: 'error',
            message: 'Fehler beim Abrufen der Rollen',
            error: error instanceof Error ? error.message : 'Unbekannter Fehler'
        });
    }
});

// GET - Einzelne Rolle abrufen
router.get('/:id', async (req, res) => {
    try {
        const [rows]: any = await pool.query(
            'SELECT * FROM rolle WHERE rolle_id = ?',
            [req.params.id]
        );
        if (rows.length === 0) {
            return res.status(404).json({
                status: 'error',
                message: 'Rolle nicht gefunden'
            });
        }
        res.json(rows[0]);
    } catch (error) {
        console.error('Fehler beim Abrufen der Rolle:', error);
        res.status(500).json({
            status: 'error',
            message: 'Fehler beim Abrufen der Rolle',
            error: error instanceof Error ? error.message : 'Unbekannter Fehler'
        });
    }
});

// POST - Neue Rolle erstellen
router.post('/', async (req, res) => {
    try {
        const { beschreibung } = req.body;

        if (!beschreibung) {
            return res.status(400).json({
                status: 'error',
                message: 'Beschreibung ist erforderlich'
            });
        }

        const [result]: any = await pool.query(
            'INSERT INTO rolle (beschreibung) VALUES (?)',
            [beschreibung]
        );

        res.status(201).json({
            status: 'success',
            message: 'Rolle erfolgreich erstellt',
            data: {
                rolle_id: result.insertId,
                beschreibung
            }
        });
    } catch (error) {
        console.error('Fehler beim Erstellen der Rolle:', error);
        res.status(500).json({
            status: 'error',
            message: 'Fehler beim Erstellen der Rolle',
            error: error instanceof Error ? error.message : 'Unbekannter Fehler'
        });
    }
});

// PUT - Rolle aktualisieren
router.put('/:id', async (req, res) => {
    try {
        const { beschreibung } = req.body;

        if (!beschreibung) {
            return res.status(400).json({
                status: 'error',
                message: 'Beschreibung ist erforderlich'
            });
        }

        const [result]: any = await pool.query(
            'UPDATE rolle SET beschreibung = ? WHERE rolle_id = ?',
            [beschreibung, req.params.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                status: 'error',
                message: 'Rolle nicht gefunden'
            });
        }

        res.json({
            status: 'success',
            message: 'Rolle erfolgreich aktualisiert',
            data: {
                rolle_id: req.params.id,
                beschreibung
            }
        });
    } catch (error) {
        console.error('Fehler beim Aktualisieren der Rolle:', error);
        res.status(500).json({
            status: 'error',
            message: 'Fehler beim Aktualisieren der Rolle',
            error: error instanceof Error ? error.message : 'Unbekannter Fehler'
        });
    }
});

// DELETE - Rolle löschen
router.delete('/:id', async (req, res) => {
    try {
        const [result]: any = await pool.query(
            'DELETE FROM rolle WHERE rolle_id = ?',
            [req.params.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                status: 'error',
                message: 'Rolle nicht gefunden'
            });
        }

        res.json({
            status: 'success',
            message: 'Rolle erfolgreich gelöscht'
        });
    } catch (error) {
        console.error('Fehler beim Löschen der Rolle:', error);
        res.status(500).json({
            status: 'error',
            message: 'Fehler beim Löschen der Rolle',
            error: error instanceof Error ? error.message : 'Unbekannter Fehler'
        });
    }
});

export default router;