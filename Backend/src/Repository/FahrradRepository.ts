import { Fahrrad } from "../Models/Fahrrad";
import dbPool from "../config/db"
import { ResultSetHeader } from 'mysql2/promise';

export class FahrradRepository 
{
    /**
     * Diese Methode erstellt über eine SQL-Query ein neues Fahrrad in die Datenbank. 
     * @param fahrrad Das Objekt vom Typ Fahrrad.
     * @returns Ein Fahrradobjekt oder null. 
     * @throws Wenn das Fahrradobjekt null oder leer ist wird ein Error geworfen.
     */
    public async save(fahrrad: Fahrrad): Promise<number | null>
    {
        if(!fahrrad)
        {
            throw new Error(`Repository: Das Objekt ${fahrrad} darf nicht null oder leer sein!`)
        }

        const stmt = 
        `INSERT INTO fahrrader (marke, rahmennummer, besonderheiten, bearbeitungstatus, erfasstAm, erfasstVon, herausgegebenAn)
        VALUES(?, ?, ?, ?, ?, ?, ?)`
        const values = [
            fahrrad.marke,
            fahrrad.rahmennummer,
            fahrrad.besonderheiten,
            fahrrad.bearbeitungsstatus,
            fahrrad.erfasstAm,
            fahrrad.erfasstVon,
            fahrrad.herausgegebenAn
        ]

        try 
        {
            const [result] = await dbPool.execute<ResultSetHeader>(stmt, values);

            return result.insertId;
            
        } catch (error)
        {
            throw new Error("Fehler beim Speichern des Fahrrads in der Datenbank.");
        }
    }
}