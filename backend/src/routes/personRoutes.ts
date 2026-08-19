import express from 'express';
import { pool } from '../Datenbankverbindung.ts';

const router = express.Router();

// Route für:
// GET:
// Alle Personen abrufen
// Eine spezifische Person abrufen
//
// POST
// Eine neue Person speichern
//
// PUT
// Eine Person aktualisieren
//
// DELETE
// Eine Person nach ID Löschen

// GET - Alle Personen abrufen (mit Rollen-Beschreibung via JOIN)
router.get('/', async (_req, res) => {
    try {
        const [rows] = await pool.query(
            `SELECT p.*, r.beschreibung as rolle_beschreibung
             FROM person p
             LEFT JOIN rolle r ON p.r_id = r.rolle_id
             ORDER BY p.name, p.vorname`
        );
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

// GET - Einzelne Person abrufen (mit Rollen-Beschreibung)
router.get('/:id', async (req, res) => {
    try {
        const [rows]: any = await pool.query(
            `SELECT p.*, r.beschreibung as rolle_beschreibung
             FROM person p
             LEFT JOIN rolle r ON p.r_id = r.rolle_id
             WHERE p.person_id = ?`,
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
        const { r_id, name, vorname, email, telefon, aktiv } = req.body;

        // Validierung: Pflichtfelder prüfen
        if (!r_id || !name || !vorname) {
            return res.status(400).json({
                status: 'error',
                message: 'Rollen-ID (r_id), Name und Vorname sind erforderlich'
            });
        }

        // Validierung: Prüfe ob Rolle existiert (Fremdschlüssel-Validierung)
        const [rolleExists]: any = await pool.query(
            'SELECT rolle_id FROM rolle WHERE rolle_id = ?',
            [r_id]
        );

        if (rolleExists.length === 0) {
            return res.status(404).json({
                status: 'error',
                message: 'Rolle mit dieser ID existiert nicht'
            });
        }

        const [result]: any = await pool.query(
            'INSERT INTO person (r_id, name, vorname, email, telefon, aktiv) VALUES (?, ?, ?, ?, ?, ?)',
            [r_id, name, vorname, email || null, telefon || null, aktiv !== undefined ? aktiv : 1]
        );

        res.status(201).json({
            status: 'success',
            message: 'Person erfolgreich erstellt',
            data: {
                person_id: result.insertId,
                r_id,
                name,
                vorname,
                email: email || null,
                telefon: telefon || null,
                aktiv: aktiv !== undefined ? aktiv : 1
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
        const { r_id, name, vorname, email, telefon, aktiv } = req.body;

        // Validierung: Pflichtfelder prüfen
        if (!r_id || !name || !vorname) {
            return res.status(400).json({
                status: 'error',
                message: 'Rollen-ID (r_id), Name und Vorname sind erforderlich'
            });
        }

        // Validierung: Prüfe ob Rolle existiert
        const [rolleExists]: any = await pool.query(
            'SELECT rolle_id FROM rolle WHERE rolle_id = ?',
            [r_id]
        );

        if (rolleExists.length === 0) {
            return res.status(404).json({
                status: 'error',
                message: 'Rolle mit dieser ID existiert nicht'
            });
        }

        const [result]: any = await pool.query(
            'UPDATE person SET r_id = ?, name = ?, vorname = ?, email = ?, telefon = ?, aktiv = ? WHERE person_id = ?',
            [r_id, name, vorname, email || null, telefon || null, aktiv !== undefined ? aktiv : 1, req.params.id]
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
                r_id,
                name,
                vorname,
                email: email || null,
                telefon: telefon || null,
                aktiv: aktiv !== undefined ? aktiv : 1
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