import express from 'express';
import { pool } from '../Datenbankverbindung.ts';

const router = express.Router();

// Route für:
// GET:
// Alle Projekte abrufen
// Ein spezifisches Projekt abrufen
//
// POST
// Ein neues Projekt speichern
//
// PUT
// Ein Projekt aktualisieren
//
// DELETE
// Ein Projekt nach ID Löschen

// GET - Alle Projekte abrufen
router.get('/', async (_req, res) => {
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
        const { titel, beschreibung, aktiv } = req.body;

        if (!titel) {
            return res.status(400).json({
                status: 'error',
                message: 'Titel ist erforderlich'
            });
        }

        const [result]: any = await pool.query(
            'INSERT INTO projekt (titel, beschreibung, aktiv) VALUES (?, ?, ?)',
            [titel, beschreibung || null, aktiv !== undefined ? aktiv : 1]
        );

        res.status(201).json({
            status: 'success',
            message: 'Projekt erfolgreich erstellt',
            data: {
                projekt_id: result.insertId,
                titel,
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
        const { titel, beschreibung, aktiv } = req.body;

        if (!titel) {
            return res.status(400).json({
                status: 'error',
                message: 'Titel ist erforderlich'
            });
        }

        const [result]: any = await pool.query(
            'UPDATE projekt SET titel = ?, beschreibung = ?, aktiv = ? WHERE projekt_id = ?',
            [titel, beschreibung || null, aktiv !== undefined ? aktiv : 1, req.params.id]
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
                titel,
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