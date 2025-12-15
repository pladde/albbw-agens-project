import { error } from "console";
import { Fahrrad } from "../Models/Fahrrad";
import dbPool from "../config/db"
import { ResultSetHeader } from 'mysql2/promise';
import { RowToObject } from "../Util/RowToObject";

/** Diese Klasse stellt folgende Methoden bereit:
 * @function `async save(Fahrrad) : Promise<number | null>`
 * @function `async findFahrradById(number) : Promise<Fahrrad | undefined>`
 * @function `async findByString(string, string): Promise<Fahrrad | undefined>`
 * @function `async findByDate(string, Date): Promise<Fahrrad | undefined>`
 * @function `async findAll(): Promise<Fahrrad[] | undefined>`
 * @function `async deleteById(number) : Promise<Fahrrad | undefined>`
 */
export class FahrradRepository 
{
    /**
     * Diese Methode erstellt über eine SQL-Query ein neues Fahrrad in die Datenbank.
     * @param fahrrad Das Objekt vom Typ Fahrrad.
     * @returns Promise<number | null> Ein Fahrradobjekt oder null. 
     * @throws Wenn das Fahrradobjekt null oder leer ist wird ein Error geworfen.
     */
    public async save(fahrrad: Fahrrad) : Promise<number | null>
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

    /**
     * Diese Methode nimmt eine ID entgegen, baut eine Verbindung zur Datenbank auf, sucht ein Objekt anhand der ID und gibt dieses zurück.
     * @param id - Die ID mir der das Objekt gesucht werden soll. 
     * @returns Promise<Fahrrad | null> - Gibt entweder das gespeicherte Fahrrad-Objekt oder null zurück.
     * @throws "Repository: Die Id darf nicht null sein!" - Wenn die ID ungültig ist wird durch den Guard ein Error geworfen.
     * @throws "Kein Fahrrad mit dieser Id gefunden!" - Wenn kein Fahrrad mit dieser ID gefunden wurde.
     * @throws "Fehler bei der Abfrage des Fahrrads in der Datenbank!" - Wird geworfen wenn es einen Fehler beim speichern in die Datenbank gab.
     */
    public async findFahrradById(id: number) : Promise<Fahrrad | undefined>
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
                return undefined;
            }        

            const fahrradData: any = fahrradRows[0];
            //console.log(fahrradData); // NUR ZUM DEBUGGEN

            const rowToFahrrad = new RowToObject();
            const fahrrad: Fahrrad | undefined = rowToFahrrad.mapRowToFahrrad(fahrradData);

            return fahrrad;

        } catch (error)
        {
            throw new Error("Fehler bei der Abfrage des Fahrrads in der Datenbank!");
        }
    }

    /**
     * Liest ein einzelnes Fahrrad-Objekt aus der Datenbank, indem es nach einem **String-Wert** in einer bestimmten **Zeile (Spalte)** sucht.
     * * @param searchRow Die **Spalte** (der Datenbankzeile), in der gesucht werden soll (z.B. 'kennzeichen', 'id', 'modell').
     * @param searchValue Der **String-Wert**, nach dem in der angegebenen Spalte gesucht werden soll (z.B. 'XYZ-123', '5', 'Trekking Bike').
     * @returns Ein **Promise**, das entweder das gefundene `Fahrrad`-Objekt oder `null` zurückgibt, wenn kein Eintrag gefunden wurde.
     * @throws {Error} Wirft einen **Error**, wenn `searchRow` oder `searchValue` ungültig (null/leer) sind.
     * @throws {Error} Wirft einen **Error**, wenn bei der Datenbankabfrage ein Fehler auftritt.
     */
    public async findByString(searchRow: string, searchValue: string): Promise<Fahrrad | undefined> 
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
                return undefined;
            }        
    
            const fahrradData: any = fahrradRows[0];
            //console.log(fahrradData); // NUR ZUM DEBUGGEN
    
            const rowToFahrrad = new RowToObject();
            const fahrrad: Fahrrad | undefined = rowToFahrrad.mapRowToFahrrad(fahrradData);
    
            return fahrrad;


        } catch (error)
        {
            throw new Error("Fehler bei der Abfrage des Fahrrads anhand eines Strings in der Datenbank!");
        }
        
    }

    /**
     * Sucht ein einzelnes Fahrrad-Objekt in der Datenbank, indem es nach einem **Datumswert** in einer bestimmten **Spalte** sucht.
     * @param searchRow Die **Spalte** (der Datenbankzeile), in der nach dem Datum gesucht werden soll (z.B. 'kaufdatum', 'letzte_wartung').
     * @param searchDate Der **Datumswert** (`Date`-Objekt), nach dem in der angegebenen Spalte gesucht werden soll.
     * @returns Ein **Promise**, das entweder das gefundene `Fahrrad`-Objekt oder `null` zurückgibt, wenn kein Eintrag gefunden wurde.
     * @throws {Error} Wirft einen **Error**, wenn `searchRow` oder `searchDate` ungültig (null/leer) sind.
     * @throws {Error} Wirft einen **Error**, wenn bei der Datenbankabfrage ein Fehler auftritt.
     */
    public async findByDate(searchRow: string, searchDate: Date): Promise<Fahrrad | undefined>
    {
        //#region Guard
        if(!searchRow)
        {
            throw new Error("Repository: Ungültige Zeile übergeben!");
        }
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
                return undefined;
            }

            const fahrradData: any = fahrradRows[0];

            const rowToFahrrad = new RowToObject();
            const fahrrad = rowToFahrrad.mapRowToFahrrad(fahrradData);

            return fahrrad;

        } catch (error)
        {
            throw new Error("Repository: Fehler beim Abfragen der Datenbank anhand eines Datums!");
        }
    }
    
    public async findAll(): Promise<Fahrrad[] | undefined>
    {
        const stmt = "SELECT * FROM fahrraeder";
        
        const [rows, fields] = await dbPool.execute(stmt);

        //Es wird ein Array aus der generischen Rückgabe erstellt. Der ArrayTyp ist noch auf "any[]"
        const fahrradRows = rows as any[];

        //Das Array wird auf Gültigkeit geprüft
        if(fahrradRows.length === 0)
        {
            return undefined; //Wenn kein Inhalt in der abfrage geliefert wurde.
        }

        //Das Array muss jetzt zu einem Fahrrad[] gewandelt werden.
        //Ein Fahrrad[] muss erstellt werden
        let fahrrad: Fahrrad[] = [];
        const rowToFahrrad = new RowToObject();
        let i = 0;

        fahrradRows.forEach(element => {
            fahrrad[i] = rowToFahrrad.mapRowToFahrrad(element);
            i++;
        });

        //Die Daten des Any[] muss ins das Fahrrad[] übertragen werden.

        //Fahrrad[] zurückgeben
        return fahrrad;
    }

    public async deleteById(id: number) : Promise<Fahrrad | undefined>
    {
        if(!id) 
        {
            throw new Error("Repository: Die übergebene ID ist ungültig!");
        }

        const stmt = "DELETE FROM fahrraeder WHERE fahrrad_id = ? ";
        const value = [id];

        const [rows, fields] = await dbPool.execute(stmt, [value]);

        const fahrradRows = rows as any[];

        if(fahrradRows.length === 0)
        {
            return undefined;
        }

        const fahrradData: any = fahrradRows[0];

        const rowToFahrrad = new RowToObject();
        const fahrrad = rowToFahrrad.mapRowToFahrrad(fahrradData);

        return fahrrad;
    }
}