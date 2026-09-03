/** Konfiguration der Datenbankverbindung 
 * Die Datenbankverbindung wird mit den Umgebungsvariablen aus der .env-Datei konfiguriert.
*/

import mysql from "mysql2/promise";
import type { PoolOptions } from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

const dbConfig: PoolOptions = {
  host: process.env.DB_HOST as string,
  user: process.env.DB_USER as string,
  password: process.env.DB_PASSWORD as string,
  database: process.env.DB_NAME as string,
};

const pool = mysql.createPool(dbConfig);

export default pool;