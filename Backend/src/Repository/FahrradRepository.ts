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

    public async findFahrradById(id: number): Promise<Fahrrad | null>
    {
        if(!id)
        {
            throw new Error(`Repository: Die Id darf nicht null sein!`);
        }

        try 
        {
            const stmt = 
            "SELECT * FROM fahrraeder WHERE `fahrrad_id` = ?"
            [id];            

            const [result, fields] = await dbPool.execute<ResultSetHeader>(stmt);            

            console.log(fields);

            //weiter hier

        } catch (Error)
        {
            throw new Error("Fehler bei der Abfrage des Fahrrads in der Datenbank!");
        }

        return null;
    }
}