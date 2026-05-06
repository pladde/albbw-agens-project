import express from 'express';
import { pool } from '../Datenbankverbindung';

const router = express.Router();

// GET - Alle Projekte abrufen
router.get('/', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM projekt ORDER BY erstellt_am DESC');
        res.json(rows);
    } catch (error) {
        console.error('Fehler beim Abrufen der Projekte:', error);
        res.status(500).json({
            status: 'error',
            message: 'Fehler beim Abrufen der Projekte',
            error: error instanceof Error ? error.message : 'Unbekannter Fehler'
        });
    }
});

// GET - Einzelnes Projekt abrufen
router.get('/:id', async (req, res) => {
    try {
        const [rows]: any = await pool.query(
            'SELECT * FROM projekt WHERE projekt_id = ?',
            [req.params.id]
        );
        if (rows.length === 0) {
            return res.status(404).json({
                status: 'error',
                message: 'Projekt nicht gefunden'
            });
        }
        res.json(rows[0]);
    } catch (error) {
        console.error('Fehler beim Abrufen des Projekts:', error);
        res.status(500).json({
            status: 'error',
            message: 'Fehler beim Abrufen des Projekts',
            error: error instanceof Error ? error.message : 'Unbekannter Fehler'
        });
    }
});

// POST - Neues Projekt erstellen
router.post('/', async (req, res) => {
    try {
        const { name, beschreibung, aktiv } = req.body;

        if (!name) {
            return res.status(400).json({
                status: 'error',
                message: 'Name ist erforderlich'
            });
        }

        const [result]: any = await pool.query(
            'INSERT INTO projekt (name, beschreibung, aktiv) VALUES (?, ?, ?)',
            [name, beschreibung || null, aktiv !== undefined ? aktiv : 1]
        );

        res.status(201).json({
            status: 'success',
            message: 'Projekt erfolgreich erstellt',
            data: {
                projekt_id: result.insertId,
                name,
                beschreibung,
                aktiv: aktiv !== undefined ? aktiv : 1
            }
        });
    } catch (error) {
        console.error('Fehler beim Erstellen des Projekts:', error);
        res.status(500).json({
            status: 'error',
            message: 'Fehler beim Erstellen des Projekts',
            error: error instanceof Error ? error.message : 'Unbekannter Fehler'
        });
    }
});
// PUT - Projekt aktualisieren
router.put('/:id', async (req, res) => {
    try {
        const { name, beschreibung, aktiv } = req.body;

        if (!name) {
            return res.status(400).json({
                status: 'error',
                message: 'Name ist erforderlich'
            });
        }

        const [result]: any = await pool.query(
            'UPDATE projekt SET name = ?, beschreibung = ?, aktiv = ? WHERE projekt_id = ?',
            [name, beschreibung || null, aktiv !== undefined ? aktiv : 1, req.params.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                status: 'error',
                message: 'Projekt nicht gefunden'
            });
        }

        res.status(200).json({
            status: 'success',
            message: 'Projekt erfolgreich aktualisiert',
            data: {
                projekt_id: req.params.id,
                name,
                beschreibung,
                aktiv
            }
        });
    } catch (error) {
        console.error('Fehler beim Aktualisieren des Projekts:', error);
        res.status(500).json({
            status: 'error',
            message: 'Fehler beim Aktualisieren des Projekts',
            error: error instanceof Error ? error.message : 'Unbekannter Fehler'
        });
    }
});

// DELETE - Projekt löschen
router.delete('/:id', async (req, res) => {
    try {
        const [result]: any = await pool.query(
            'DELETE FROM projekt WHERE projekt_id = ?',
            [req.params.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                status: 'error',
                message: 'Projekt nicht gefunden'
            });
        }

        res.json({
            status: 'success',
            message: 'Projekt erfolgreich gelöscht'
        });
    } catch (error) {
        console.error('Fehler beim Löschen des Projekts:', error);
        res.status(500).json({
            status: 'error',
            message: 'Fehler beim Löschen des Projekts',
            error: error instanceof Error ? error.message : 'Unbekannter Fehler'
        });
    }
});

export default router;