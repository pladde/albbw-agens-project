import express from 'express'
import cors from 'cors'
import { pool } from './datenbankverbindung'

const app = express()
app.use(cors())
app.use(express.json())

// Beispiel-Endpunkt
app.get('/api/daten', async (req, res) => {
    const [rows] = await pool.query('SELECT * FROM json_hybrid_db')
    res.json(rows)
})

app.listen(3001, () => console.log('Backend läuft auf Port 3001'))