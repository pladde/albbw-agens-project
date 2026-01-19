export interface IFahrrad
{
    id?: number;
    marke?: string;
    rahmennummer?: string;
    besonderheiten?: string;
    bearbeitungsstatus: string;
    erfasstAm: Date;
    erfasstVon: number;
    herausgegebenAn?: number;
    qrCode?: string;
}