import { Fahrrad } from "../Models/Fahrrad";
import dbPool from "../config/db"
import { FahrradMapper } from "../Util/FahrradMapper";

/**
 * Das FahrradRepository ist die Datenzugriffsschicht (Data Access Layer - DAL).
 * Es ist direkt für die Kommunikation mit der Datenbank (via SQL-Queries) und 
 * die Konvertierung von Datenbankzeilen in `Fahrrad`-Objekte zuständig.
 * * Diese Klasse stellt folgende Methoden bereit:
 * @function `async getTableColumns(): Promise<string[]>`
 * @function `async searchFahrradMarke(marke: string): Promise<number | null>`
 * @function `async searchFahrradFarbe(farbe: string): Promise<number | null>`
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
     * Legt eine neue Marke in der Tabelle `marke` an.
     * @return die `id` der Marke. 
     */
    public async createMarke(marke: string): Promise<number> 
    {
        const [result] = await dbPool.execute('INSERT INTO marke (marke) VALUES (?)', [marke]);
        return (result as any).insertId;
    }

    /**
     * Legt eine neue Farbe in der Tabelle `farbe` an.
     * @return die `id` der Farbe. 
     */
    public async createFarbe(farbe: string): Promise<number> 
    {
        const [result] = await dbPool.execute('INSERT INTO farbe (farbe) VALUES (?)', [farbe]);
        return (result as any).insertId;
    }

    /**
     * Legt einen neuen Bearbeitungsstatus in der Tabelle `bearbeitungsstatus` an.
     * @return die `id` des Bearbeitungsstatus. 
     */
    public async createBearbeitungsstatus(bearbeitungsstatus: string): Promise <number>
    {
        const [result] = await dbPool.execute('INSERT INTO bearbeitungsstatus(bezeichnung) VALUES (?)', [bearbeitungsstatus]);
        return (result as any).insertId;
    }

    /**
     * Prüft ob die Kombination aus Farbe und Marke bereits in der fahrrad_eigenschaft vorhanden ist.
     * @return die `id` des fahrrad_eigenschaft Eintrags. 
     */
    public async getOrCreateEigenschaftId(markeId: number, farbeId: number): Promise<number>
    {
        // Prüft ob die Kombi bereits existiert
        const selectStmt = 'SELECT fahrrad_eigenschaft_id FROM fahrrad_eigenschaft WHERE marke_id = ? AND farbe_id = ?';
        const [rows] = await dbPool.query(selectStmt, [markeId, farbeId]);
        
        const existingRows = rows as any[];
        if (existingRows.length > 0) {
            return existingRows[0].fahrrad_eigenschaft_id;
        }

        // Falls nicht vorhanden wird die Eigenschaft neu anglelegt
        const insertStmt = 'INSERT INTO fahrrad_eigenschaft (marke_id, farbe_id) VALUES (?, ?)';
        const [result] = await dbPool.query(insertStmt, [markeId, farbeId]);
        return (result as any).insertId;
    }

    /**
     * Prüft ob der übergebene String (Marke) in der Tabelle "Marke" bereits existiert.
     * @return die `id` der Marke oder `undefined` wenn kein Eintrag gefunden wurde. 
     */
    public async searchFahrradMarke(marke: string): Promise<number | undefined>
    {   
        const stmt = 'SELECT marke_id FROM marke WHERE marke = ?;'

        const [rows] = await dbPool.query(stmt, [marke]);
        
        if (Array.isArray(rows) && rows.length > 0) 
        {
            const row = rows[0] as { marke_id: number };
            return row.marke_id;
        }

        return undefined;
    }

    /**
     * Prüft ob der übergebene String (Farbe) in der Tabelle "Farbe" bereits existiert.
     * @return die `id` der Farbe oder `NULL` wenn kein Eintrag gefunden wurde. 
     */
    public async searchFahrradFarbe(farbe: string): Promise<number | null>
    {   
        const stmt = 'SELECT farbe_id FROM farbe WHERE farbe = ?;'

        const [rows] = await dbPool.query(stmt, [farbe]);
        
        if (Array.isArray(rows) && rows.length > 0) 
        {
            const row = rows[0] as { farbe_id: number };
            return row.farbe_id;
        }

        return null;
    }

    /**
     * Prüft ob der übergebene String (Bearbeitungsstatus) in der Tabelle "bearbeitungsstatus" bereits existiert.
     * @return die `id` des Bearbeitungsstatus oder `NULL` wenn kein Eintrag gefunden wurde. 
     */
    public async searchFahrradBearbeitungsstatus(bearbeitungsstatus: string) : Promise<number | null>
    {
        const stmt = 'SELECT bearbeitungsstatus_id FROM bearbeitungsstatus WHERE bezeichnung = ?;'

        const [rows] = await dbPool.query(stmt, [bearbeitungsstatus]);
        
        if (Array.isArray(rows) && rows.length > 0) 
        {
            const row = rows[0] as { bearbeitungsstatus_id: number };
            return row.bearbeitungsstatus_id;
        }

        return null
    }

    /**
     * Ruft die **SpAltennamen** der Tabelle 'fahrrad' ab, um **SQL-Injection** bei dynamischen Abfragen zu **verhindern**.
     * @returns Ein Promise mit einem Array der Spaltennamen.
     */
    public async getTableColumns(): Promise<string[]> 
    {
        // Gibt nur die Namen der Tabellenspalten zurück
        const stmt = `
        SELECT column_name AS col_name, 1 AS sort_order
        FROM information_schema.columns 
        WHERE table_name = 'fahrrad' 
        AND table_schema = 'agens_fahrrad_test' 
        AND column_name = 'fahrrad_id'

        UNION ALL

        SELECT column_name AS col_name, 2 AS sort_order
        FROM information_schema.columns 
        WHERE table_name = 'marke' 
        AND table_schema = 'agens_fahrrad_test' 
        AND column_name = 'marke'

        UNION ALL

        SELECT column_name AS col_name, 3 AS sort_order
        FROM information_schema.columns 
        WHERE table_name = 'farbe' 
        AND table_schema = 'agens_fahrrad_test' 
        AND column_name = 'farbe'

        UNION ALL

        SELECT column_name AS col_name, 4 AS sort_order
        FROM information_schema.columns 
        WHERE table_name = 'fahrrad' 
        AND table_schema = 'agens_fahrrad_test' 
        AND column_name NOT IN ('fahrrad_id', 'fahrrad_eigenschaft', 'bearbeitungsstatus_id')

        UNION ALL

        SELECT 'bearbeitungsstatus' AS col_name, 5 AS sort_order
        FROM DUAL

        ORDER BY sort_order;
        `;

            const [rows]: any = await dbPool.query(stmt);

            this.tableColumns = rows.map((row: any) => row.col_name);

            return this.tableColumns;
    }
    
    /**
     * **Erstellt** über eine SQL-Query ein **neues Fahrrad** in der Datenbank.
     * Nach erfolgreicher Einfügung wird das Objekt mit der generierten ID aktualisiert und zurückgegeben.
     * @param fahrrad Das Objekt vom Typ `Fahrrad`, das gespeichert werden soll.
     * @returns Gibt das gespeicherte `Fahrrad`-Objekt (mit ID) oder `undefined` zurück.
     * @throws {Error} Wenn das `fahrrad`-Objekt fehlt oder ein Datenbankfehler auftritt.
     */
    public async save(fahrrad: Fahrrad, bearbeitungsstatusId: number | null) : Promise<Fahrrad | undefined>
    {
        //#region Guard
        if(!fahrrad)
        {
            throw new Error(`Repository: Das Objekt ${fahrrad} darf nicht null oder leer sein!`)
        }
        //#endregion

        const stmt = 
        `INSERT INTO fahrrad 
        (fahrrad_eigenschaft, rahmennummer, erfasst_am, erfasst_von, ausgegeben_an, bearbeitungsstatus_id)
        VALUES
        (?, ?, NOW(), ?, ?, ?)`;
        
        // Darf nicht undefined sein und wird falls der Wert nicht definiert wurde auf 'null' gesetzt.
        const values = [
            fahrrad.getFahrradEigenschaftId(),
            fahrrad.getRahmennummer(),
            fahrrad.getErfasstVon(),
            fahrrad.getHerausgegebenAn(),
            bearbeitungsstatusId
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
    public async findById(id: number) : Promise<Fahrrad | undefined>
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
            
            const [result] = await dbPool.query(stmt, [id]); 

            const fahrradRows = result as any[];

            if(fahrradRows.length === 0)
            {
                return undefined;
            }        

            const fahrradData: any = fahrradRows[0];
            //console.log(fahrradData); // NUR ZUM DEBUGGEN

            const mapFahrrad = new FahrradMapper();

            return mapFahrrad.mapFahrrad(fahrradData);

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

            const [result] = await dbPool.query(stmt, [searchValue]);

            const fahrradRows = result as any[];

            if(fahrradRows.length === 0)
            {
                return undefined;
            }        
    
            const fahrradData: any = fahrradRows[0];
            //console.log(fahrradData); // NUR ZUM DEBUGGEN
            const rowToFahrrad = new FahrradMapper();

            const fahrradList = fahrradRows.map(row => rowToFahrrad.mapFahrrad(row))
    
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

            const [result] = await dbPool.query(stmt, [searchDate]);

            const fahrradRows = result as any[];

            if(fahrradRows.length === 0)
            {
                return undefined;
            }        
    
            //console.log(fahrradData); // NUR ZUM DEBUGGEN
            const rowToFahrrad = new FahrradMapper();

            const fahrradList = fahrradRows.map(row => rowToFahrrad.mapFahrrad(row))
    
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
    public async findAll(page: number): Promise<any[] | undefined>
    {
        try 
        {
            const limit = 100;
            const pageNum = isNaN(page) ? 0 : page;
            const offset = pageNum * limit;

            const stmt = 'SELECT * FROM fahrrad ORDER BY fahrrad_id DESC LIMIT ? OFFSET ?';
            const [allResults] = await dbPool.query(stmt, [limit, offset]);
    
            const resultList = allResults as any[];
    
            //Das Array wird auf Gültigkeit geprüft
            if(resultList.length === 0)
            {
                return undefined; //Wenn kein Inhalt in der abfrage geliefert wurde.
            }
    
            return resultList || [];

        } catch (error)
        {
            console.log(error);
        }
    }

    public async findAllWithAttributes(page: number)
    {
        try 
        {
            const limit = 100;
            const pageNum = isNaN(page) ? 0 : page;
            const offset = pageNum * limit;

            const stmt = `
            SELECT fahrrad.fahrrad_id, fahrrad.rahmennummer, 
            marke.marke, 
            farbe.farbe, 
            fahrrad.erfasst_am, fahrrad.erfasst_von, fahrrad.ausgang_am, fahrrad.ausgegeben_an, 
            bearbeitungsstatus.bezeichnung AS bearbeitungsstatus 
            
            FROM fahrrad
            LEFT JOIN fahrrad_eigenschaft ON fahrrad.fahrrad_eigenschaft = fahrrad_eigenschaft.fahrrad_eigenschaft_id
            LEFT JOIN marke ON fahrrad_eigenschaft.marke_id = marke.marke_id
            LEFT JOIN farbe ON fahrrad_eigenschaft.farbe_id = farbe.farbe_id
            LEFT JOIN bearbeitungsstatus ON fahrrad.bearbeitungsstatus_id = bearbeitungsstatus.bearbeitungsstatus_id

            ORDER BY fahrrad_id 
            DESC 
            LIMIT ? OFFSET ?`;
            const [allResults] = await dbPool.query(stmt, [limit, offset]);
    
            const resultList = allResults as any[];
    
            //Das Array wird auf Gültigkeit geprüft
            if(resultList.length === 0)
            {
                return undefined; //Wenn kein Inhalt in der abfrage geliefert wurde.
            }
    
            return resultList || [];

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
        console.log("REPO LAYER WIRD ERREICHT");

        if(!fahrrad_id) 
        {
            throw new Error("Repository: Die übergebene ID ist ungültig!");
        }

        const stmt = 'DELETE FROM fahrrad WHERE fahrrad_id = ?';

        const [rows] = await dbPool.execute(stmt, [fahrrad_id]);
        
        const result = rows as any;

        if(result.affectedRows === 0)
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
    public async updateFahrradById(fahrrad_id: number, fahrrad: Fahrrad): Promise<any> {
        // #region Guard
        if (!fahrrad_id) {
            throw new Error("Repository Fehler: Die ID zum Editieren darf nicht null oder leer sein.");
        }
        if (!fahrrad) {
            throw new Error("Repository Fehler: Das Fahrrad-Objekt zum Editieren darf nicht null oder leer sein.");  
        }
        //#endregion

        try 
        {
            const stmt = `
                UPDATE fahrrad 
                SET marke = ?, rahmennummer = ?, farbe = ?, bearbeitungsstatus = ?
                WHERE fahrrad_id = ?;
            `;

            const values = [
                fahrrad.getMarke(),
                fahrrad.getRahmennummer(),
                fahrrad.getFarbe(),
                fahrrad.getBearbeitungsstatus(),
                fahrrad_id

            ];

            const [result] = await dbPool.execute(stmt, values);
            
            return result;

        } catch (error) {
            console.error("Repository Fehler (updateFahrradById):", error);
            throw error;
        }
    }
}