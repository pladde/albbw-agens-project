import { Fahrrad } from "../Models/Fahrrad";
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
    public async saveFahrrad(fahrrad: Fahrrad) : Promise<Fahrrad | undefined>
    {
        if(!fahrrad)
        {
            throw new Error(`Controller: Das Objekt ${fahrrad} darf nicht null oder leer sein!`)
        }
        
        try 
        {
            return this.fahrradService.createNewFahrrad(fahrrad);

        } catch (error) 
        {
            // Fehler vom Service abfangen und eine generische Controller-Fehlermeldung werfen
            throw new Error("Controller: Fehler bei der Verarbeitung vom Fahrrad speichern.");
        }
    }

    /**
     * **Sucht** ein **Fahrrad** anhand seiner eindeutigen **ID**.
     * @param id Die eindeutige ID des zu suchenden Fahrrads.
     * @returns Eine Promise, die das gefundene Fahrrad-Objekt oder `undefined` zurückgibt, 
     * falls kein Fahrrad mit dieser ID existiert.
     * @throws {Error} Falls die übergebene ID `null` oder `undefined` ist.
     */
    public async findFahrradById(id: number) : Promise<Fahrrad | undefined>
    {
        if(!id)
        {
            throw new Error(`Controller: Die übergebene ID zum suchen eines Fahrrads darf nicht null oder leer sein!`)
        }

        return this.fahrradService.findFahrradById(id);
    }

    /**
     * **Sucht** ein Fahrrad anhand eines **String-Werts** in einer bestimmten **Datenbankspalte**.
     * @param searchRow Die Spalte in der Datenbanktabelle, in der gesucht werden soll (z.B. 'marke', 'rahmnenummer').
     * @param searchValue Der String-Wert, nach dem gesucht werden soll.
     * @returns Eine Promise, die das gefundene Fahrrad-Objekt oder `undefined` zurückgibt.
     * @throws {Error} Falls `searchValue` oder `searchRow` `null` oder leer sind.
     */
    public async findFahrradByString(searchRow: string, searchValue: string) : Promise<Fahrrad | undefined>
    {
        if(!searchValue)
        {
            throw new Error(`Controller: Die übergebene Zeile für den String darf nicht null oder leer sein!`)
        }  
        if(!searchRow)
        {
            throw new Error(`Controller: Der übergebene Wert darf nicht null oder leer sein!`)
        }      
        
        return this.fahrradService.findFahrradByString(searchRow, searchValue);
    }

    /**
     * **Sucht** ein Fahrrad anhand eines **Datumswerts** in einer bestimmten **Datenbankspalte**.
     * @param searchRow Die Spalte in der Datenbanktabelle, in der gesucht werden soll (z.B. 'kaufdatum').
     * @param date Das Datum, nach dem gesucht werden soll.
     * @returns Eine Promise, die das gefundene Fahrrad-Objekt oder `undefined` zurückgibt.
     * @throws {Error} Falls `searchRow` oder `date` `null` oder leer sind.
     */
    public async findFahrradByDate(searchRow: string, date: Date) : Promise<Fahrrad | undefined>
    {
        if(!searchRow)
        {
            throw new Error(`Controller: Die übergebene Zeile fürs das Datum darf nicht null oder leer sein!`)
        } 
        if(!date)
        {
            throw new Error(`Controller: Das übergebene Datum darf nicht null oder leer sein!`)
        }

        return this.fahrradService.findFahrradByDate(searchRow, date);
    }

    /**
     * Ruft **alle** in der Datenbank gespeicherten **Fahrräder** ab.
     * @returns Eine Promise, die ein Array von Fahrrad-Objekten oder `undefined` zurückgibt, 
     * falls keine Fahrräder gefunden wurden.
     */
    public async findAllFahrraeder() : Promise<Fahrrad[] | undefined>
    {
        return this.fahrradService.findAllFahrrader();
    }

    /**
     * **Löscht** einen **Fahrrad-Datensatz** anhand seiner eindeutigen **ID** aus der Datenbank.
     * @param id Die eindeutige ID des zu löschenden Fahrrads.
     * @returns Eine Promise, die das gelöschte Fahrrad-Objekt oder `undefined` zurückgibt, 
     * falls kein Datensatz gefunden wurde.
     * @throws {Error} Falls die übergebene ID `null` oder `undefined` ist.
     */
    public async deleteFahrradById(id: number) : Promise<Fahrrad | undefined>
    {
        if(!id)
        {
            throw new Error(`Controller: Die übergebene ID zum löschen eines Datensatzes darf nicht null oder leer sein!`)
        }
        
        return this.fahrradService.deleteFahrradById(id);
    }
}