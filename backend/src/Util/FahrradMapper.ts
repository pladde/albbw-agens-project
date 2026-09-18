import { Fahrrad } from "../Models/Fahrrad";

/**
 * @class FahrradMapper
 * FahrradMapper ist eine Utility-Klasse, die für die **Konvertierung von Rohdaten** (typischerweise
 * Datenbankzeilen oder generische Objekte) in das spezifische **Fahrrad-Objekt** (Entity) zuständig ist.
 * Dies dient dazu Daten zu mappen. Wahrscheinlich werde ich sie aber später wieder entfernen und die Daten sauber per Interface behandeln.
 */
export class FahrradMapper
{
    /**
     * Diese Methode mappt die Daten aus dem übergebenen generischen Objekt (`any`) 
     * in ein **Fahrrad-Objekt** unter Verwendung des Fahrrad-Konstruktors.
     * * @method mapFahrrad
     * @param fahrradData Das Rohdaten-Objekt (typischerweise eine Datenbankzeile), das die zu mappenden Felder enthält.
     * @returns Das vollständig instanziierte `Fahrrad`-Objekt.
     */
    public mapFahrrad(fahrradData: any): Fahrrad
    {
        const fahrrad = new Fahrrad({
            fahrrad_id: fahrradData.fahrrad_id,
            marke: fahrradData.marke,
            rahmennummer: fahrradData.rahmennummer,
            farbe: fahrradData.farbe,
            bearbeitungsstatus: fahrradData.bearbeitungsstatus,
            erfasstAm: fahrradData.erfasst_am,
            erfasstVon: fahrradData.erfasst_von,
            herausgegebenAn: fahrradData.ausgegeben_an
    });

        return fahrrad;
    }
}