import type { Fahrrad } from '../types/Fahrrad';

const API_URL = 'http://localhost:3000/api/fahrrad';

/**
 * Das Service-Modul für die Kommunikation zwischen Frontend und Backend
 * zur Verwaltung von Fahrrädern.
 */
export const fahrradService = {
  /**
   * Sendet eine Anfrage an das Backend um ein **neues Fahrrad-Objekt** zu **erstellen**.
   * @param {Record<string, any>} data - Das vollständig ausgefüllte Fahrrad-Objekt.
   * @returns {Promise<Record<string, any> | null>} Das vom Server erstellte Objekt oder null bei Fehler.
   */
  create: async (data: Record<string, any>): Promise<Record<string, any> | null> => {
    try {
      const response = await fetch(`${API_URL}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Fehler beim Speichern (create)');
      }

      return await response.json();
    } catch (error) {
      console.error('Fehler im Service (create): ', error);
      return null;
    }
  },

  /**
   * Holt die Spaltennamen/Header für die Tabelle.
   */
  fetchHead: async (): Promise<string[] | null> => {
    try {
      const response = await fetch(`${API_URL}/th`);
      if (!response.ok) {
        throw new Error('Netzwerk-Fehler (fetchHead)');
      }

      return await response.json();
    } catch (error) {
      console.error('Fehler beim Abrufen (fetchHead): ', error);
      return null;
    }
  },

  /**
   * Ruft **alle** vorhandenen **Fahrräder** aus der Datenbank ab.
   * @param {number} page - Die Seitennummer für die Paginierung.
   */
  fetchAll: async (page: number): Promise<Record<string, any>[] | null> => {
    try {
      const response = await fetch(`${API_URL}?page=${page}`);
      if (!response.ok) {
        throw new Error('Netzwerk-Fehler (fetchAll)');
      }

      return await response.json();
    } catch (error) {
      console.error('Fehler beim Abrufen (fetchAll): ', error);
      return null;
    }
  },

  /**
   * Ruft Fahrräder inklusive ihrer verknüpften Attribute ab.
   * @param {number} page - Die Seitennummer.
   */
  fetchAllWithAttributes: async (page: number): Promise<Record<string, any>[] | null> => {
    try {
      const response = await fetch(`${API_URL}/att?page=${page}`);
      if (!response.ok) {
        throw new Error('Netzwerk-Fehler (fetchAllWithAttributes)');
      }

      return await response.json();
    } catch (error) {
      console.error('Fehler beim Abrufen (fetchAllWithAttributes): ', error);
      return null;
    }
  },

  /**
   * **Sucht** ein spezifisches Fahrrad-Objekt anhand der **ID**.
   * @param {number} id - Der PK des Fahrrads.
   */
  fetchById: async (id: number): Promise<Record<string, any> | null> => {
    try {
      const response = await fetch(`${API_URL}/id/${id}`, { method: 'GET' });

      if (!response.ok) {
        throw new Error('Netzwerk-Fehler (fetchById)');
      }

      return await response.json();
    } catch (error) {
      console.error('Fehler beim Abrufen (fetchById):', error);
      return null;
    }
  },

  /**
   * **Sucht** nach Fahrrädern anhand eines **Strings**. 
   * @param {string} col - Die Tabellenspalte (z.B. marke).
   * @param {string} val - Der gesuchte Wert.
   */
  fetchByString: async (col: string, val: string): Promise<Record<string, any> | null> => {
    try {
      const response = await fetch(`${API_URL}/string/${col}/${val}`, { method: 'GET' });

      if (!response.ok) {
        throw new Error('Netzwerk-Fehler (fetchByString)');
      }

      return await response.json();
    } catch (error) {
      console.error('Fehler beim Abrufen (fetchByString):', error);
      return null;
    }
  },

  /**
   * **Sucht** nach Fahrrädern anhand eines Datums.
   * @param {string} col - Die Datumspalte.
   * @param {Date} val - Das gesuchte Datum.
   */
  fetchByDate: async (col: string, val: Date): Promise<Record<string, any> | null> => {
    try {
      const response = await fetch(`${API_URL}/date/${col}/${val.toISOString()}`, { method: 'GET' });

      if (!response.ok) {
        throw new Error('Netzwerk-Fehler (fetchByDate)');
      }

      return await response.json();
    } catch (error) {
      console.error('Fehler beim Abrufen (fetchByDate):', error);
      return null;
    }
  },

  /**
   * **Aktualisiert** ein bestehendes Fahrrad vollständig (ideal für Formular-Submit).
   * @param {number} id - Der Primary Key des Datensatzes.
   * @param {Fahrrad | Record<string, any>} data - Die neuen Daten des Fahrrads.
   * @returns {Promise<boolean>} `true` bei Erfolg, `false` bei Fehler.
   */
  update: async (id: number, data: Fahrrad | Record<string, any>): Promise<boolean> => {
    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error('Fehler beim Aktualisieren (update)');
      }

      return true;
      
    } catch (error) {
      console.error('Fehler beim Aktualisieren (update):', error);
      return false;
    }
  },

  /**
   * **Bearbeitet ein einzelnes Feld** eines Fahrrads via URL-Parameter.
   * @param {number} id - Der Primary Key des Datensatzes.
   * @param {string} col - Die Spalte (z.B. marke).
   * @param {string} val - Der neue Wert.
   */
  editById: async (id: number, col: string, val: string): Promise<Record<string, any> | null> => {
    try {
      const response = await fetch(`${API_URL}/${id}/${col}/${val}`, { method: 'PUT' });

      if (!response.ok) {
        throw new Error('Netzwerk-Fehler (editById)');
      }

      return await response.json();
    } catch (error) {
      console.error('Fehler beim Bearbeiten (editById): ', error);
      return null;
    }
  },

  /**
   * **Löscht** ein **Fahrrad** anhand seiner **ID**.
   * @param {number} id - Der PK des Fahrrads.
   * @returns {Promise<boolean>} Gibt `true` bei erfolgreicher Löschung zurück, sonst `false`.
   */
  deleteById: async (id: number): Promise<boolean> => {
    try 
    {
      
      const response = await fetch(`${API_URL}/${id}`, { 
        method: 'DELETE' 
      });

      if (!response.ok) {
        throw new Error('Netzwerk-Fehler (deleteById)');
      }

      return true;

    } catch (error) 
    {
      console.error('Fehler beim Löschen (deleteById): ', error);

      return false;
    }
  },
};