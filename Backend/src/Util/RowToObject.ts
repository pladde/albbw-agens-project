import { Fahrrad } from "../Models/Fahrrad";

/**
 * mapDbRowToFahrrad(T: any): T | null
 */
export class RowToObject
{
    /**
     * Diese Methode mappt die Daten aus dem übergebenen Objekt in ein Fahrrad-Objekt und gibt es zurück. Falls das übergebene Objekt 
     * ungültig ist, gibt der Guard NULL zurück.
     * @param fahrradData Das Objekt aus dem das Fahrrad-Objekt erstellt werden soll.
     * @returns Fahrrad | null - Ein Fahrrad-Objekt wird zurückgegeben. Wenn der Guard erkennt, dass das übergebene Objekt NULL ist, wird NULL zurückgegeben. 
     */
    public mapRowToFahrrad(fahrradData: any): Fahrrad | null
    {
        if (!fahrradData) {
            return null; // Kein Fahrrad mit dieser ID gefunden
        }

        const fahrrad: Fahrrad = new Fahrrad(
            fahrradData.fahrrad_id,
            fahrradData.fahrradmarke,
            fahrradData.rahmennummer,
            fahrradData.besonderheiten,
            fahrradData.bearbeitungsstatus,
            fahrradData.erfasstAm,
            fahrradData.erfasstVon,
            fahrradData.herausgegebenAn
        );

        return fahrrad;
    }
}