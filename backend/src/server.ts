import express from 'express'
import cors from 'cors'
import { pool } from './Datenbankverbindung'

const app = express()
app.use(cors())
app.use(express.json())


type Auftrag = {
    auftrag_id: number;
    projekt_id: number;
    name_beschreibung: string;
    bearbeitet_von: string
}




// GET - alle Einträge in Auftrag
app.get('/api/auftrag', async (_req, res) => {
    try {
        const [rows] = await pool.query('SELECT * FROM auftrag')
        res.json(rows)
    } catch (error) {
        res.status(500).json({ message: 'Datenbankfehler' })
    }
})

// GET - einzelner Eintrag in Auftrag
app.get('/api/auftrag/:id', async (req, res) => {
    try {
        const [rows] =await pool.query('SELECT * FROM auftrag WHERE id = ?', [req.params.id])
        if (rows.length > 0)
            res.json(rows[0])
        else
            res.status(404).json({ message: 'Nicht gefunden'})
    } catch (error) {
        res.status(500).json({message: 'Datenbankfehler'})
    }
})







// Beispiel-Endpunkt
app.get('/api/daten', async (req, res) => {
    const [rows] = await pool.query('SELECT * FROM json_hybrid_db')
    res.json(rows)
})

app.listen(3001, () => console.log('Backend läuft auf Port 3001'))