// Import = "Hole aus der Datei xy (die im Order z liegt) das, was dort als Standart-Export (export default) herausgegeben wird, und nenne es hier abc."

import express from 'express' // Ohne Express müsste man selber coden, wie der Server Anfragen verarbeitet (Header Parsen, Routen erkennen, Antworten formatieren) Express übernimmt das.
import cors from 'cors'
import auftragRoutes from "./routes/auftragRoutes.ts";
import bezirkRoutes from "./routes/bezirkRoutes.ts";
import personRoutes from "./routes/personRoutes.ts";
import projektRoutes from "./routes/projektRoutes.ts";
import projekt_x_personRoutes from "./routes/projekt_x_personRoutes.ts";
import rolleRoutes from "./routes/rolleRoutes.ts";


// server.ts = Der Hauptserver
// wie ein Kellner nimmt der Server Anfragen entgegen und gibt Antworten zurück.

// app.get = wenn jemand eine get-anfrage (daten abrufen) an diese Adresse schickt, dann führe diesen Code aus
// app.use = wird zuerst ausgeführt vor jeder Art von Anfrage, egal ob get, post, put, delete. Das nennt sich Middleware
// req = Anfrage (was der Client schickt)
// res = Antwort (was der Server zurückschickt)


const app = express() // Erstellt eine Express-App
app.use(cors())
app.use(express.json())


// Hier werden die modularen Routes registriert:
app.use('/api/auftrag', auftragRoutes);
app.use('/api/bezirk', bezirkRoutes);
app.use('/api/person', personRoutes);
app.use('/api/projekt', projektRoutes);
app.use('/api/projekt_x_person', projekt_x_personRoutes);
app.use('/api/rolle', rolleRoutes);


// GET - wenn die Startseite angefragt wird, meldet das backend sich mit hallo
app.get('/', (_req, res) => {
    res.send('Hallo vom Backend!');
});


// startet den Server auf Port 3001
const PORT = 3001
app.listen(PORT, () => {
    console.log(`Backend läuft auf Port ${PORT}`)
})