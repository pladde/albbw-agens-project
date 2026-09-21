import { Fahrrad } from "../Models/Fahrrad";
import { FahrradRepository } from "../Repository/FahrradRepository";

/**
 * Der FahrradService enthält die **Geschäftslogik** für die Verwaltung 
 * von Fahrrad-Objekten. Er fungiert als Vemrittler zwischen dem Controller und dem Repository.
 * Die Hauptaufgaben sind Validierung und Aufruf der Datenzugriffsmethoden.
 * 
 * Diese Klasse stellt dazu folgende Methoden bereit:
 * @function `async getTableColumns(): Promise<string[]>`
 * @function `async createFahrrad(fahrrad: Fahrrad): Promise<Fahrrad | undefined>`
 * @function `async findFahrradById(id: number): Promise<Fahrrad | undefined>`
 * @function `async findFahrradByString(searchRow: string, searchValue: string): Promise<any[] | undefined>`
 * @function `async findFahrradByDate(column: string, date: Date): Promise<any[] | undefined>`
 * @function `async findAllFahrrader(page: number): Promise<any[] | undefined>`
 * @function `async findAllFahrraederWithAttributes(page: number): Promise<any[] | undefined>`
 * @function `async deleteFahrradById(fahrrad_id: number): Promise<any[] | undefined>`
 * @function `async editFahrradById(id: number, column: string, value: string): Promise<any[] | undefined>`
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

    public async getTableColumns() : Promise<string[]> {
            
        return this.fahrradRepository.getTableColumns();
    }

    /**
     * Validiert ein Fahrrad-Objekt und übergibt es an das Repository zum Speichern.
     * Zuerst werden die Eigenschaften (`Farbe, Marke`) geprüft. Sofern noch keine Einträge dazu in der Datenbank gefunden wurden
     * werden sie neu angelegt. Dann wird ein Eigenschaften-Datensatz erstellt und mit Marke und Farbe verknüpft. Dieser wird dann 
     * dem Fahrrad-Objekt hinzugefügt und über `fahrradRepository.save` gespeichert.
     * @param fahrrad Das Fahrrad-Objekt, das gespeichert werden soll.
     * @returns Ein Promise, das das gespeicherte `Fahrrad`-Objekt (inkl. ID) oder `undefined` zurückgibt.
     * @throws {Error} Wenn das Fahrrad-Objekt null oder undefined ist.
     */
    public async createFahrrad(fahrrad: Fahrrad): Promise<Fahrrad | undefined>
    {
        // Marke prüfen oder anlegen
        const markenName = fahrrad.getMarke();
        let markeId: number | undefined = undefined;

        if (markenName) {
            markeId = await this.fahrradRepository.searchFahrradMarke(markenName);
            
            if (!markeId) {
                markeId = await this.fahrradRepository.createMarke(markenName);
            }
        }

        // Farbe prüfen oder anlegen
        const farbName = fahrrad.getFarbe(); 
        let farbeId: number | null = null;

        if (farbName) {
            farbeId = await this.fahrradRepository.searchFahrradFarbe(farbName);
            
            if (!farbeId) {
                farbeId = await this.fahrradRepository.createFarbe(farbName);
            }
        }

        // Bearbeitungsstatus prüfen oder anlegen
        const bearbeitungsstatus = fahrrad.getBearbeitungsstatus(); 
        let bearbeitungsstatusId: number | null = null;

        if (bearbeitungsstatus) {
            bearbeitungsstatusId = await this.fahrradRepository.searchFahrradBearbeitungsstatus(bearbeitungsstatus);
            
            if (!bearbeitungsstatusId) {
                bearbeitungsstatusId = await this.fahrradRepository.createBearbeitungsstatus(bearbeitungsstatus);
            }
        }

        // Eigenschafts-Datensatz erstellen
        if (markeId && farbeId) {
            const eigenschaftId = await this.fahrradRepository.getOrCreateEigenschaftId(markeId, farbeId);
            
            fahrrad.setFahrradEigenschaftId(eigenschaftId);
        }

        return await this.fahrradRepository.save(fahrrad, bearbeitungsstatusId);
    }
   
    /**
     * **Sucht** ein einzelnes Fahrrad anhand seiner **ID** über das Repository.
     * @param id Die eindeutige ID des Fahrrads.
     * @returns Ein Promise, das das gefundene `Fahrrad`-Objekt oder `undefined` zurückgibt.
     * @throws {Error} Wenn die ID null, 0 oder negativ ist ("Service: Die Id darf nicht null sein!").
     * @throws {Error} Wenn beim Repository-Aufruf ein Fehler auftritt.
     */
    public async findFahrradById(id: number) : Promise<Fahrrad | undefined>
    {
        if(id == null || id <= 0)
        {
            throw new Error ('Service: Die Id darf nicht null sein!');
        }

        let result: Fahrrad | undefined;

        try 
        {
            result = await this.fahrradRepository.findById(id);

        } catch (error)
        {
            console.log(error);
            throw new Error("Fehler: " + error);
        }

        return result;
    }

    /**
     * **Sucht nach** Fahrrädern basierend auf einem **Spaltennamen** und einem **String-Wert**.
     * @param searchRow Die zu durchsuchende Datenbankspalte.
     * @param searchValue Der Suchbegriff (z.B. Marke).
     * @returns Ein Promise, das ein **Array** gefundener Datensätze oder `undefined` zurückgibt.
     * @throws {Error} Wenn Spalte oder Suchwert fehlen (Service.Guard Fehler).
     * @throws {Error} Bei Fehlern während der Repository-Abfrage.
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
            console.log(error);
            throw new Error("Fehler: " + error);
        }

        return result;
    }

    /**
     * **Sucht nach** Fahrrädern basierend auf einer **Spalte** und einem **Datumswert**.
     * @param searchRow Die Datumsspalte (z.B. 'erfasstAm').
     * @param searchDate Das gesuchte Datum.
     * @returns Ein Promise, das ein **Array** gefundener Datensätze oder `undefined` zurückgibt.
     * @throws {Error} Wenn Spalte oder Datum fehlen (Service.Guard Fehler).
     */
    public async findFahrradByDate(column: string, date: Date): Promise<any[] | undefined>
    {
        //#region Guards
        if(!column) 
        {
            throw new Error("Service.Guard: Ungültige Zeile übergeben!");
        }
        if(!date)
        {
            throw new Error("Service.Guard: Ungültiges Datum übergeben!");
        }
        //#endregion

        let result: any[] | undefined;

        try
        {
            result = await this.fahrradRepository.findByDate(column, date);

        } catch (error)
        {
            console.log(error);
            throw new Error("Fehler: " + error);
        }

        return result;
    }

    /**
     * Ruft **alle** vorhandenen **Fahrräder** aus der Datenbank ab.
     * @returns Ein Promise, das ein Array aller Datensätze oder `undefined` zurückgibt.
     * @throws {Error} Bei Fehlern während der Repository-Abfrage.
     */
    public async findAllFahrrader(page: number) : Promise<any[] | undefined>
    {
        let result: any[] | undefined = [];

        try
        {
            result = await this.fahrradRepository.findAll(page);

        } catch (error)
        {
            console.log(error);
            throw new Error("Fehler: " + error);
        }

        return result;
    }

    public async findAllFahrraederWithAttributes(page: number) 
    {

        return await this.fahrradRepository.findAllWithAttributes(page);
    }

    /**
     * **Löscht** ein Fahrrad anhand seiner **ID**.
     * @param fahrrad_id Die ID des zu löschenden Objektes.
     * @returns Ein Promise mit den Informationen zur Löschung oder `undefined`.
     * @throws {Error} Wenn die ID ungültig ist ("Service: Fehler beim löschen eines Fahrrads!").
     */
    public async deleteFahrradById(fahrrad_id: number) : Promise<any[] | undefined>
    {
        //#region Guard
        if (fahrrad_id == null || fahrrad_id < 0)
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
            console.log(error);
            throw new Error("Fehler: " + error);
        }

        return result;
    }

    /**
     * **Aktualisiert** einen spezifischen **Spaltenwert** eines Fahrrads.
     * @param id Die ID des zu editierenden Fahrrads.
     * @param column Die Datenbankspalte, die geändert werden soll.
     * @param value Der neue Wert für die Spalte.
     * @returns Ein Promise mit dem Ergebnis der Datenbankoperation oder `undefined`.
     * @throws {Error} Wenn die ID oder Spalte nicht angegeben wurde.
     */
    public async updateFahrradById(id: number, fahrrad: Fahrrad): Promise<any[] | undefined> 
    {
        //#region Guard
        if (!id) {
            throw new Error("Service: ID zum Editieren eines Objektes darf nicht null oder leer sein!");
        }
        if (!fahrrad) {
            throw new Error("Service: Das Fahrrad-Objekt zum Editieren darf nicht null oder leer sein!");
        }
        //#endregion

        try 
        {
            const result = await this.fahrradRepository.updateFahrradById(id, fahrrad);

            return result;

        } catch (error) 
        {
            console.error("Service Fehler (updateFahrradById):", error);
            
            throw error;
        }
    }
}