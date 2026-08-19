import express from 'express';
import { pool } from '../Datenbankverbindung.ts';

const router = express.Router();

// Route für:
// GET:
// Alle Bezirke abrufen
// Einen spezifischen Bezirk abrufen
//
// POST
// Einen neuen Bezirk speichern
//
// PUT
// Einen Bezirk aktualisieren
//
// DELETE
// Einen Bezirk nach ID Löschen

// GET - Alle Bezirke abrufen
router.get('/', async (_req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM bezirk ORDER BY name');
        res.json(rows);
    } catch (error) {
        console.error('Fehler beim Abrufen der Bezirke:', error);
        res.status(500).json({
            status: 'error',
            message: 'Fehler beim Abrufen der Bezirke',
            error: error instanceof Error ? error.message : 'Unbekannter Fehler'
        });
    }
});

// GET - Einzelnen Bezirk abrufen
router.get('/:id', async (req, res) => {
    try {
        const [rows]: any = await pool.query(
            'SELECT * FROM bezirk WHERE bezirk_id = ?',
            [req.params.id]
        );
        if (rows.length === 0) {
            return res.status(404).json({
                status: 'error',
                message: 'Bezirk nicht gefunden'
            });
        }
        res.json(rows[0]);
    } catch (error) {
        console.error('Fehler beim Abrufen des Bezirks:', error);
        res.status(500).json({
            status: 'error',
            message: 'Fehler beim Abrufen des Bezirks',
            error: error instanceof Error ? error.message : 'Unbekannter Fehler'
        });
    }
});

// POST - Neuen Bezirk erstellen
router.post('/', async (req, res) => {
    try {
        const { name, kuerzel } = req.body;

        // Validierung: Pflichtfelder prüfen
        if (!name || !kuerzel) {
            return res.status(400).json({
                status: 'error',
                message: 'Name und Kürzel sind erforderlich'
            });
        }

        const [result]: any = await pool.query(
            'INSERT INTO bezirk (name, kuerzel) VALUES (?, ?)',
            [name, kuerzel]
        );

        res.status(201).json({
            status: 'success',
            message: 'Bezirk erfolgreich erstellt',
            data: {
                bezirk_id: result.insertId,
                name,
                kuerzel
            }
        });
    } catch (error) {
        console.error('Fehler beim Erstellen des Bezirks:', error);
        res.status(500).json({
            status: 'error',
            message: 'Fehler beim Erstellen des Bezirks',
            error: error instanceof Error ? error.message : 'Unbekannter Fehler'
        });
    }
});

// PUT - Bezirk aktualisieren
router.put('/:id', async (req, res) => {
    try {
        const { name, kuerzel } = req.body;

        // Validierung: Pflichtfelder prüfen
        if (!name || !kuerzel) {
            return res.status(400).json({
                status: 'error',
                message: 'Name und Kürzel sind erforderlich'
            });
        }

        const [result]: any = await pool.query(
            'UPDATE bezirk SET name = ?, kuerzel = ? WHERE bezirk_id = ?',
            [name, kuerzel, req.params.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                status: 'error',
                message: 'Bezirk nicht gefunden'
            });
        }

        res.json({
            status: 'success',
            message: 'Bezirk erfolgreich aktualisiert',
            data: {
                bezirk_id: req.params.id,
                name,
                kuerzel
            }
        });
    } catch (error) {
        console.error('Fehler beim Aktualisieren des Bezirks:', error);
        res.status(500).json({
            status: 'error',
            message: 'Fehler beim Aktualisieren des Bezirks',
            error: error instanceof Error ? error.message : 'Unbekannter Fehler'
        });
    }
});

// DELETE - Bezirk löschen
router.delete('/:id', async (req, res) => {
    try {
        const [result]: any = await pool.query(
            'DELETE FROM bezirk WHERE bezirk_id = ?',
            [req.params.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                status: 'error',
                message: 'Bezirk nicht gefunden'
            });
        }

        res.json({
            status: 'success',
            message: 'Bezirk erfolgreich gelöscht'
        });
    } catch (error) {
        console.error('Fehler beim Löschen des Bezirks:', error);
        res.status(500).json({
            status: 'error',
            message: 'Fehler beim Löschen des Bezirks',
            error: error instanceof Error ? error.message : 'Unbekannter Fehler'
        });
    }
});

export default router;