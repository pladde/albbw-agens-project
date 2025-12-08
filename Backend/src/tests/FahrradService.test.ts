import { FahrradRepository } from "../Repository/FahrradRepository";

// 1. Arrange

const mockFindFahrradById = jest.fn();

jest.mock("../src/../Repository/FahrradRepository", () => {
    return {
        FahrradRepository: jest.fn().mockImplementation(() => {
            return {
                findFahrradById: mockFindFahrradById,
            };
        })
    };
});

// 2. Imports

import { FahrradService } from "../Service/FahrradService";
import { Fahrrad } from "../Models/Fahrrad";

let service: FahrradService;
const TEST_ID = 42;
const mockFahrrad: Fahrrad = {
    id: TEST_ID,
    marke: "Canyon",
    rahmennummer: "Hallo Welt 0815",
    besonderheiten: "Einfach ein tolles Rad!",
    bearbeitungsstatus: "Angenommen",
    erfasstAm: new Date("2025-12-08T10:30:00"),
    erfasstVon: "Irgendwem",
    herausgegebenAn: "Jemanden",
} as Fahrrad;

// Test Suite

describe('FahrradService.readFahrradById', () => {
    beforeEach(() => {
        service = new FahrradService();
        mockFindFahrradById.mockClear();
    });

    test('sollte das Fahrrad-Objekt zurückgeben, wenn die ID existiert', () => {
        mockFindFahrradById.mockReturnValue(mockFahrrad);

        const result = service.readFahrradById(TEST_ID);

        expect(mockFindFahrradById).toHaveBeenCalledWith(TEST_ID);

        expect(result).toEqual(mockFahrrad);
    });

    test('sollte null zurückgeben, wenn das Repository null liefert', () => {
        // ARRANGE: Mock konfigurieren: Repository soll null zurückgeben
        mockFindFahrradById.mockReturnValue(null);

        // ACT: Methode ausführen
        const result = service.readFahrradById(999); 

        // ASSERT:
        expect(result).toBeNull();
    });
    
    // --- TESTFALL 3: Ungültige ID (Validierung) ---
    test('sollte einen Error werfen, wenn die ID 0 ist', () => {
        const INVALID_ID = 0; 

        // ACT & ASSERT: Prüfen, ob die Funktion einen Fehler wirft
        expect(() => {
            service.readFahrradById(INVALID_ID);
        }).toThrow('Service: Die Id darf nicht null sein!');
        
        // ASSERT: Das Repository darf NICHT aufgerufen werden
        expect(mockFindFahrradById).not.toHaveBeenCalled();
    });

    // --- TESTFALL 4: Fehler im Repository (Exception Handling) ---
    test('sollte einen Service-Error werfen, wenn die Repository-Methode fehlschlägt', () => {
        // ARRANGE: Mock konfigurieren: Repository soll einen Fehler werfen
        mockFindFahrradById.mockImplementation(() => {
            throw new Error("Simulierter Datenbankfehler");
        });

        // ACT & ASSERT: Prüfen, ob der Service den Catch-Block durchläuft
        expect(() => {
            service.readFahrradById(TEST_ID);
        }).toThrow('Service: Fehler beim Aufrufen des Fahrrads anhand der Id!');
    });
});