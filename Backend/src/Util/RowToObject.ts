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
        const fahrrad = new Fahrrad({
            fahrrad_id: fahrradData.fahrrad_id,
            marke: fahrradData.marke,
            rahmennummer: fahrradData.rahmennummer,
            besonderheiten: fahrradData.besonderheiten,
            bearbeitungsstatus: fahrradData.bearbeitungsstatus,
            erfasstAm: fahrradData.erfasstAm,
            erfasstVon: fahrradData.erfasstVon,
            herausgegebenAn: fahrradData.herausgegebenAn
    });

        return fahrrad;
    }
}