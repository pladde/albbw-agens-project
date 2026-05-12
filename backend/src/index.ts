import express from 'express';
import type { Request, Response, Application } from 'express';
import { pool } from './Datenbankverbindung'; // Importiere deinen Pool

const app: Application = express();
const PORT: number = 3000;

app.use(express.json());

// 1. Definition des Typs für deine Hybrid-Daten
// Das hilft dir, genau zu wissen, was in der JSON-Spalte steht
type User = {
    id: number;
    name: string;
    details: {
        email?: string;
        rolle?: string;
        einstellungen?: object;
    }; // Das ist deine JSON-Spalte aus der MariaDB
};

/**
 * Route: Alle Benutzer aus der MariaDB laden
 */
app.get('/users', async (req: Request, res: Response) => {
    try {
        // SQL-Abfrage an die MariaDB
        const [rows] = await pool.query('SELECT * FROM users');

        // Da rows vom Typ 'any' kommt, casten wir es auf unseren User-Typ
        res.json(rows as User[]);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Datenbankfehler' });
    }
});

/**
 * Route: Einen spezifischen Benutzer per ID laden
 */
app.get('/users/:id', async (req: Request, res: Response) => {
    const userId = req.params.id;

    try {
        // Wir nutzen "Prepared Statements" (das ?), um SQL-Injection zu verhindern
        const [rows]: any = await pool.query('SELECT * FROM users WHERE id = ?', [userId]);

        if (rows.length > 0) {
            res.json(rows[0] as User);
        } else {
            res.status(404).json({ message: 'User nicht gefunden' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Fehler beim Abrufen des Users' });
    }
});

app.listen(PORT, () => {
    console.log(`Server läuft auf http://localhost:${PORT}`);
});
