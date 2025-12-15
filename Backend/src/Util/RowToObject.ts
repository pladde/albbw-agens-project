import { Fahrrad } from "../Models/Fahrrad";

/**
 * @function mapRowToFahrrad - Erwartet ein **Any-Objekt** um es in ein **Fahrrad-Objekt** zu konvertieren.
 */
export class RowToObject
{
    /**
     * Diese Methode mappt die Daten aus dem übergebenen Objekt in ein **Fahrrad-Objekt** und gibt es zurück.
     * @param fahrradData Das Objekt aus dem das **Fahrrad-Objekt** erstellt werden soll.
     * @returns `Fahrrad` Ein Fahrrad-Objekt wird zurückgegeben. 
     */
    public mapRowToFahrrad(fahrradData: any): Fahrrad
    {
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