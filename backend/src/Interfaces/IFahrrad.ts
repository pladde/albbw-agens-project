export interface IFahrrad 
{
    // Attribute
    fahrrad_id?: number;
    marke?: string;
    farbe?: string;
    eigenschaft? : number;
    rahmennummer?: string;
    bearbeitungsstatus?: string;
    erfasstAm?: Date;
    erfasstVon?: string;
    herausgegebenAn?: string;
    qrCode?: string;
}