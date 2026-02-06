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
 * @function `async save(fahrrad: Fahrrad) : Promise<Fahrrad | undefined>`
 * @function `async findFahrradById(id: number) : Promise<Fahrrad | undefined>`
 * @function `async findByString(column: string, value: string): Promise<any[] | undefined>`
 * @function `async findByDate(column: string, date: Date): Promise<any[] | undefined>`
 * @function `async findAll(): Promise<any[] | undefined>`
 * @function `async deleteById(id: number) : Promise<any[] | undefined>`
 * @function `async editById(id: number, column: string, value: any) : Promise<any[] | undefined>`
 */
export class FahrradRepository 
{
    private tableColumns: string[] = [];

    /**
     * Ruft die **Spaltennamen** der Tabelle 'fahrrad' ab, um **SQL-Injection** bei dynamischen Abfragen zu **verhindern**.
     * @returns Ein Promise mit einem Array der Spaltennamen.
     */
    public async getTableColumns(): Promise<string[]> 
    {
        // Gibt nur die Namen der Tabellenspalten zurück
        const stmt = `
            SELECT column_name
            FROM information_schema.columns 
            WHERE table_name = 'fahrrad' 
            ORDER BY ordinal_position
            `;

            const [rows]: any = await dbPool.execute(stmt);

            this.tableColumns = rows.map((row: any) => row.column_name);

            return this.tableColumns;
    }
    
    /**
     * **Erstellt** über eine SQL-Query ein **neues Fahrrad** in der Datenbank.
     * Nach erfolgreicher Einfügung wird das Objekt mit der generierten ID aktualisiert und zurückgegeben.
     * @param fahrrad Das Objekt vom Typ `Fahrrad`, das gespeichert werden soll.
     * @returns Gibt das gespeicherte `Fahrrad`-Objekt (mit ID) oder `undefined` zurück.
     * @throws {Error} Wenn das `fahrrad`-Objekt fehlt oder ein Datenbankfehler auftritt.
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
     * **Sucht** ein spezifisches Fahrrad anhand seiner **eindeutigen ID**.
     * @param id Die ID des gesuchten Fahrrads. 
     * @returns Ein Promise, das entweder das gefundene `Fahrrad`-Objekt oder `undefined` zurückgibt.
     * @throws {Error} Wenn die ID ungültig ist oder ein Datenbankfehler auftritt.
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
     * **Sucht nach** allen Fahrrädern, die in einer bestimmten Spalte einen bestimmten **String-Wert** aufweisen.
     * @param searchRow Die Spalte, in der gesucht werden soll (z.B. 'marke').
     * @param searchValue Der Wert, nach dem gefiltert wird.
     * @returns Ein Promise mit einem **Array** von `Fahrrad`-Objekten oder `undefined`, wenn keine Treffer gefunden wurden.
     * @throws {Error} Wenn die Spalte ungültig ist oder Parameter fehlen.
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
     * **Sucht nach** allen Fahrrädern, die in einer **Datumsspalte** den angegebenen Wert aufweisen.
     * @param searchRow Die Datumsspalte (z.B. 'erfasstAm').
     * @param searchDate Das Datum, nach dem gesucht wird.
     * @returns Ein Promise mit einem **Array** von `Fahrrad`-Objekten oder `undefined`.
     * @throws {Error} Wenn die Spalte ungültig ist oder Parameter fehlen.
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
     * Ruft **alle Datensätze** aus der Tabelle 'fahrrad' ab.
     * @returns Ein Promise mit einem Array der rohen Datensätze (`any[]`) oder `undefined`.
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
     * **Löscht** ein Fahrrad anhand seiner **ID** aus der Datenbank.
     * @param fahrrad_id Die ID des zu löschenden Fahrrads.
     * @returns Ein Promise mit dem Ergebnis der Datenbankoperation oder `undefined`, falls nichts gelöscht wurde.
     * @throws {Error} Wenn die ID fehlt.
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

    /**
     * Editiert Daten in einem Datensatz.
     * @param id Die ID des zu editierenden Objektes.
     * @param column Die zu editierende Zeile des Objektes.
     * @param value Der neue Datenfeldwert.
     * @returns Gibt das editierte Objekt als Any-Array zurück und undefined falls das Array leer ist.
     * @throws Falls die übergebene ID oder die übergebene Zeile leer ist, wird ein Error geworfen.
     * @throws Bei einem Fehler in der Datenbank wird der Fehler geworfen.
     */
    public async editById(id: number, column: string, value: any) : Promise<any[] | undefined>
    {
        // #region Guard
        if (!id)
        {
            throw new Error("Repository Fehler: Die ID zum editieren darf nicht null oder leer sein.");
        }
        if(!column)
        {
            throw new Error("Repository Fehler: Die Zeile zum editieren darf nicht null oder leer sein.");  
        }
        //#endregion

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

            if (!result) 
            {
                return undefined;
            }

            return result;

        } catch (error)
        {
            console.log("Fehler: " + error);
        }
    }
}