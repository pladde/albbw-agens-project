import mysql from 'mysql2/promise'
import type { PoolConnection } from 'mysql2/promise'

// Datenbankverbindung.ts = Die Verbindung zur Datenbank


// pool = ein pool an verbindungen, wie ein Telefonbuch, damit mehrere Anfragen gleichzeitig bearbeitet werden können.
export const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'json_hybrid_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Test der Verbindung
pool.getConnection()
    .then((connection: PoolConnection) => {
        console.log('Verbindung erfolgreich hergestellt')
        connection.release()
    })
    .catch((error: Error) => {
        console.error('Fehler bei der Verbindung', error);
    })
