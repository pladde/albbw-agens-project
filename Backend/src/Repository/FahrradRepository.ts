import { error } from "console";
import { Fahrrad } from "../Models/Fahrrad";
import dbPool from "../config/db"
import { ResultSetHeader } from 'mysql2/promise';
import { DbRowToObject } from "../Util/DbRowToObject";

export class FahrradRepository 
{
    //#region save
    /**
     * Diese Methode erstellt über eine SQL-Query ein neues Fahrrad in die Datenbank.
     * @param fahrrad Das Objekt vom Typ Fahrrad.
     * @returns Promise<number | null> Ein Fahrradobjekt oder null. 
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
        VALUES(?, ?, ?, ?, ?, ?, ?)`;

        const values = [
            fahrrad.getMarke,
            fahrrad.getRahmennummer,
            fahrrad.getBesonderheiten,
            fahrrad.getBearbeitungsstatus,
            fahrrad.getErfasstAm,
            fahrrad.getErfasstVon,
            fahrrad.getHerausgegebenAn
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
    //#endregion

    //#region findFahrradById
    /**
     * Diese Methode nimmt eine ID entgegen, baut eine Verbindung zur Datenbank auf, sucht ein Objekt anhand der ID und gibt dieses zurück.
     * @param id - Die ID mir der das Objekt gesucht werden soll. 
     * @returns Promise<Fahrrad | null> - Gibt entweder das gespeicherte Fahrrad-Objekt oder null zurück.
     * @throws "Repository: Die Id darf nicht null sein!" - Wenn die ID ungültig ist wird durch den Guard ein Error geworfen.
     * @throws "Kein Fahrrad mit dieser Id gefunden!" - Wenn kein Fahrrad mit dieser ID gefunden wurde.
     * @throws "Fehler bei der Abfrage des Fahrrads in der Datenbank!" - Wird geworfen wenn es einen Fehler beim speichern in die Datenbank gab.
     */
    public async findFahrradById(id: number): Promise<Fahrrad | null>
    {
        //#region Guard
        if(!id)
        {
            throw new Error(`Repository: Die Id darf nicht null sein!`);
        }
        //#endregion

        try 
        {
            const stmt = 
            "SELECT * FROM fahrraeder WHERE `fahrrad_id` = ?";
            
            const [rows, fields] = await dbPool.execute(stmt, [id]); 

            const fahrradRows = rows as any[];

            if(fahrradRows.length === 0)
            {
                return null;
            }        

            const fahrradData: any = fahrradRows[0];
            //console.log(fahrradData); // NUR ZUM DEBUGGEN

            const rowToFahrrad = new DbRowToObject();
            const fahrrad: Fahrrad | null = rowToFahrrad.mapDbRowToFahrrad(fahrradData);

            return fahrrad;

        } catch (error)
        {
            throw new Error("Fehler bei der Abfrage des Fahrrads in der Datenbank!");
        }
    }
    //#endregion

    //#region readByString
    public async readByString(searchRow: string, searchValue: string): Promise<Fahrrad | null> 
    {
        //#region Guard
        if(!searchRow)
        {
            throw new Error(`Repository: Ungueltige Zeile bei der Uebergabe erkannt!`);
        }
        if(!searchValue)
        {
            throw new Error(`Repository: Ungueltigen Wert bei der Uebergabe erkannt!`);
        }
        //#endregion

        try
        {
            const stmt =
            `SELECT * FROM fahrraeder WHERE ? = ?`;

            const values = [searchRow, searchValue]

            const [rows, fields] = await dbPool.execute(stmt, [values]);

            const fahrradRows = rows as any[];

            if(fahrradRows.length === 0)
            {
                return null;
            }        
    
            const fahrradData: any = fahrradRows[0];
            //console.log(fahrradData); // NUR ZUM DEBUGGEN
    
            const rowToFahrrad = new DbRowToObject();
            const fahrrad: Fahrrad | null = rowToFahrrad.mapDbRowToFahrrad(fahrradData);
    
            return fahrrad;


        } catch (error)
        {
            throw new Error("Fehler bei der Abfrage des Fahrrads anhand eines Strings in der Datenbank!");
        }
        
    }
    //#endregion

    //#region findByDate
    public async findByDate(searchRow: Date, searchDate: Date): Promise<Fahrrad | null>
    {
        //#region Guard
        if(!searchDate)
        {
            throw new Error("Repository: Ungültiges Datum übergeben!");
        }
        //#endregion

        try
        {
            const stmt = "SELECT * FROM fahrraeder WHERE ? = ?";
            const value = [searchRow, searchDate];

            const [rows, fields] = await dbPool.execute(stmt, value);

            const fahrradRows = rows as any[];

            if(fahrradRows.length === 0)
            {
                return null;
            }

            const fahrradData: any = fahrradRows[0];

            const rowToFahrrad = new DbRowToObject();
            const fahrrad = rowToFahrrad.mapDbRowToFahrrad(fahrradData);

            return fahrrad;

        } catch (error)
        {
            throw new Error("Repository: Fehler beim Abfragen der Datenbank anhand eines Datums!");
        }
    }
    //#endregion
}