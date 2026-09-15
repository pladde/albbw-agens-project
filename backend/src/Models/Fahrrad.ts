import { IFahrrad } from "../Interfaces/IFahrrad";

/**
 * Das FahrradModel ist eine Entitiy in der Anwendung.
 * Es specihert alle relevanten Eigenschaften, die ein einzelnes Fahrrad haben kann.
 * Es wird typischerweise zur Verwaltung eines Fahrrad-Objektes verwendet.
 */
export class Fahrrad 
{
    //#region Konstruktor

    private fahrrad_id?: number;
    private marke?: string;
    private farbe?: string;
    private fahrradEigenschaftId?: number;
    private rahmennummer?: string;
    private bearbeitungsstatus?: string;
    private erfasstAm?: Date;
    private erfasstVon?: string;
    private herausgegebenAn?: string;
    private qrCode?: string;

    /**
     * Erstellt eine Instanz des Fahrrad-Objekts.
     * Alle Parameter sind optional, da ein Objekt entweder neu erstellt (ohne ID) 
     * oder aus der Datenbank geladen (mit allen Werten) werden kann.
     * * 
     * @param id Die eindeutige Kennung (Primärschlüssel) des Fahrrads.
     * @param marke Die Marke des Fahrrads (z.B. Cube, Canyon).
     * @param rahmennummer Die eindeutige Rahmennummer des Fahrrads.
     * @param farbe Die Farbe des Fahrrads. (Zum Beispiel "rot", "blau")
     * @param eigenschaft
     * @param bearbeitungsstatus Der aktuelle Bearbeitungsstatus des Fahrrads (z.B. "in Bearbeitung", "Verfügbar").
     * @param erfasstAm Der Zeitpunkt, zu dem das Fahrrad im System erfasst wurde.
     * @param erfasstVon Der Name oder die Kennung der Person, die das Fahrrad erfasst hat.
     * @param herausgegebenAn Der Name der Person, an die das Fahrrad herausgegeben wurde (oder `undefined`, falls noch nicht herausgegeben).
     */
    constructor(data: IFahrrad)
        {
            this.fahrrad_id = data.fahrrad_id;
            this.marke = data.marke;
            this.farbe = data.farbe;
            this.fahrradEigenschaftId = data.eigenschaft;
            this.rahmennummer = data.rahmennummer;
            this.bearbeitungsstatus = data.bearbeitungsstatus;
            this.erfasstAm = data.erfasstAm;
            this.erfasstVon = data.erfasstVon;
            this.herausgegebenAn = data.herausgegebenAn;
            this.qrCode = data.qrCode;
        }

    //#endregion

    //#region Getter und Setter

    // --- Getter & Setter für 'fahrrad_id' ---
    /**
     * Ruft die ID des Fahrrads ab.
     * @returns Die ID des Fahrrads oder `undefined`.
     */
    public getFahrradId(): number | undefined
    {
        return this.fahrrad_id;
    }
    /**
     * Setzt die ID des Fahrrads.
     * @param id Die zu setzende ID des Fahrrads.
     */
    public setFahrradId(fahrrad_id: number): void
    {
        this.fahrrad_id = fahrrad_id;
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

    // --- Getter & Setter für 'farbe' ---
    /**
     * Ruft die Farbe des Objektes ab.
     * @returns Die `farbe` oder `undefined`.
     */
    public getFarbe(): string | undefined
    {
        return this.farbe;
    }
    /**
     * Setzt die farbe.
     * @param farbe Die Farbe die gesetzt wird.
     */
    public setFarbe(farbe: string): void
    {
        this.farbe = farbe;
    }

    /**
     * Ruft die Eigenschaft-ID auf.
     * @param eigenschaft Die Eigenschaft-ID oder `undefinied`.
     */
    public getFahrradEigenschaftId(): number | undefined
    {
        return this.fahrradEigenschaftId;
    }
    /**
     * Setzt die Eigenschaft ID.
     * @param fahrradEigenschaftId Die Eigenschaft-ID die gesetzt wird.
     */
    public setFahrradEigenschaftId(fahrradEigenschaftId: number): void
    {
        this.fahrradEigenschaftId = fahrradEigenschaftId;
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