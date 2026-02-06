import { Fahrrad } from "../Models/Fahrrad";
import { Response, Request } from "express";
import { FahrradService } from "../Service/FahrradService";

/**
 * Der FahrradController dient als Schnittstelle zwischen der Anwendungsschicht 
 * und dem FahrradService. Er verwaltet die Logik für CRUD-Operationen (Erstellen, 
 * Lesen, Aktualisieren, Löschen) von Fahrrad-Objekten über HTTP-Schnittstellen.
 * * Diese Klasse stellt folgende Methoden bereit:
 * @function `async saveFahrrad(req: Request, res: Response) : Promise<void>`
 * @function `async findFahrradById(req: Request, res: Response) : Promise<void>`
 * @function `async findFahrradByString(req: Request, res: Response) : Promise<void>`
 * @function `async findFahrradByDate(req: Request, res: Response) : Promise<void>`
 * @function `async findAllFahrraeder(req: Request, res: Response) : Promise<void>`
 * @function `async deleteFahrradById(req: Request, res: Response) : Promise<void>`
 * @function `async editFahrradById(req: Request, res: Response) : Promise<void>`
 */
export class FahrradController
{
    /**
     * Die Instanz des FahrradService zur Durchführung der eigentlichen Geschäftslogik.
     * @private
     * @readonly
     */
    private readonly fahrradService: FahrradService;

    /**
     * Erstellt eine Instanz des FahrradControllers.
     * @param fahrradService Der zu verwendende FahrradService (Dependency Injection).
     */
    constructor(fahrradService: FahrradService) {
        this.fahrradService = fahrradService;
    }

    /**
     * Ließt alle **Nichtschlüssel-Merkmale** aus und gibt sie als `JSON`-Objekt zurück.
     * @param res Die Express **Response** (sendet Status 200 bei Erfolg oder 404/500 bei Fehlern)
     */
    public async getTableColumns (req: Request, res: Response) : Promise<void>
    {
        try 
        {
            const columns: string[] = await this.fahrradService.getTableColumns();

            if(columns.length > 0)
            {
                res.status(200).json(columns);
            }
            else 
            {
                res.status(404).json(`Es wurden keine Nichtschlüssel-Merkmale gefunden.`)
            }
        } catch (error) 
        {
            console.log(error);
            res.status(500).json({ error: "Interner Server Fehler" });
        }
    }

    /**
     * **Erstellt** aus den Daten im Request-Body einen neuen Datensatz in der Datenbank.
     * @param req Der Express **Request** (erwartet Fahrrad-Attribute im Body).
     * @param res Die Express **Response** (sendet Status 200 bei Erfolg oder 404/500 bei Fehlern).
     * @returns Ein Promise vom Typ `void`.
     */
    public async saveFahrrad(req: Request, res: Response) : Promise<void>
    {
        try 
        {
            let fahrrad = new Fahrrad({
                marke: req.body.marke,
                rahmennummer: req.body.rahmennummer,
                besonderheiten: req.body.besonderheiten,
                bearbeitungsstatus: req.body.bearbeitungsstatus,
                erfasstAm: req.body.erfasstAm,
                erfasstVon: req.body.erfasstVon,
                herausgegebenAn: req.body.herausgegebenAn
        });
            
            const newBike = await this.fahrradService.createNewFahrrad(fahrrad);

            if(newBike != undefined || newBike != null) 
            {
                res.status(200).json(newBike);
            }
            else
            {
                res.status(404).json(`Es wurde kein Objekt erstellt.`)
            }
            
        } catch (error) 
        {
            console.log(error);
            res.status(500).json({ error: "Interner Server Fehler" });
        }
    }

    /**
     * **Sucht** ein **Fahrrad** anhand seiner eindeutigen **ID** aus dem Request-Body.
     * @param req Der Express **Request** (erwartet `id` im Body).
     * @param res Die Express **Response** (sendet das Objekt oder Status 404).
     * @description
     * Falls die `id` fehlt, wird ein Status **400 (Bad Request)** gesendet.
     * Falls kein Fahrrad gefunden wird, sollte ein Status **404 (Not Found)** folgen.
     */
    public async findFahrradById(req: Request, res: Response) : Promise<void>
    {
        //#region Guard
        if(!req.params.id)
        {
            res.status(400).json({ error: "id ist ein Pflichtfeld!"}); // 404 = Bad Request
        }
        //#endregion

        try 
        {
            const foundFahrrad = await this.fahrradService.findFahrradById(parseInt(req.params.id));

            if(foundFahrrad == undefined)
            {
                console.log("Keinen Eintrag gefunden!");
                res.status(404).json(null);
            }
            else
            {
                res.status(200).json(foundFahrrad);
            }

        } catch (error)
        {
            console.log(error);
            res.status(500).json({ error: "Interner Server Fehler" });
        }
    }

    /**
     * **Sucht** ein oder mehrere Fahrräder anhand eines **String-Werts** in einer Spalte.
     * @param req Der Express **Request** (erwartet `searchRow` und `searchValue` im Body).
     * @param res Die Express **Response** (sendet Array oder Status 404).
     * @description 
     * Falls die `col` oder der `val` fehlt, wird ein Status **404 (Bad Request)** gesendet.
     * Falls kein Fahrrad gefunden wird, sollte ein Status *400* (Not Found)** folgen.
     */
    public async findFahrradByString(req: Request, res: Response) : Promise<void>
    {
        //#region Guard
        if(!req.params.col)
        {
            res.status(400).json({ error: "col ist ein Pflichtfeld!"});
        }  
        if(!req.params.val)
        {
            res.status(400).json({ error: "val ist ein Pflichtfeld!"});
        }      
        //#endregion
        
        try 
        {
            const foundFahrrad = await this.fahrradService.findFahrradByString(req.params.col, req.params.val);

            if(foundFahrrad == undefined)
            {
                console.log("Keinen Eintrag gefunden!");
                res.status(404).json(null);
            }
            else
            {
                res.status(200).json(foundFahrrad);
            }

        } catch (error)
        {
            console.log(error);
            res.status(500).json({ error: "Interner Server Fehler" });
        }
    }

    /**
     * **Sucht** Fahrräder anhand eines **Datumswerts** in einer bestimmten Spalte.
     * @param req Der Express **Request** (erwartet `searchRow` und `date` im Body).
     * @param res Die Express **Response**.
     * @description
     * Falls die `col` oder das `date` fehlt, wird ein Status **400 (Bad Request)** gesendet.
     * Falls kein Fahrrad gefunden wird, sollte ein Status **404 (Not Found)** folgen.
     */
    public async findFahrradByDate(req: Request, res: Response) : Promise<void>
    {
        //#region Guard
        if(!req.params.col)
        {
            res.status(400).json({ error: "column ist ein Pflichtfeld!"});
        } 
        if(!req.params.date)
        {
            res.status(400).json({ error: "date ist ein Pflichtfeld!"});
        }
        //#endregion

        try 
        {
            const date = new Date(req.params.date);

            const result = await this.fahrradService.findFahrradByDate(req.params.col, date);
            if(result == undefined)
            {
                console.log("Keinen Eintrag gefunden!");
                res.status(404).json(null);
            }
            else
            {
                res.status(200).json({result});
            }

        } catch(error)
        {
            console.log(error);
            res.status(500).json({ error: "Interner Server Fehler" });
        }
    }

    /**
     * Ruft **alle** in der Datenbank gespeicherten **Fahrräder** ab.
     * @param req Der Express **Request**.
     * @param res Die Express **Response** (sendet ein Array aller Fahrräder).
     * @description
     * Falls kein Fahrrad gefunden wird, sollte ein Status **404 (Not Found)** folgen.
     */
    public async findAllFahrraeder(req: Request, res: Response) : Promise<void>
    {
        try 
        {
            const allResults = await this.fahrradService.findAllFahrrader();

            if(allResults == undefined) 
            {
                console.log("Keinen Eintrag gefunden!");
                res.status(404).json(null);
            }
            else
            {
                res.status(200).json(allResults);
            }

        } catch (error)
        {
            console.log(error);
            res.status(500).json({ error: "Interner Server Fehler" });
        }
    }

    /**
     * **Löscht** einen **Fahrrad-Datensatz** anhand seiner ID aus der Datenbank.
     * @param req Der Express **Request** (erwartet `id` im Body).
     * @param res Die Express **Response**.
        * @description
     * Falls die `id` fehlt, wird ein Status **400 (Bad Request)** gesendet.
     * Falls kein Fahrrad gefunden wird, sollte ein Status **404 (Not Found)** folgen.
     */
    public async deleteFahrradById(req: Request, res: Response) : Promise<void>
    {
        //#region Guard
        if(!req.params.id)
        {
            res.status(400).json({ error: "id ist ein Pflichtfeld!"});
        }
        //#endregion
        
        try
        {
            const result = await this.fahrradService.deleteFahrradById(parseInt(req.params.id));

            if (result === undefined) 
            {
                console.log("Keinen Eintrag gefunden!");
                res.status(404).json(null);
            } 
            else
            {
                res.status(200).json(result)
            }

        } catch (error)
        {
            console.log(error);
            res.status(500).json({ error: "Interner Server Fehler" });
        }
    }

    /**
     * **Aktualisiert** ein spezifisches Feld eines Fahrrad-Datensatzes.
     * @param req Der Express **Request** (erwartet `id`, `column` und `value` im Body).
     * @param res Die Express **Response** (Status 200 bei Erfolg, 404 falls keine Änderung möglich).
     * @description
     * Falls die `id` oder `col` fehlt, wird ein Status **400 (Bad Request)** gesendet.
     * Falls kein Fahrrad gefunden wird, sollte ein Status **404 (Not Found)** folgen.
     */
    public async editFahrradById(req: Request, res: Response) : Promise<void>
    {
        //#region Guard
        if(!req.params.id)
        {
            res.status(400).json({ error: "id ist ein Pflichtfeld." });
        }
        if(!req.params.col)
        {
            res.status(400).json({ error: "col ist ein Pflichtfeld." });
        }
        //#endregion

        try
        {
            const result = await this.fahrradService.editFahrradById(parseInt(req.params.id), req.params.col, req.params.val);

            if (result === undefined) 
            {
                console.log("Es konnten keine Änderungen vorgenommen werden!");
                res.status(404).json(null);
            } 
            else
            {
                res.status(200).json(result)
            }

        } catch (error)
        {
            console.log(error);
            res.status(500).json({ error: "Interner Server Fehler" });
        }
    }
}