import { Fahrrad } from "../Models/Fahrrad";
import { FahrradRepository } from "../Repository/FahrradRepository";

export class FahrradService 
{
    public createNewFahrrad(fahrrad: Fahrrad): Fahrrad | null
    {
        if(!fahrrad)
        {
            throw new Error(`Service: Das Objekt ${fahrrad} darf nicht null oder leer sein!`)
        }

        let result: Fahrrad | null;

        try 
        {
            const repo = new FahrradRepository
            const id = repo.save(fahrrad);
            // Hier wird dann die Id für eine Abfrage verarbeitet, damit das Fahrradobjekt zurückgegeben werden kann.
            result = fahrrad; // Das ausgelesene Objekt wird dann hier ausgegeben.

        } catch (error) 
        {
            console.log("Service: Fehler beim Aufrufen der Repository!");
            result = null;
        }

        return result;
    }
}