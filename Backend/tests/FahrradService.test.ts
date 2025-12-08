// Datei: src/tests/FahrradService.test.ts

// 1. ARRANGE: MOCKING DES REPOSITORYS

const mockFindFahrradById = jest.fn();

jest.mock("../src/Repository/FahrradRepository", () => {
    return {
        FahrradRepository: jest.fn().mockImplementation(() => {
            return {
                findFahrradById: mockFindFahrradById,
            };
        }),
    };
});

// 2. IMPORTS & DATEN
import { FahrradService } from "../src/Service/FahrradService";
import { Fahrrad } from "../src/Models/Fahrrad";

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

    // --- TEST 1: Erfolgreicher Fund ---
    test('sollte das Fahrrad-Objekt zurückgeben, wenn die ID existiert', async () => {

        // ARRANGE
        mockFindFahrradById.mockResolvedValue(mockFahrrad);

        // ACT
        const result = await service.readFahrradById(TEST_ID);

        // ASSERT
        expect(mockFindFahrradById).toHaveBeenCalledWith(TEST_ID);
        expect(result).toEqual(mockFahrrad);
    });

    // --- TEST 2: Kein Fahrrad gefunden ---
    test('sollte null zurückgeben, wenn das Repository null liefert', async () => {
        // ARRANGE:
        mockFindFahrradById.mockResolvedValue(null);

        // ACT: Methode ausführen
        const result = await service.readFahrradById(TEST_ID);

        // ASSERT:
        expect(result).toBeNull();
    });
    
    // --- TEST 3: Ungültige ID (Validierung) ---
    test('sollte einen Error werfen, wenn die ID 0 ist', () => {
        const INVALID_ID = 1; 

        // ACT & ASSERT
        expect(() => {
            service.readFahrradById(INVALID_ID);
        }).toThrow('Service: Die Id darf nicht null sein!');
        
        expect(mockFindFahrradById).not.toHaveBeenCalled();
    });

    // --- TEST 4: Fehler im Repository ---
    test('sollte einen Service-Error werfen, wenn die Repository-Methode fehlschlägt', async () => {
        // ARRANGE
        mockFindFahrradById.mockImplementation(() => {
            throw new Error("Simulierter Datenbankfehler");
        });

        // ACT & ASSERT: await expect().rejects.toThrow() fängt den Promise-Fehler ab.
        await expect(service.readFahrradById(TEST_ID)).rejects.toThrow('Service: Fehler beim Aufrufen des Fahrrads anhand der Id!');
    });
});