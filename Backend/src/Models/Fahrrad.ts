/**
 * Das FahrradModel ist eine Entitiy in der Anwendung.
 * Es sepcihert alle relevanten Eigenschaften, die ein einzelnes Fahrrad haben kann.
 * Es wird typischerweise zur Verwaltung eines Fahrrad-Objektes verwendet.
 */
export class Fahrrad 
{
    //#region Konstruktor

    /**
     * Erstellt eine Instanz des Fahrrad-Objekts.
     * Alle Parameter sind optional, da ein Objekt entweder neu erstellt (ohne ID) 
     * oder aus der Datenbank geladen (mit allen Werten) werden kann.
     * * @param id Die eindeutige Kennung (Primärschlüssel) des Fahrrads.
     * @param marke Die Marke des Fahrrads (z.B. Cube, Canyon).
     * @param rahmennummer Die eindeutige Rahmennummer des Fahrrads.
     * @param besonderheiten Besondere Merkmale oder Anmerkungen zum Fahrrad.
     * @param bearbeitungsstatus Der aktuelle Bearbeitungsstatus des Fahrrads (z.B. "in Bearbeitung", "Verfügbar").
     * @param erfasstAm Der Zeitpunkt, zu dem das Fahrrad im System erfasst wurde.
     * @param erfasstVon Der Name oder die Kennung der Person, die das Fahrrad erfasst hat.
     * @param herausgegebenAn Der Name der Person, an die das Fahrrad herausgegeben wurde (oder `undefined`, falls noch nicht herausgegeben).
     */
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
    
    // --- Getter & Setter für 'id' ---
    /**
     * Ruft die eindeutige ID des Fahrrads ab.
     * @returns Die ID des Fahrrads oder `undefined`.
     */
    public getId(): number | undefined
    {
        return this.id;
    }
    
    /**
     * Setzt die eindeutige ID des Fahrrads.
     * @param id Die zu setzende ID.
     */
    public setId(id: number): void
    {
        this.id = id;
    }

    // --- Getter & Setter für 'marke' ---
    /**
     * Ruft die Marke des Fahrrads ab.
     * @returns Die Marke des Fahrrads oder `undefined`.
     */
    public getMarke(): string | undefined
    {
        return this.marke;
    }
    
    /**
     * Setzt die Marke des Fahrrads.
     * @param marke Die zu setzende Marke.
     */
    public setMarke(marke: string): void
    {
        this.marke = marke;
    }

    // --- Getter & Setter für 'rahmennummer' ---
    /**
     * Ruft die Rahmennummer des Fahrrads ab.
     * @returns Die Rahmennummer oder `undefined`.
     */
    public getRahmennummer(): string | undefined
    {
        return this.rahmennummer;
    }
    
    /**
     * Setzt die Rahmennummer des Fahrrads.
     * @param rahmennummer Die zu setzende Rahmennummer.
     */
    public setRahmennummer(rahmennummer: string): void
    {
        this.rahmennummer = rahmennummer;
    }

    // --- Getter & Setter für 'besonderheiten' ---
    /**
     * Ruft besondere Merkmale oder Anmerkungen ab.
     * @returns Die Besonderheiten oder `undefined`.
     */
    public getBesonderheiten(): string | undefined
    {
        return this.besonderheiten;
    }
    
    /**
     * Setzt die besonderen Merkmale oder Anmerkungen.
     * @param besonderheiten Die zu setzenden Besonderheiten.
     */
    public setBesonderheiten(besonderheiten: string): void
    {
        this.besonderheiten = besonderheiten;
    }

    // --- Getter & Setter für 'bearbeitungsstatus' ---
    /**
     * Ruft den aktuellen Bearbeitungsstatus ab.
     * @returns Der Bearbeitungsstatus oder `undefined`.
     */
    public getBearbeitungsstatus(): string | undefined
    {
        return this.bearbeitungsstatus;
    }
    
    /**
     * Setzt den aktuellen Bearbeitungsstatus.
     * @param bearbeitungsstatus Der zu setzende Status.
     */
    public setBearbeitungsstatus(bearbeitungsstatus: string): void
    {
        this.bearbeitungsstatus = bearbeitungsstatus;
    }

    // --- Getter & Setter für 'erfasstAm' ---
    /**
     * Ruft den Erfassungszeitpunkt ab.
     * @returns Das Erfassungsdatum oder `undefined`.
     */
    public getErfasstAm(): Date | undefined
    {
        return this.erfasstAm;
    }
    
    /**
     * Setzt den Erfassungszeitpunkt.
     * @param erfasstAm Das zu setzende Datum.
     */
    public setErfasstAm(erfasstAm: Date): void
    {
        this.erfasstAm = erfasstAm;
    }

    // --- Getter & Setter für 'erfasstVon' ---
    /**
     * Ruft die Kennung der erfassenden Person ab.
     * @returns Die Kennung der erfassenden Person oder `undefined`.
     */
    public getErfasstVon(): string | undefined
    {
        return this.erfasstVon;
    }
    
    /**
     * Setzt die Kennung der erfassenden Person.
     * @param erfasstVon Die zu setzende Kennung.
     */
    public setErfasstVon(erfasstVon: string): void
    {
        this.erfasstVon = erfasstVon;
    }

    // --- Getter & Setter für 'herausgegebenAn' ---
    /**
     * Ruft den Namen der Person ab, an die das Fahrrad zurückgegeben wurde.
     * @returns Der Name der Empfängerperson oder `undefined`.
     */
    public getHerausgegebenAn(): string | undefined
    {
        return this.herausgegebenAn;
    }
    
    /**
     * Setzt den Namen der Person, an die das Fahrrad zurückgegeben wurde.
     * @param herausgegebenAn Der zu setzende Name.
     */
    public setHerausgegebenAn(herausgegebenAn: string): void
    {
        this.herausgegebenAn = herausgegebenAn;
    }
    
    //#endregion
}