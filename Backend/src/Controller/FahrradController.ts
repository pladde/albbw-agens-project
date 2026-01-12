import { Fahrrad } from "../Models/Fahrrad";
import { Response, Request } from "express";
import { FahrradService } from "../Service/FahrradService";

/**
 * Der FahrradController dient als Schnittstelle zwischen der Anwendungsschicht 
 * und dem FahrradService. Er verwaltet die Logik für CRUD-Operationen (Erstellen, 
 * Lesen, Aktualisieren, Löschen) von Fahrrad-Objekten.
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
     * **Erstellt** aus dem **Fahrrad-Objekt** einen neuen Datensatz in der Datenbank.
     * Führt eine Validierung des übergebenen Objekts durch.
     * @param fahrrad Ein **Fahrrad-Objekt**, welches in die Datenbank gespeichert werden soll.
     * @returns Eine Promise, die entweder das gespeicherte Fahrrad-Objekt oder `undefined` zurückgibt, 
     * wenn der Service das Objekt nicht erstellen konnte.
     * @throws {Error} Falls das übergebene Fahrrad-Objekt `null` oder `undefined` ist, oder 
     * wenn ein Fehler während des Speichervorgangs auftritt.
     */
    public async saveFahrrad(req: Request, res: Response) : Promise<void>
    {
        try 
        {
            /* Debug
            console.log("DEBUG JSON EINTRAEGE: ",
                req.body.marke,
                req.body.rahmennummer,
                req.body.besonderheiten,
                req.body.bearbeitungstatus,
                req.body.erfasstAm,
                req.body.erfasstVon,
                req.body.herausgegebenAn
            ); */
            
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
                res.status(404).json(`Es wurde kein Objekt mit der ID: ${req.body.fahrrad_id} gefunden.`)
            }
            
        } catch (error) 
        {
            console.log(error);
            res.status(500).json({ error: "Interner Server Fehler" });
        }
    }

    /**
     * **Sucht** ein **Fahrrad** anhand seiner eindeutigen **ID**.
     * @param id Die eindeutige ID des zu suchenden Fahrrads.
     * @returns Eine Promise, die das gefundene Fahrrad-Objekt oder `undefined` zurückgibt, 
     * falls kein Fahrrad mit dieser ID existiert.
     * @throws {Error} Falls die übergebene ID `null` oder `undefined` ist.
     */
    public async findFahrradById(req: Request, res: Response) : Promise<void>
    {
        if(!req.body.fahrrad_id)
        {
            throw new Error(`Controller: Die übergebene ID zum suchen eines Fahrrads darf nicht null oder leer sein!`)
        }

        try 
        {
            const foundFahrrad = await this.fahrradService.findFahrradById(req.body.fahrrad_id);

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
     * **Sucht** ein Fahrrad anhand eines **String-Werts** in einer bestimmten **Datenbankspalte**.
     * @param searchRow Die Spalte in der Datenbanktabelle, in der gesucht werden soll (z.B. 'marke', 'rahmnenummer').
     * @param searchValue Der String-Wert, nach dem gesucht werden soll.
     * @returns Eine Promise, die das gefundene Fahrrad-Objekt oder `undefined` zurückgibt.
     * @throws {Error} Falls `searchValue` oder `searchRow` `null` oder leer sind.
     */
    public async findFahrradByString(req: Request, res: Response) : Promise<void>
    {
        if(!req.body.searchRow)
        {
            throw new Error(`Controller: Die übergebene Zeile für den String darf nicht null oder leer sein!`)
        }  
        if(!req.body.searchValue)
        {
            throw new Error(`Controller: Der übergebene Wert darf nicht null oder leer sein!`)
        }      
        
        try 
        {
            const foundFahrrad = await this.fahrradService.findFahrradByString(req.body.searchRow, req.body.searchValue);

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
     * **Sucht** ein Fahrrad anhand eines **Datumswerts** in einer bestimmten **Datenbankspalte**.
     * @param searchRow Die Spalte in der Datenbanktabelle, in der gesucht werden soll (z.B. 'kaufdatum').
     * @param date Das Datum, nach dem gesucht werden soll.
     * @returns Eine Promise, die das gefundene Fahrrad-Objekt oder `undefined` zurückgibt.
     * @throws {Error} Falls `searchRow` oder `date` `null` oder leer sind.
     */
    public async findFahrradByDate(req: Request, res: Response) : Promise<void>
    {
        if(!req.body.searchRow)
        {
            throw new Error(`Controller: Die übergebene Zeile fürs das Datum darf nicht null oder leer sein!`)
        } 
        if(!req.body.date)
        {
            throw new Error(`Controller: Das übergebene Datum darf nicht null oder leer sein!`)
        }

        try 
        {
            const result = await this.fahrradService.findFahrradByDate(req.body.searchRow, req.body.date);
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

        }
    }

    /**
     * Ruft **alle** in der Datenbank gespeicherten **Fahrräder** ab.
     * @returns Eine Promise, die ein Array von Fahrrad-Objekten oder `undefined` zurückgibt, 
     * falls keine Fahrräder gefunden wurden.
     */
    public async findAllFahrraeder(res: Response) : Promise<void>
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
        }
    }

    /**
     * **Löscht** einen **Fahrrad-Datensatz** anhand seiner eindeutigen **ID** aus der Datenbank.
     * @param id Die eindeutige ID des zu löschenden Fahrrads.
     * @returns Eine Promise, die das gelöschte Fahrrad-Objekt oder `undefined` zurückgibt, 
     * falls kein Datensatz gefunden wurde.
     * @throws {Error} Falls die übergebene ID `null` oder `undefined` ist.
     */
    public async deleteFahrradById(req: Request, res: Response) : Promise<void>
    {
        if(!req.body.fahrrad_id)
        {
            throw new Error(`Controller: Die übergebene ID zum löschen eines Datensatzes darf nicht null oder leer sein!`)
        }
        
        try
        {
            const result = await this.fahrradService.deleteFahrradById(req.body.fahrrad_id);

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

        }
    }


    public async editFahrradById(req: Request, res: Response) 
    {
        if(!req.body.)
        {

        }
    }
}