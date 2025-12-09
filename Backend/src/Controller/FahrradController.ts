import { Fahrrad } from "../Models/Fahrrad";
import { FahrradService } from "../Service/FahrradService";

export class FahrradController
{
    public saveFahrrad(fahrrad: Fahrrad)
    {
        if(!fahrrad)
        {
            throw new Error(`Controller: Das Objekt ${fahrrad} darf nicht null oder leer sein!`)
        }
        
        try 
        {
            const service = new FahrradService();
            service.createNewFahrrad(fahrrad);
            
        } catch (error) 
        {

        }
    }
}