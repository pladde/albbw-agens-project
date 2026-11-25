import express from 'express';
import { pool } from '../Datenbankverbindung.ts';

const router = express.Router();

// Route für:
// GET:
// Alle Status abrufen
// Einen spezifischen Status abrufen
//
// POST
// Einen neuen Status speichern
//
// PUT
// Einen Status aktualisieren
//
// DELETE
// Einen Status nach ID Löschen

// GET - Alle Status abrufen
router.get('/', async (_req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM status ORDER BY status_id');
        res.json(rows);
    } catch (error) {
        console.error('Fehler beim Abrufen der Status:', error);
        res.status(500).json({
            status: 'error',
            message: 'Fehler beim Abrufen der Status',
            error: error instanceof Error ? error.message : 'Unbekannter Fehler'
        });
    }
});

// GET - Einzelnen Status abrufen
router.get('/:id', async (req, res) => {
    try {
        const [rows]: any = await pool.query(
            'SELECT * FROM status WHERE status_id = ?',
            [req.params.id]
        );
        if (rows.length === 0) {
            return res.status(404).json({
                status: 'error',
                message: 'Status nicht gefunden'
            });
        }
        res.json(rows[0]);
    } catch (error) {
        console.error('Fehler beim Abrufen des Status:', error);
        res.status(500).json({
            status: 'error',
            message: 'Fehler beim Abrufen des Status',
            error: error instanceof Error ? error.message : 'Unbekannter Fehler'
        });
    }
});

// POST - Neuen Status erstellen
router.post('/', async (req, res) => {
    try {
        const { status } = req.body;

        // Validierung: Pflichtfelder prüfen
        if (!status) {
            return res.status(400).json({
                status: 'error',
                message: 'Status ist erforderlich'
            });
        }

        // Validierung: Erlaubte Werte prüfen
        const erlaubteStatus = ['angenommen', 'in-bearbeitung', 'angelehnt', 'abgeschlossen'];
        if (!erlaubteStatus.includes(status)) {
            return res.status(400).json({
                status: 'error',
                message: `Status muss einer der folgenden Werte sein: ${erlaubteStatus.join(', ')}`
            });
        }

        const [result]: any = await pool.query(
            'INSERT INTO status (status) VALUES (?)',
            [status]
        );

        res.status(201).json({
            status: 'success',
            message: 'Status erfolgreich erstellt',
            data: {
                status_id: result.insertId,
                status
            }
        });
    } catch (error) {
        console.error('Fehler beim Erstellen des Status:', error);
        res.status(500).json({
            status: 'error',
            message: 'Fehler beim Erstellen des Status',
            error: error instanceof Error ? error.message : 'Unbekannter Fehler'
        });
    }
});

// PUT - Status aktualisieren
router.put('/:id', async (req, res) => {
    try {
        const { status } = req.body;

        // Validierung: Pflichtfelder prüfen
        if (!status) {
            return res.status(400).json({
                status: 'error',
                message: 'Status ist erforderlich'
            });
        }

        // Validierung: Erlaubte Werte prüfen
        const erlaubteStatus = ['angenommen', 'in-bearbeitung', 'angelehnt', 'abgeschlossen'];
        if (!erlaubteStatus.includes(status)) {
            return res.status(400).json({
                status: 'error',
                message: `Status muss einer der folgenden Werte sein: ${erlaubteStatus.join(', ')}`
            });
        }

        const [result]: any = await pool.query(
            'UPDATE status SET status = ? WHERE status_id = ?',
            [status, req.params.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                status: 'error',
                message: 'Status nicht gefunden'
            });
        }

        res.json({
            status: 'success',
            message: 'Status erfolgreich aktualisiert',
            data: {
                status_id: req.params.id,
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

// DELETE - Status löschen
router.delete('/:id', async (req, res) => {
    try {
        const [result]: any = await pool.query(
            'DELETE FROM status WHERE status_id = ?',
            [req.params.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                status: 'error',
                message: 'Status nicht gefunden'
            });
        }

        res.json({
            status: 'success',
            message: 'Status erfolgreich gelöscht'
        });
    } catch (error) {
        console.error('Fehler beim Löschen des Status:', error);
        res.status(500).json({
            status: 'error',
            message: 'Fehler beim Löschen des Status',
            error: error instanceof Error ? error.message : 'Unbekannter Fehler'
        });
    }
});

export default router;