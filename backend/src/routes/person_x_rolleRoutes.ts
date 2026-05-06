import express from 'express';
import { pool } from '../Datenbankverbindung';

const router = express.Router();

// GET - Alle Beziehungen abrufen
router.get('/', async (req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM person, person_x_rolle, rolle WHERE person.person_id = person_x_rolle.person_id AND rolle.rolle_id = person_x_rolle.rolle_id ORDER BY person_id, rolle_id');
        res.json(rows);
    } catch (error) {
        console.error('Fehler beim Abrufen der Beziehungen:', error);
        res.status(500).json({
            status: 'error',
            message: 'Fehler beim Abrufen der Beziehungen',
            error: error instanceof Error ? error.message : 'Unbekannter Fehler'
        });
    }
});



