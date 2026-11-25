import express from 'express';
import { pool } from '../Datenbankverbindung.ts';

const router = express.Router();

// Route für:
// GET:
// Alle Service-Bereiche abrufen
// Einen spezifischen Service-Bereich abrufen
//
// POST
// Einen neuen Service-Bereich speichern
//
// PUT
// Einen Service-Bereich aktualisieren
//
// DELETE
// Einen Service-Bereich nach ID Löschen

// GET - Alle Service-Bereiche abrufen
router.get('/', async (_req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM service_bereich ORDER BY name');
        res.json(rows);
    } catch (error) {
        console.error('Fehler beim Abrufen der Service-Bereiche:', error);
        res.status(500).json({
            status: 'error',
            message: 'Fehler beim Abrufen der Service-Bereiche',
            error: error instanceof Error ? error.message : 'Unbekannter Fehler'
        });
    }
});

// GET - Einzelnen Service-Bereich abrufen
router.get('/:id', async (req, res) => {
    try {
        const [rows]: any = await pool.query(
            'SELECT * FROM service_bereich WHERE service_bereich_id = ?',
            [req.params.id]
        );
        if (rows.length === 0) {
            return res.status(404).json({
                status: 'error',
                message: 'Service-Bereich nicht gefunden'
            });
        }
        res.json(rows[0]);
    } catch (error) {
        console.error('Fehler beim Abrufen des Service-Bereichs:', error);
        res.status(500).json({
            status: 'error',
            message: 'Fehler beim Abrufen des Service-Bereichs',
            error: error instanceof Error ? error.message : 'Unbekannter Fehler'
        });
    }
});

// POST - Neuen Service-Bereich erstellen
router.post('/', async (req, res) => {
    try {
        const { name, beschreibung, aktiv } = req.body;

        // Validierung: Pflichtfelder prüfen
        if (!name) {
            return res.status(400).json({
                status: 'error',
                message: 'Name ist erforderlich'
            });
        }

        const [result]: any = await pool.query(
            'INSERT INTO service_bereich (name, beschreibung, aktiv) VALUES (?, ?, ?)',
            [name, beschreibung || null, aktiv !== undefined ? aktiv : 1]
        );

        res.status(201).json({
            status: 'success',
            message: 'Service-Bereich erfolgreich erstellt',
            data: {
                service_bereich_id: result.insertId,
                name,
                beschreibung: beschreibung || null,
                aktiv: aktiv !== undefined ? aktiv : 1
            }
        });
    } catch (error) {
        console.error('Fehler beim Erstellen des Service-Bereichs:', error);
        res.status(500).json({
            status: 'error',
            message: 'Fehler beim Erstellen des Service-Bereichs',
            error: error instanceof Error ? error.message : 'Unbekannter Fehler'
        });
    }
});

// PUT - Service-Bereich aktualisieren
router.put('/:id', async (req, res) => {
    try {
        const { name, beschreibung, aktiv } = req.body;

        // Validierung: Pflichtfelder prüfen
        if (!name) {
            return res.status(400).json({
                status: 'error',
                message: 'Name ist erforderlich'
            });
        }

        const [result]: any = await pool.query(
            'UPDATE service_bereich SET name = ?, beschreibung = ?, aktiv = ? WHERE service_bereich_id = ?',
            [name, beschreibung || null, aktiv !== undefined ? aktiv : 1, req.params.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                status: 'error',
                message: 'Service-Bereich nicht gefunden'
            });
        }

        res.json({
            status: 'success',
            message: 'Service-Bereich erfolgreich aktualisiert',
            data: {
                service_bereich_id: req.params.id,
                name,
                beschreibung: beschreibung || null,
                aktiv: aktiv !== undefined ? aktiv : 1
            }
        });
    } catch (error) {
        console.error('Fehler beim Aktualisieren des Service-Bereichs:', error);
        res.status(500).json({
            status: 'error',
            message: 'Fehler beim Aktualisieren des Service-Bereichs',
            error: error instanceof Error ? error.message : 'Unbekannter Fehler'
        });
    }
});

// DELETE - Service-Bereich löschen
router.delete('/:id', async (req, res) => {
    try {
        const [result]: any = await pool.query(
            'DELETE FROM service_bereich WHERE service_bereich_id = ?',
            [req.params.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                status: 'error',
                message: 'Service-Bereich nicht gefunden'
            });
        }

        res.json({
            status: 'success',
            message: 'Service-Bereich erfolgreich gelöscht'
        });
    } catch (error) {
        console.error('Fehler beim Löschen des Service-Bereichs:', error);
        res.status(500).json({
            status: 'error',
            message: 'Fehler beim Löschen des Service-Bereichs',
            error: error instanceof Error ? error.message : 'Unbekannter Fehler'
        });
    }
});

export default router;