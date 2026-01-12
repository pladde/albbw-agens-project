import { Fahrrad } from "../Models/Fahrrad";
import { FahrradRepository } from "../Repository/FahrradRepository";

/**
 * Der FahrradService enthält die Geschäftslogik (Business Logic) für die Verwaltung 
 * von Fahrrad-Objekten. Er fungiert als Vermittler zwischen dem Controller und dem Repository.
 * Die Hauptaufgaben sind Validierung und Aufruf der Datenzugriffsmethoden.
 */
export class FahrradService 
{
    /**
     * Die Instanz des FahrradRepository für den Zugriff auf die Datenbank.
     * @private
     * @readonly
     */
    private readonly fahrradRepository: FahrradRepository;

    /**
     * Erstellt eine Instanz des FahrradService und initialisiert das Repository.
     * @param fahrradRepository Das zu verwendende FahrradRepository (Dependency Injection).
     */
    constructor(fahrradRepository: FahrradRepository)
    {
        this.fahrradRepository = fahrradRepository;
    }

    /**
     * Diese Methode prüft, ob das Fahrrad gültige Werte hat, übergibt das Fahrrad-Objekt
     * zur weiteren Verarbeitung an das Repository und gibt das erfolgreich gespeicherte Objekt zurück. 
     * @param fahrrad Das Fahrrad-Objekt, das in der Datenbank gespeichert werden soll.
     * @returns Ein **Promise**, das entweder das gespeicherte `Fahrrad`-Objekt oder `undefined` zurückgibt (falls der Speichervorgang im Repository fehlschlägt, aber keine Ausnahme geworfen wird).
     * @throws {Error} Wird geworfen, wenn das übergebene Fahrrad-Objekt `null` oder `undefined` ist. Der Fehlertext ist: `Service: Das Objekt [fahrrad] darf nicht null oder leer sein!`.
     */
    public async createNewFahrrad(fahrrad: Fahrrad): Promise<Fahrrad | undefined>
    {
        //#region Guard
        if(!fahrrad)
        {
            throw new Error(`Service: Das Objekt ${fahrrad} darf nicht null oder leer sein!`)
        }
        //#endregion

        return this.fahrradRepository.save(fahrrad);
    }

    /**
     * Diese Methode nimmt eine ID entgegen, ruft den Repository-Layer auf und übergibt diesen die ID zur Suche nach dem gewünschten Objekt.
     * @param id Die ID, mit der das Objekt in der Datenbank gesucht wird.
     * @returns Ein **Promise**, das das gefundene `Fahrrad`-Objekt oder `undefined` zurückgibt, wenn kein Objekt gefunden wurde.
     * @throws {Error} Wird geworfen, wenn eine ungültige ID (null, 0 oder negativ) übergeben wird. Der Fehlertext ist: `Service: Die Id darf nicht null sein!`.
     * @throws {Error} Wird geworfen, wenn ein Fehler beim Aufrufen der Repository-Methode zur Suche auftritt. Der Fehlertext ist: `Service: Fehler beim Aufrufen des Fahrrads anhand der Id!`.
     */
    public async findFahrradById(id: number) : Promise<Fahrrad | undefined>
    {
        if(id == null || id <= 0)
        {
            //console.log("DEBUG_SERVICE: ID: " + id);
            throw new Error ('Service: Die Id darf nicht null sein!');
        }

        let result: Fahrrad | undefined;

        try 
        {
            result = await this.fahrradRepository.findFahrradById(id);

        } catch (error)
        {
            throw new Error("Service: Fehler beim Aufrufen des Fahrrads anhand der Id!: " + error);
        }

        return result;
    }

    /**
     * Diese Methode übergibt dem Repository-Layer zwei Strings zum dynamischen Durchsuchen der Datenbank wie z.B. Zeile und Wert in Kombination.
     * @param searchRow Die zu durchsuchende **Spalte** (z.B. 'marke', 'rahmenummer' etc.).
     * @param searchValue Der zu suchende **Datenwert** (z.B. "CANYON", "CUBE" etc.).
     * @returns Ein **Promise**, das das gefundene `Fahrrad`-Objekt oder `undefined` zurückgibt, falls keines gefunden wurde.
     * @throws {Error} Wird geworfen, wenn `searchRow` ungültig (null/leer) ist. Der Fehlertext ist: `Service.Guard: Ungültige Zeile übergeben!`.
     * @throws {Error} Wird geworfen, wenn `searchValue` ungültig (null/leer) ist. Der Fehlertext ist: `Service.Guard: Ungültigen Wert übergeben!`.
     * @throws {Error} Wird geworfen, wenn bei der Repository-Abfrage ein unerwarteter Fehler auftritt. Der Fehlertext ist: `Service: Fehler beim Aufrufen des Fahrrads anhand der Zeile und des Wertes!`.
     */
    public async findFahrradByString(searchRow: string, searchValue: string): Promise<any[] | undefined>
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

        let result: any[] | undefined;

        try 
        {
            result = await this.fahrradRepository.findByString(searchRow, searchValue);

        } catch (error)
        {
            throw new Error("Service: Fehler beim Aufrufen des Fahrrads anhand der Zeile und des Wertes!" + error);
        }

        return result;
    }

    /**
     * Sucht ein Fahrrad-Objekt anhand der angegebenen **Suchzeile** und des **Suchdatums** in der Datenbank.
     * @param searchRow Die **Spalte** (z.B. 'kaufdatum'), die für die Suche verwendet werden soll.
     * @param searchDate Das **Datum** (vom Typ `Date`), das für die Suche verwendet werden soll.
     * @returns Ein **Promise**, das entweder das gefundene `Fahrrad`-Objekt oder `undefined` zurückgibt, wenn kein Eintrag gefunden wurde.
     * @throws {Error} Wird geworfen, wenn `searchRow` ungültig (null/leer) ist.
     * @throws {Error} Wird geworfen, wenn `searchDate` ungültig (null/leer) ist.
     * @throws {Error} Wird geworfen, wenn bei der Datenbankabfrage ein Fehler auftritt. Der Fehlertext ist: `Service: Fehler beim Aufrufen des Fahrrads anhand der Zeile und des Datums!`.
     */
    public async findFahrradByDate(searchRow: string, searchDate: Date): Promise<any[] | undefined>
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

        let result: any[] | undefined;

        try
        {
            result = await this.fahrradRepository.findByDate(searchRow, searchDate);

        } catch (error)
        {
            throw new Error("Service: Fehler beim Aufrufen des Fahrrads anhand der Zeile und des Datums!");
        }

        return result;
    }

    /**
     * Sucht **alle** Fahrräder in der Datenbank und gibt sie als Array zurück.
     * @returns Ein **Promise**, das ein Array von `Fahrrad`-Objekten oder `undefined` zurückgibt, wenn keine Fahrräder gefunden wurden.
     * @throws {Error} Wird geworfen, wenn bei der Repository-Abfrage ein Fehler auftritt. Der Fehlertext ist: `Service: Fehler beim Aufrufen aller Fahrräder!`.
     */
    public async findAllFahrrader() : Promise<any[] | undefined>
    {
        let result: any[] | undefined = [];

        try
        {
            result = await this.fahrradRepository.findAll();

        } catch (error)
        {
            console.log(error);
        }

        return result;
    }

    /**
     * Nimmt eine *ID* entgegen und leitet den **Löschvorgang** an das Repository weiter.
     * @param id Die **ID** des Objektes, das gelöscht werden soll.
     * @returns Ein **Promise**, das bei Erfolg das gelöschte `Fahrrad`-Objekt oder `undefined` zurückgibt, wenn kein Datensatz gefunden oder gelöscht wurde. 
     * @throws {Error} Wird geworfen, wenn die übergebene ID ungültig (null/undefined) ist. Der Fehlertext ist: `Service: Fehler beim löschen eines Fahrrads!`.
     * @throws {Error} Wird geworfen, wenn bei der Repository-Abfrage zum Löschen ein Fehler auftritt. Der Fehlertext ist: `Service: Fehler beim löschen eines Fahrrads!`.
     */
    public async deleteFahrradById(fahrrad_id: number) : Promise<any[] | undefined>
    {
        //#region Guard
        if (fahrrad_id == null || fahrrad_id <= 0)
        {
            throw new Error("Service: Fehler beim löschen eines Fahrrads!");
        }
        //#endregion

        let result: any[] | undefined; 

        try 
        {
            result = await this.fahrradRepository.deleteById(fahrrad_id);

        } catch (error)
        {
            throw new Error("Service: Fehler beim löschen eines Fahrrads!");
        }

        return result;
    }
}