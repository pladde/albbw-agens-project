import express from 'express';
import { pool } from '../Datenbankverbindung';

const router = express.Router();

// GET - Alle Personen abrufen
router.get('/', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM person ORDER BY nachname, vorname');
        res.json(rows);
    } catch (error) {
        console.error('Fehler beim Abrufen der Personen:', error);
        res.status(500).json({
            status: 'error',
            message: 'Fehler beim Abrufen der Personen',
            error: error instanceof Error ? error.message : 'Unbekannter Fehler'
        });
    }
});

// GET - Einzelne Person abrufen
router.get('/:id', async (req, res) => {
    try {
        const [rows]: any = await pool.query(
            'SELECT * FROM person WHERE person_id = ?',
            [req.params.id]
        );
        if (rows.length === 0) {
            return res.status(404).json({
                status: 'error',
                message: 'Person nicht gefunden'
            });
        }
        res.json(rows[0]);
    } catch (error) {
        console.error('Fehler beim Abrufen der Person:', error);
        res.status(500).json({
            status: 'error',
            message: 'Fehler beim Abrufen der Person',
            error: error instanceof Error ? error.message : 'Unbekannter Fehler'
        });
    }
});

// POST - Neue Person erstellen
router.post('/', async (req, res) => {
    try {
        const { vorname, nachname, email } = req.body;

        if (!vorname || !nachname || !email) {
            return res.status(400).json({
                status: 'error',
                message: 'Vorname, Nachname und Email sind erforderlich'
            });
        }

        const [result]: any = await pool.query(
            'INSERT INTO person (vorname, nachname, email) VALUES (?, ?, ?)',
            [vorname || null, nachname || null, email]
        );

        res.status(201).json({
            status: 'success',
            message: 'Person erfolgreich erstellt',
            data: {
                person_id: result.insertId,
                vorname,
                nachname,
                email
            }
        });
    } catch (error) {
        console.error('Fehler beim Erstellen der Person:', error);
        res.status(500).json({
            status: 'error',
            message: 'Fehler beim Erstellen der Person',
            error: error instanceof Error ? error.message : 'Unbekannter Fehler'
        });
    }
});

// PUT - Person aktualisieren
router.put('/:id', async (req, res) => {
    try {
        const { vorname, nachname, email } = req.body;

        if (!nachname || !vorname || !email) {
            return res.status(400).json({
                status: 'error',
                message: 'Nachname, Vorname und Email sind erforderlich'
            });
        }

        const [result]: any = await pool.query(
            'UPDATE person SET vorname = ?, nachname = ?, email = ? WHERE person_id = ?',
            [vorname || null, nachname || null, email, req.params.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                status: 'error',
                message: 'Person nicht gefunden'
            });
        }

        res.json({
            status: 'success',
            message: 'Person erfolgreich aktualisiert',
            data: {
                person_id: req.params.id,
                vorname,
                nachname,
                email
            }
        });
    } catch (error) {
        console.error('Fehler beim Aktualisieren der Person:', error);
        res.status(500).json({
            status: 'error',
            message: 'Fehler beim Aktualisieren der Person',
            error: error instanceof Error ? error.message : 'Unbekannter Fehler'
        });
    }
});

// DELETE - Person löschen
router.delete('/:id', async (req, res) => {
    try {
        const [result]: any = await pool.query(
            'DELETE FROM person WHERE person_id = ?',
            [req.params.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                status: 'error',
                message: 'Person nicht gefunden'
            });
        }

        res.json({
            status: 'success',
            message: 'Person erfolgreich gelöscht'
        });
    } catch (error) {
        console.error('Fehler beim Löschen der Person:', error);
        res.status(500).json({
            status: 'error',
            message: 'Fehler beim Löschen der Person',
            error: error instanceof Error ? error.message : 'Unbekannter Fehler'
        });
    }
});

export default router;


