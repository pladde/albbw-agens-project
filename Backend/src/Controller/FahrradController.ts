import { Fahrrad } from "../Models/Fahrrad";
import { FahrradService } from "../Service/FahrradService";

export class FahrradController
{
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
            const service = new FahrradService();
            await service.createNewFahrrad(fahrrad);

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

        const service = new FahrradService();
        const fahrrad: Fahrrad | undefined = await service.findFahrradById(id)

        return fahrrad;
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
        
        const service = new FahrradService();
        const fahrrad: Fahrrad | undefined = await service.findFahrradByString(searchRow, searchValue)

        return fahrrad;
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
    
        const service = new FahrradService();
        const fahrrad: Fahrrad | undefined = await service.findFahrradByDate(searchRow, date)
    
        return fahrrad;
    }

    // >>>>>>>
    public async findAllFahrraeder() : Promise<Fahrrad[] | undefined>
    {
        const service = new FahrradService();
        let fahrrad: Fahrrad[] | undefined = [];
        fahrrad = await service.findAllFahrrader();
    
        return fahrrad;
    }

    public async deleteFahrradById(id: number) : Promise<Fahrrad | undefined>
    {
        if(!id)
        {
            throw new Error(`Controller: Die übergebene ID zum löschen eines Datensatzes darf nicht null oder leer sein!`)
        }

        let result: Fahrrad | undefined;
        
        const service = new FahrradService();
        result = await service.deleteFahrradById(id);

        return result;
    }

}