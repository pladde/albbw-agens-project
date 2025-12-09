import { Fahrrad } from "../Models/Fahrrad";
import { FahrradRepository } from "../Repository/FahrradRepository";

export class FahrradService 
{
    /**
     * Diese Methode prüft ob das Fahrrad gültige Werte hat, übergibt das Fahrrad-Objekt
     * zur weiteren Verarbeitung an die Repository und gibt das erfolgreich gespeicherte Objekt zurück. 
     * @param fahrrad - Nimmt das Fahrrad-Objekt entgegen.
     * @returns Promise<Fahrrad | null> - Gibt entweder das gespeicherte Fahrrad-Objekt oder null zurück.
     * @throws Service: Das Objekt ${fahrrad} darf nicht null oder leer sein! - Wenn das Objekt ungültig ist wird durch den Guard ein Error geworfen.
     * @throws "Service: Fehler beim Aufrufen der Repository!" - wird geworfen wenn es einen Fehler beim speichern in dem Repositorylayer gab.
     */
    public async createNewFahrrad(fahrrad: Fahrrad): Promise<Fahrrad | null>
    {
        if(!fahrrad)
        {
            throw new Error(`Service: Das Objekt ${fahrrad} darf nicht null oder leer sein!`)
        }

        let result: Fahrrad | null;

        try 
        {
            const repo = new FahrradRepository;
            const id = await repo.save(fahrrad);

            if(id != null)
            {
                // Ließt das Objekt anhand der Id aus und speichert es in die Variable zur Rückgabe.
                result = await this.readFahrradById(id);
            }
            else
            {
                result = null;
            }  

        } catch (error) 
        {
            console.log("Service: Fehler beim Aufrufen der Repository!");
            result = null;
        }

        return result;
    }

    /**
     * Diese Methode nimmt eine ID entgegen, ruft den Repository-Layer auf und übergibt diesen die ID zur Suche nach dem gewünschten Objekt.
     * @param id - Die ID mit der das Objekt in der Datenbank gesucht wird.
     * @returns Promise<Fahrrad | null> - Wenn ein Objekt gefunden wurde wird es zurückgegeben. Wenn nicht wird NULL zurückgegeben. 
     * @throws "Service: Die Id darf nicht null sein!" - Wenn eine ungültige ID übergeben wird die entweder NULL, 0 oder negativ ist wird dieser Error vom Guard geworfen.
     * @throws "Service: Fehler beim Aufrufen des Fahrrads anhand der Id!" - Wenn es einen Fehler beim aufrufen des Repository-Layers gibt, wird dieser Error geworfen.
     */
    public async readFahrradById(id: number) : Promise<Fahrrad | null>
    {
        if(id == null || id <= 0)
        {
            //console.log("DEBUG_SERVICE: ID: " + id);
            throw new Error ('Service: Die Id darf nicht null sein!');
        }

        let result: Fahrrad | null;

        try 
        {
            const repo = new FahrradRepository;

            result = await repo.findFahrradById(id);

        } catch (error)
        {
            throw new Error("Service: Fehler beim Aufrufen des Fahrrads anhand der Id!");
        }

        return result;
    }

    /**
     * Diese Methode übergibt dem Repository-Layer zwei Strings zum dynamischen durchsuchen der Datenbank wie zB Zeile und Wert in kombination.
     * @param searchRow - Die zu durchsuchende **Zeile** (zB Marke, Rahmenummer etc.)
     * @param searchValue - Die zu suchenden **Datenwerte** (zB "CANYON, CUBE, DIAMANT, etc.")
     * @returns `Promise<Fahrrad | null>` - Gibt das gefundene `Fahrrad-Objekt` zurück. `NULL` falls keins gefunden wurde.
     * @throws {Error} - Wenn keine gültige Zeile übergeben wurde, wirft der Guard einen Error.
     * @throws {Error} - Wenn kein gültiger Wert übergeben wurde, wirft der Guard einen Error.
     * @throws {Error} - Wenn es zu einem unerwareteten Fehler beim 
     * aufrufen der Repository kommt, wird ein Error geworfen.
     */
    public async readFahrradByString(searchRow: string, searchValue: string): Promise<Fahrrad | null>
    {
        //#region Guard
        if(!searchRow)
            {
                throw new Error("Service.Guard: Ungültige Zeile übergeben!");
            }
        if(!searchValue)
        {
            throw new Error("Service.Guard: Ungültigen Wert übergeben!");
        }
        //#endregion

        let result: Fahrrad | null;

        try 
        {
            const repo = new FahrradRepository();
            result = await repo.readByString(searchRow, searchValue);

        } catch (error)
        {
            throw new Error("Service: Fehler beim Aufrufen des Fahrrads anhand der Zeile und des Wertes!");
        }

        return result;
    }

    /**
     * Sucht ein Fahrrad-Objekt anhand der angegebenen **Suchzeile** und des **Suchdatums** in der Datenbank.
     * @param searchRow Die **Zeile** (z.B. ein Kennzeichen oder eine ID), die für die Suche verwendet werden soll.
     * @param searchDate Das **Datum**, das für die Suche verwendet werden soll.
     * @returns Ein **Promise**, das entweder das gefundene `Fahrrad`-Objekt oder `null` zurückgibt, wenn kein Eintrag gefunden wurde.
     * @throws {Error} Wirft einen **Error**, wenn `searchRow` oder `searchDate` ungültig (null/leer) sind.
     * @throws {Error} Wirft einen **Error**, wenn bei der Datenbankabfrage ein Fehler auftritt.
     */
    public async findFahrradByDate(searchRow: string, searchDate: Date): Promise<Fahrrad | null>
    {
        //#region Guards
        if(!searchRow) 
        {
            throw new Error("Service.Guard: Ungültige Zeile übergeben!");
        }
        if(!searchDate)
        {
            throw new Error("Service.Guard: Ungültiges Datum übergeben!");
        }
        //#endregion

        let result: Fahrrad | null;

        try
        {
            const repo = new FahrradRepository();
            result = await repo.findByDate(searchRow, searchDate);

        } catch (error)
        {
            throw new Error("Service: Fehler beim Aufrufen des Fahrrads anhand der Zeile und des Datums!");
        }

        return result;
    }

}