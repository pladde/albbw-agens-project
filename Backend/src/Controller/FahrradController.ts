import { Fahrrad } from "../Models/Fahrrad";
import { FahrradService } from "../Service/FahrradService";

export class FahrradController
{
    private readonly fahrradService: FahrradService;

    constructor(fahrradService: FahrradService) {
        this.fahrradService = fahrradService;
    }

    /**
     * **Erstellt** aus dem **Fahrrad-Objekt** einen neuen Datensatz in der Datenbank
     * @param fahrrad Ein **Fahrrad-Objekt** welches in die Datenbank gespeichert werden soll.
     */
    public async saveFahrrad(fahrrad: Fahrrad)
    {
        if(!fahrrad)
        {
            throw new Error(`Controller: Das Objekt ${fahrrad} darf nicht null oder leer sein!`)
        }
        
        try 
        {
            await this.fahrradService.createNewFahrrad(fahrrad);

            // eine Rückgabe an das Frontend könnte auch hilfreich sein

        } catch (error) 
        {
            throw new Error("Controller: Fehler bei der Verarbeitung vom Fahrrad speichern.");
        }
    }

    public async findFahrradById(id: number) : Promise<Fahrrad | undefined>
    {
        if(!id)
        {
            throw new Error(`Controller: Die übergebene ID zum suchen eines Fahrrads darf nicht null oder leer sein!`)
        }

        //const fahrradService = new FahrradService();
        //const fahrrad: Fahrrad | undefined = await this.fahrradService.findFahrradById(id);

        return this.fahrradService.findFahrradById(id);
    }

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

    // >>>>>>>
    public async findAllFahrraeder() : Promise<Fahrrad[] | undefined>
    {
        return this.fahrradService.findAllFahrrader();
    }

    public async deleteFahrradById(id: number) : Promise<Fahrrad | undefined>
    {
        if(!id)
        {
            throw new Error(`Controller: Die übergebene ID zum löschen eines Datensatzes darf nicht null oder leer sein!`)
        }
        
        return this.fahrradService.deleteFahrradById(id);
    }

}