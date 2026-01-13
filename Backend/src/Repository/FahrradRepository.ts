import { Fahrrad } from "../Models/Fahrrad";
import dbPool from "../config/db"
import { RowToObject } from "../Util/RowToObject";
import { Pool } from 'mysql2/promise';
import { error } from "node:console";

/**
 * Das FahrradRepository ist die Datenzugriffsschicht (Data Access Layer - DAL).
 * Es ist direkt für die Kommunikation mit der Datenbank (via SQL-Queries) und 
 * die Konvertierung von Datenbankzeilen in `Fahrrad`-Objekte zuständig.
 * * Diese Klasse stellt folgende Methoden bereit:
 * @function `async save(Fahrrad) : Promise<Fahrrad | undefined>`
 * @function `async findFahrradById(number) : Promise<Fahrrad | undefined>`
 * @function `async findByString(string, string): Promise<Fahrrad | undefined>`
 * @function `async findByDate(string, Date): Promise<Fahrrad | undefined>`
 * @function `async findAll(): Promise<Fahrrad[] | undefined>`
 * @function `async deleteById(number) : Promise<Fahrrad | undefined>`
 */
export class FahrradRepository 
{
    private allowedColumns: string[] = [];

    private async getTableColumns(): Promise<string[]> 
    {
        if (this.allowedColumns.length > 0)
        {
            return this.allowedColumns;
        }

        const stmt = `
            SELECT column_name 
            FROM information_schema.columns 
            WHERE table_name = 'fahrrad' 
            ORDER BY ordinal_position;
            `;

            const [rows]: any = await dbPool.execute(stmt);

            this.allowedColumns = rows.map((row: any) => row.COLUMN_NAME);

            return this.allowedColumns;
    }

    /**
     * Diese Methode **erstellt** über eine SQL-Query ein **neues Fahrrad** in die Datenbank.
     * Nach erfolgreicher Einfügung wird das neu erstellte Objekt zurückgegeben (mit der automatisch generierten ID).
     * @param fahrrad Das Objekt vom Typ `Fahrrad`, das gespeichert werden soll.
     * @returns Gibt über ein **Promise** entweder das gespeicherte `Fahrrad`-Objekt (mit ID) oder `undefined` zurück, wenn kein Datensatz verarbeitet wurde.
     * @throws {Error} Wird geworfen, wenn das `fahrrad`-Objekt `null` oder `undefined` ist.
     * @throws {Error} Wird geworfen, wenn bei der Datenbankoperation ein Fehler auftritt.
     */
    public async save(fahrrad: Fahrrad) : Promise<Fahrrad | undefined>
    {
        //#region Guard
        if(!fahrrad)
        {
            throw new Error(`Repository: Das Objekt ${fahrrad} darf nicht null oder leer sein!`)
        }
        //#endregion

        const stmt = 
        `INSERT INTO fahrrad (marke, rahmennummer, besonderheiten, bearbeitungsstatus, erfasstAm, erfasstVon, herausgegebenAn)
        VALUES(?, ?, ?, ?, ?, ?, ?)`;

        // Darf nicht undefined sein und wird falls der Wert nicht definiert wurde auf 'null' gesetzt.
        const values = [
            fahrrad.getMarke(),
            fahrrad.getRahmennummer(),
            fahrrad.getBesonderheiten(),
            fahrrad.getBearbeitungsstatus(),
            fahrrad.getErfasstAm(),
            fahrrad.getErfasstVon(),
            fahrrad.getHerausgegebenAn()
        ].map(val => val === undefined ? null : val);

        try 
        {
            const [result] = await dbPool.execute(stmt, values);
  
            const insertResult = result as any;

            console.log(`Neues Fahrrad unter der ID "${insertResult.insertId}" erfolgreich gespeichert.`);
            fahrrad.setFahrradId(parseInt(insertResult.insertId));

            // DEBUG
            console.log("Fahrrad ID: " + fahrrad.getFahrradId());
            if(fahrrad.getFahrradId() != null || fahrrad.getFahrradId() != undefined)
            {
                console.log(`Dem Objekt wurde erfolgreich die ID "${fahrrad.getFahrradId()}" hinzugefügt..`);
            }

            return fahrrad;
            
        } catch (error)
        {
            console.log("Fehler: ", error)
            throw new Error("Fehler beim Speichern des Fahrrads in der Datenbank.");
        }
    }

    /**
     * Diese Methode nimmt eine ID entgegen, baut eine Verbindung zur Datenbank auf, sucht ein Objekt anhand der ID und gibt dieses zurück.
     * @param id Die ID, mit der das Objekt gesucht werden soll. 
     * @returns Ein **Promise**, das entweder das gefundene `Fahrrad`-Objekt oder `undefined` zurückgibt, wenn kein Eintrag gefunden wurde.
     * @throws {Error} Wird geworfen, wenn die ID ungültig (`null` oder `undefined`) ist.
     * @throws {Error} Wird geworfen, wenn bei der Datenbankabfrage ein Fehler auftritt.
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
            "SELECT * FROM fahrrad WHERE `fahrrad_id` = ?";
            
            const [result] = await dbPool.execute(stmt, [id]); 

            const fahrradRows = result as any[];

            if(fahrradRows.length === 0)
            {
                return undefined;
            }        

            const fahrradData: any = fahrradRows[0];
            //console.log(fahrradData); // NUR ZUM DEBUGGEN

            const rowToFahrrad = new RowToObject();

            return rowToFahrrad.mapRowToFahrrad(fahrradData);

        } catch (error)
        {
            throw new Error("Fehler bei der Abfrage des Fahrrads in der Datenbank!" + error);
        }
    }

    /**
     * Liest ein einzelnes Fahrrad-Objekt aus der Datenbank, indem es nach einem **String-Wert** in einer bestimmten **Spalte** sucht.
     * @param searchRow Die **Spalte** (der Datenbankzeile), in der gesucht werden soll (z.B. 'marke', 'rahmennummer').
     * @param searchValue Der **String-Wert**, nach dem in der angegebenen Spalte gesucht werden soll (z.B. 'CANYON', '12345').
     * @returns Ein **Promise**, das entweder das gefundene `Fahrrad`-Objekt oder `undefined` zurückgibt, wenn kein Eintrag gefunden wurde.
     * @throws {Error} Wirft einen **Error**, wenn `searchRow` oder `searchValue` ungültig (null/leer) sind.
     * @throws {Error} Wirft einen **Error**, wenn bei der Datenbankabfrage ein Fehler auftritt.
     */
    public async findByString(searchRow: string, searchValue: string): Promise<any[] | undefined> 
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
            const allowedColumns = await this.getTableColumns();

            if(!allowedColumns.includes(searchRow))
            {
                throw new Error("Ungültiger Spaltenname");
            }

            const stmt =
            `SELECT * FROM fahrrad WHERE \`${searchRow}\` = ?`;

            const [result] = await dbPool.execute(stmt, [searchValue]);

            const fahrradRows = result as any[];

            if(fahrradRows.length === 0)
            {
                return undefined;
            }        
    
            const fahrradData: any = fahrradRows[0];
            //console.log(fahrradData); // NUR ZUM DEBUGGEN
            const rowToFahrrad = new RowToObject();

            const fahrradList = fahrradRows.map(row => rowToFahrrad.mapRowToFahrrad(row))
    
            //return rowToFahrrad.mapRowToFahrrad(fahrradData);
            return fahrradList;

        } catch (error)
        {
            console.log(error);
        }
    }

    /**
     * Sucht ein einzelnes Fahrrad-Objekt in der Datenbank, indem es nach einem **Datumswert** in einer bestimmten **Spalte** sucht.
     * @param searchRow Die **Spalte** (der Datenbankzeile), in der nach dem Datum gesucht werden soll (z.B. 'erfasstAm').
     * @param searchDate Der **Datumswert** (`Date`-Objekt), nach dem in der angegebenen Spalte gesucht werden soll.
     * @returns Ein **Promise**, das entweder das gefundene `Fahrrad`-Objekt oder `undefined` zurückgibt, wenn kein Eintrag gefunden wurde.
     * @throws {Error} Wirft einen **Error**, wenn `searchRow` oder `searchDate` ungültig (null/leer) sind.
     * @throws {Error} Wirft einen **Error**, wenn bei der Datenbankabfrage ein Fehler auftritt.
     */
    public async findByDate(searchRow: string, searchDate: Date): Promise<any[] | undefined>
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
            const allowedColumns = await this.getTableColumns();

            if(!allowedColumns.includes(searchRow))
            {
                throw new Error("Ungültiger Spaltenname");
            }

            const stmt =
            `SELECT * FROM fahrrad WHERE \`${searchRow}\` = ?`;

            const [result] = await dbPool.execute(stmt, [searchDate]);

            const fahrradRows = result as any[];

            if(fahrradRows.length === 0)
            {
                return undefined;
            }        
    
            //console.log(fahrradData); // NUR ZUM DEBUGGEN
            const rowToFahrrad = new RowToObject();

            const fahrradList = fahrradRows.map(row => rowToFahrrad.mapRowToFahrrad(row))
    
            //return rowToFahrrad.mapRowToFahrrad(fahrradData);
            return fahrradList;

        } catch (error)
        {
            console.log(error);
        }
    }
    
    /**
     * Sucht **alle** Fahrrad-Objekte in der Datenbank und wandelt die Antwort direkt in ein Array von `Fahrrad`-Objekten um.
     * @returns Ein **Promise**, das ein Array von `Fahrrad`-Objekten (`Fahrrad[]`) zurückgibt. `undefined` wird zurückgegeben, wenn keine Einträge gefunden wurden.
     * @throws {Error} Wird geworfen, wenn bei der Datenbankabfrage ein Fehler auftritt.
     */
    public async findAll(): Promise<any[] | undefined>
    {
        try 
        {
            const stmt = "SELECT * FROM fahrrad";
        
            const [allResults] = await dbPool.execute(stmt);
    
            const resultList = allResults as any[];
    
            //Das Array wird auf Gültigkeit geprüft
            if(resultList.length === 0)
            {
                return undefined; //Wenn kein Inhalt in der abfrage geliefert wurde.
            }
    
            return resultList;

        } catch (error)
        {
            console.log(error);
        }
    }

    /**
     * **Löscht** einen **Datensatz** eines Fahrrad-Objektes anhand der **ID**.
     * @param id Die ID des zu löschenden Fahrrad-Objektes.
     * @returns Gibt ein **Promise** zurück. Die aktuelle Implementierung gibt das Ergebnis der Datenbankoperation (z.B. betroffene Zeilen) zurück. Idealerweise sollte das *gelöschte* `Fahrrad`-Objekt oder `undefined` zurückgegeben werden.
     * @throws {Error} Falls die übergebene ID ungültig ist.
     */
    public async deleteById(fahrrad_id: number) : Promise<any[] | undefined>
    {
        if(!fahrrad_id) 
        {
            throw new Error("Repository: Die übergebene ID ist ungültig!");
        }

        const stmt = "DELETE FROM fahrrad WHERE fahrrad_id = ? ";
        const value = [fahrrad_id];

        const [rows] = await dbPool.execute(stmt, [value]);
        
        const result = rows as any[];

        if(result.length === 0)
        {
            return undefined;
        }

        return result;
    }

    public async editById(id: number, column: string, value: any) : Promise<any[] | undefined>
    {
        if (!id)
        {
            throw new Error("Repository Fehler: Die ID zum editieren darf nicht null oder leer sein.");
        }

        try
        {
        const allowedColumns = await this.getTableColumns();

        if(!allowedColumns.includes(column))
        {
            throw new Error("Ungültiger Spaltenname");
        }

        const stmt = 
        `UPDATE fahrrad SET ${column} = ? WHERE fahrrad_id = ?`;

        const result = await dbPool.execute(stmt, value); 

        return result;

        } catch (error)
        {
            console.log("Fehler: " + error);
        }

    }
}