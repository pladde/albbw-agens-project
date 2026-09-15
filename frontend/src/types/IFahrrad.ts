export interface IFahrrad
{
    id?: number;
    marke?: string;
    rahmennummer?: string;
    besonderheiten?: string;
    farbe: string;
    erfasstAm: Date;
    erfasstVon: number;
    herausgegebenAn?: number;
    qrCode?: string;
}