export class Fahrrad 
{
    //#region Konstruktor
    constructor(
        private id?: number, 
        private marke?: string, 
        private rahmennummer?: string, 
        private besonderheiten?: string, 
        private bearbeitungsstatus?: string,
        private erfasstAm?: Date,
        private erfasstVon?: string,
        private herausgegebenAn?: string)
        {
        }

    //#endregion

    //#region Getter und Setter
    //#region id
    public getId()
    {
        return this.id;
    }
    public setId(id: number): void
    {
        this.id = id;
    }
    //#endregion

    //#region marke
    public getMarke(): string | undefined
    {
        return this.marke;
    }
    public setMarke(marke: string): void
    {
        this.marke = marke;
    }
    //#endregion

    //#region rahmennummer
    public getRahmennummer(): string | undefined
    {
        return this.rahmennummer;
    }
    public setRahmennummer(rahmennummer: string): void
    {
        this.rahmennummer = rahmennummer;
    }
    //#endregion

    //#region besonderheiten
    public getBesonderheiten(): string | undefined
    {
        return this.besonderheiten;
    }
    public setBesonderheiten(besonderheiten: string): void
    {
        this.besonderheiten = besonderheiten;
    }
    //#endregion

    //#region bearbeitungstatus
    public getBearbeitungsstatus(): string | undefined
    {
        return this.bearbeitungsstatus;
    }
    public setBearbeitungsstatus(bearbeitungsstatus: string): void
    {
        this.bearbeitungsstatus = bearbeitungsstatus;
    }
    //#endregion

    //#region erfasstAm
    public getErfasstAm(): Date | undefined
    {
        return this.erfasstAm;
    }
    public setErfasstAm(erfasstAm: Date): void
    {
        this.erfasstAm = erfasstAm;
    }
    //#endregion

    //#region erfasstVon
    public getErfasstVon(): string | undefined
    {
        return this.erfasstVon;
    }
    public setErfasstVon(erfasstVon: string): void
    {
        this.erfasstVon = erfasstVon;
    }
    //#endregion

    //#region herausgegebenAn
    public getHerausgegebenAn(): string | undefined
    {
        return this.herausgegebenAn;
    }
    public setHerausgegebenAn(herausgegebenAn: string): void
    {
        this.herausgegebenAn = herausgegebenAn;
    }
    //#endregion
    //#endregion
}