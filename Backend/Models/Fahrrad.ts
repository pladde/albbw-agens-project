export class Fahrrad 
{
    // Attribute
    private id: number;
    private marke: string;
    private rahmennummer: string;
    private besonderheiten: string;
    private bearbeitungsstatus: string;
    private erfasstAm: Date;
    private erfasstVon: string;
    private herausgegebenAn: string;

    // Getter und Setter
    // id
    public getId()
    {
        return this.id;
    }
    public setId(id: number) 
    {
        if(id < 0)
        {
            throw new Error("ID darf nicht negativ sein");
        }
        this.id = id;
    }

    // marke
    public getMarke() 
    {
        return this.marke;
    }
    public setMarke(marke: string)
    {
        this.marke = marke;
    }

    // rahmnennummer
    public getRahmennummer()
    {
        return this.rahmennummer;
    }
    public setRahmennummer(rahmennummer: string)
    {
        this.rahmennummer = rahmennummer;
    }

    // besonderheiten
    public getBesonderheiten() 
    {
        return this.besonderheiten
    }
    public setBesonderheiten(besonderheiten: string)
    {
        this.besonderheiten = besonderheiten;
    }

    // bearbeitungstatus
    public getBearbeitungstatus()
    {
        return this.bearbeitungsstatus;
    }
    public setBearbeitungsstatus(bearbeitungsstatus: string)
    {
        this.bearbeitungsstatus = bearbeitungsstatus;
    }

    // erfasstAm
    public getErfasstAm()
    {
        return this.erfasstAm;
    }
    public setErfasstAm(erfasstAm: Date)
    {
        this.erfasstAm = erfasstAm;
    }

    // erfasstVon
    public getErfasstVon()
    {
        return this.erfasstVon;
    }
    public setErfasstVon(erfasstVon: string)
    {
        this.erfasstVon = erfasstVon;
    }

    // herausgegebenAn
    public getHerausgegebenAn()
    {
        return this.herausgegebenAn;
    }
    public setHerausgegebenAn(herausgegebenAn: string) {
        this.herausgegebenAn = herausgegebenAn;
    }
}