import mysql from 'mysql2/promise';

import * as dotenv from "dotenv";

const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  };

  const pool = mysql.createPool(dbConfig);

  /**
   * Erstellt einen Verbindungspool. Die Verbindungsinformationen sind bereits eingetragen.
   */
  export default pool;