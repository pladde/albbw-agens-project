import express from 'express';
import { pool } from '../Datenbankverbindung.ts';

const router = express.Router();

// Route für:
// GET:
// Alle Zuordnungen abrufen
// Alle Personen eines Projekts abrufen
// Alle Projekte einer Person abrufen
//
// POST
// Eine neue Zuordnung speichern
//
// DELETE
// Eine Zuordnung löschen

// GET - Alle Zuordnungen abrufen (mit Projekt-Titel und Person-Name via JOIN)
router.get('/', async (_req, res) => {
    try {
        const [rows] = await pool.query(
            `SELECT px.*, pr.titel as projekt_titel, p.name as person_name, p.vorname as person_vorname
             FROM projekt_x_person px
             LEFT JOIN projekt pr ON px.projekt_id = pr.projekt_id
             LEFT JOIN person p ON px.person_id = p.person_id
             ORDER BY px.x_id`
        );
        res.json(rows);
    } catch (error) {
        console.error('Fehler beim Abrufen der Zuordnungen:', error);
        res.status(500).json({
            status: 'error',
            message: 'Fehler beim Abrufen der Zuordnungen',
            error: error instanceof Error ? error.message : 'Unbekannter Fehler'
        });
    }
});

// GET - Alle Personen eines Projekts abrufen
router.get('/projekt/:projektId/personen', async (req, res) => {
    try {
        const [rows] = await pool.query(
            `SELECT p.*, px.x_id
             FROM person p
             INNER JOIN projekt_x_person px ON p.person_id = px.person_id
             WHERE px.projekt_id = ?
             ORDER BY p.name, p.vorname`,
            [req.params.projektId]
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

// GET - Alle Projekte einer Person abrufen
router.get('/person/:personId/projekte', async (req, res) => {
    try {
        const [rows] = await pool.query(
            `SELECT pr.*, px.x_id
             FROM projekt pr
             INNER JOIN projekt_x_person px ON pr.projekt_id = px.projekt_id
             WHERE px.person_id = ?
             ORDER BY pr.erstellt_am DESC`,
            [req.params.personId]
        );
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

// POST - Person zu Projekt zuordnen
router.post('/', async (req, res) => {
    try {
        const { projekt_id, person_id } = req.body;

        if (!projekt_id || !person_id) {
            return res.status(400).json({
                status: 'error',
                message: 'Projekt-ID und Person-ID sind erforderlich'
            });
        }

        // Validierung: Prüfe ob Projekt existiert (Fremdschlüssel-Validierung)
        const [projektExists]: any = await pool.query(
            'SELECT projekt_id FROM projekt WHERE projekt_id = ?',
            [projekt_id]
        );

        if (projektExists.length === 0) {
            return res.status(404).json({
                status: 'error',
                message: 'Projekt mit dieser ID existiert nicht'
            });
        }

        // Validierung: Prüfe ob Person existiert (Fremdschlüssel-Validierung)
        const [personExists]: any = await pool.query(
            'SELECT person_id FROM person WHERE person_id = ?',
            [person_id]
        );

        if (personExists.length === 0) {
            return res.status(404).json({
                status: 'error',
                message: 'Person mit dieser ID existiert nicht'
            });
        }

        // Prüfe ob Zuordnung bereits existiert (Unique-Constraint)
        const [existing]: any = await pool.query(
            'SELECT * FROM projekt_x_person WHERE projekt_id = ? AND person_id = ?',
            [projekt_id, person_id]
        );

        if (existing.length > 0) {
            return res.status(409).json({
                status: 'error',
                message: 'Diese Zuordnung existiert bereits'
            });
        }

        const [result]: any = await pool.query(
            'INSERT INTO projekt_x_person (projekt_id, person_id) VALUES (?, ?)',
            [projekt_id, person_id]
        );

        res.status(201).json({
            status: 'success',
            message: 'Person erfolgreich dem Projekt zugeordnet',
            data: {
                x_id: result.insertId,
                projekt_id,
                person_id
            }
        });
    } catch (error) {
        console.error('Fehler beim Zuordnen:', error);
        res.status(500).json({
            status: 'error',
            message: 'Fehler beim Zuordnen der Person zum Projekt',
            error: error instanceof Error ? error.message : 'Unbekannter Fehler'
        });
    }
});

// DELETE - Zuordnung löschen
router.delete('/:id', async (req, res) => {
    try {
        const [result]: any = await pool.query(
            'DELETE FROM projekt_x_person WHERE x_id = ?',
            [req.params.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                status: 'error',
                message: 'Zuordnung nicht gefunden'
            });
        }

        res.json({
            status: 'success',
            message: 'Zuordnung erfolgreich gelöscht'
        });
    } catch (error) {
        console.error('Fehler beim Löschen der Zuordnung:', error);
        res.status(500).json({
            status: 'error',
            message: 'Fehler beim Löschen der Zuordnung',
            error: error instanceof Error ? error.message : 'Unbekannter Fehler'
        });
    }
});

// DELETE - Zuordnung nach Projekt und Person löschen
router.delete('/projekt/:projektId/person/:personId', async (req, res) => {
    try {
        const [result]: any = await pool.query(
            'DELETE FROM projekt_x_person WHERE projekt_id = ? AND person_id = ?',
            [req.params.projektId, req.params.personId]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                status: 'error',
                message: 'Zuordnung nicht gefunden'
            });
        }

        res.json({
            status: 'success',
            message: 'Zuordnung erfolgreich gelöscht'
        });
    } catch (error) {
        console.error('Fehler beim Löschen der Zuordnung:', error);
        res.status(500).json({
            status: 'error',
            message: 'Fehler beim Löschen der Zuordnung',
            error: error instanceof Error ? error.message : 'Unbekannter Fehler'
        });
    }
});

export default router;