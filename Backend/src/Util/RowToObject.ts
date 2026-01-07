import { Fahrrad } from "../Models/Fahrrad";

/**
 * @class RowToObject
 * RowToObject ist eine Utility-Klasse, die für die **Konvertierung von Rohdaten** (typischerweise
 * Datenbankzeilen oder generische Objekte) in das spezifische **Fahrrad-Objekt** (Entity) zuständig ist.
 * Dies wird oft als Data Mapper oder DTO-Mapper bezeichnet.
 */
export class RowToObject
{
    /**
     * Diese Methode mappt die Daten aus dem übergebenen generischen Objekt (`any`) 
     * in ein **Fahrrad-Objekt** unter Verwendung des Fahrrad-Konstruktors.
     * * @method mapRowToFahrrad
     * @param fahrradData Das Rohdaten-Objekt (typischerweise eine Datenbankzeile), das die zu mappenden Felder enthält.
     * @returns Das vollständig instanziierte `Fahrrad`-Objekt.
     */
    public mapRowToFahrrad(fahrradData: any): Fahrrad
    {
        const fahrrad = new Fahrrad(
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