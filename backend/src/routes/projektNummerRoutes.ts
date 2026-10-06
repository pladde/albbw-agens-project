import express from 'express';
import { pool } from '../Datenbankverbindung.ts';

const router = express.Router();


// Jede Projektnummer wird mit Modulo 16 geprüft.
// Das Ergebnis (0-15) wird in eine 4-stellige Binärzahl übersetzt.
// Jedes Bit steht für einen Service-Bereich:
//
//   Bit 0 (Wert 1) = Holzwerkstatt
//   Bit 1 (Wert 2) = Fahrradwerkstatt
//   Bit 2 (Wert 4) = Textilwerkstatt
//   Bit 3 (Wert 8) = Bürodienstleistungen
//
// Beispiel: Projektnummer 9384758
//   9384758 % 16 = 6
//   6 in Binär   = 0110
//   → Fahrradwerkstatt + Textilwerkstatt sind aktiv

// Die 4 Service-Bereiche in fester Reihenfolge (Bit 0 bis Bit 3)
const SERVICE_BEREICHE = [
    { bitWert: 1, name: 'Holzwerkstatt' },
    { bitWert: 2, name: 'Fahrradwerkstatt' },
    { bitWert: 4, name: 'Textilwerkstatt' },
    { bitWert: 8, name: 'Bürodienstleistungen' },
];

/**
 * Prüft eine Projektnummer mit Modulo 16 und liefert die ausgewerteten Angebote.
 * @param projektNummer Die Projektnummer (z.B. 9384758)
 * @returns Objekt mit Rest, Binär-Code und den aktiven Service-Bereichen
 */
function projektNummerAuswerten(projektNummer: number) {
    // Modulo 16 → Zahl zwischen 0 und 15
    const rest = projektNummer % 16;

    // In 4-stellige Binärzahl umwandeln (z.B. 6 → "0110")
    const binaer = rest.toString(2).padStart(4, '0');

    // Aktive Service-Bereiche ermitteln (Bit ist gesetzt)
    const aktiveBereiche = SERVICE_BEREICHE.filter((bereich) => (rest & bereich.bitWert) !== 0);

    // gibt ein JavaScript-Objekt (Objekt-Literal) zurückf
    return {
        projektNummer,
        moduloErgebnis: rest,
        binaerCode: binaer,
        aktiveServiceBereiche: aktiveBereiche.map((b) => b.name),
    };
}

// GET - Alle Projektnummern abrufen (mit ausgewerteten Angeboten)
router.get('/', async (_req, res) => {
    try {
        const [rows]: any = await pool.query(
            'SELECT * FROM projekt_nummer ORDER BY projekt_nummer_id'
        );

        // Jede Projektnummer mit der Modulo-16-Logik auswerten
        const ergebnisse = rows.map((row: any) => projektNummerAuswerten(row.projekt_nummer));

        res.json(ergebnisse);
    } catch (error) {
        console.error('Fehler beim Abrufen der Projektnummern:', error);
        res.status(500).json({
            status: 'error',
            message: 'Fehler beim Abrufen der Projektnummern',
            error: error instanceof Error ? error.message : 'Unbekannter Fehler'
        });
    }
});

// GET - Einzelne Projektnummer abrufen (mit ausgewerteten Angeboten)
router.get('/:id', async (req, res) => {
    try {
        const [rows]: any = await pool.query(
            'SELECT * FROM projekt_nummer WHERE projekt_nummer_id = ?',
            [req.params.id]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                status: 'error',
                message: 'Projektnummer nicht gefunden'
            });
        }

        const ergebnis = projektNummerAuswerten(rows[0].projekt_nummer);
        res.json(ergebnis);
    } catch (error) {
        console.error('Fehler beim Abrufen der Projektnummer:', error);
        res.status(500).json({
            status: 'error',
            message: 'Fehler beim Abrufen der Projektnummer',
            error: error instanceof Error ? error.message : 'Unbekannter Fehler'
        });
    }
});

// GET - Nur die aktiven Angebote einer Projektnummer abrufen
router.get('/:id/angebote', async (req, res) => {
    try {
        const [rows]: any = await pool.query(
            'SELECT * FROM projekt_nummer WHERE projekt_nummer_id = ?',
            [req.params.id]
        );

        if (rows.length === 0) {
            return res.status(404).json({
                status: 'error',
                message: 'Projektnummer nicht gefunden'
            });
        }

        const ergebnis = projektNummerAuswerten(rows[0].projekt_nummer);
        res.json({
            projektNummer: ergebnis.projektNummer,
            binaerCode: ergebnis.binaerCode,
            angebote: ergebnis.aktiveServiceBereiche,
        });
    } catch (error) {
        console.error('Fehler beim Abrufen der Angebote:', error);
        res.status(500).json({
            status: 'error',
            message: 'Fehler beim Abrufen der Angebote',
            error: error instanceof Error ? error.message : 'Unbekannter Fehler'
        });
    }
});

// POST - Neue Projektnummer speichern (mit Validierung)
router.post('/', async (req, res) => {
    try {
        const { projekt_nummer } = req.body;

        // Validierung: Projektnummer ist erforderlich
        if (projekt_nummer === undefined || projekt_nummer === null || projekt_nummer === '') {
            return res.status(400).json({
                status: 'error',
                message: 'Projektnummer ist erforderlich'
            });
        }

        // Validierung: Muss eine positive ganze Zahl sein
        const nummer = Number(projekt_nummer);
        if (!Number.isInteger(nummer) || nummer <= 0) {
            return res.status(400).json({
                status: 'error',
                message: 'Projektnummer muss eine positive ganze Zahl sein'
            });
        }

        // Prüfen ob die Projektnummer bereits existiert
        const [existing]: any = await pool.query(
            'SELECT * FROM projekt_nummer WHERE projekt_nummer = ?',
            [nummer]
        );

        if (existing.length > 0) {
            return res.status(409).json({
                status: 'error',
                message: 'Diese Projektnummer existiert bereits'
            });
        }

        const [result]: any = await pool.query(
            'INSERT INTO projekt_nummer (projekt_nummer) VALUES (?)',
            [nummer]
        );

        // Die neue Projektnummer direkt auswerten
        const ergebnis = projektNummerAuswerten(nummer);

        res.status(201).json({
            status: 'success',
            message: 'Projektnummer erfolgreich gespeichert',
            data: {
                projekt_nummer_id: result.insertId,
                ...ergebnis,
            }
        });
    } catch (error) {
        console.error('Fehler beim Speichern der Projektnummer:', error);
        res.status(500).json({
            status: 'error',
            message: 'Fehler beim Speichern der Projektnummer',
            error: error instanceof Error ? error.message : 'Unbekannter Fehler'
        });
    }
});

// DELETE - Projektnummer löschen
router.delete('/:id', async (req, res) => {
    try {
        const [result]: any = await pool.query(
            'DELETE FROM projekt_nummer WHERE projekt_nummer_id = ?',
            [req.params.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({
                status: 'error',
                message: 'Projektnummer nicht gefunden'
            });
        }

        res.json({
            status: 'success',
            message: 'Projektnummer erfolgreich gelöscht'
        });
    } catch (error) {
        console.error('Fehler beim Löschen der Projektnummer:', error);
        res.status(500).json({
            status: 'error',
            message: 'Fehler beim Löschen der Projektnummer',
            error: error instanceof Error ? error.message : 'Unbekannter Fehler'
        });
    }
});

export default router;