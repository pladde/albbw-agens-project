import type { IFahrrad } from "../types/IFahrrad";

const API_URL = 'http://localhost:3000/api/fahrrad';

/**
 * Das Service-Modul für die Kommunikation zwischen Frontend und Backend
 * zur Verwaltung von Fahrrädern.
 */
export const fahrradService = {
    /**
     * Sendet eine Anfrage an das Backend um ein **neues Fahrrad-Objekt** zu **erstellen**
     * @param {IFahrrad} data - Das vollständig ausgefüllte Fahrrad-Objekt.
     * @returns {Promise<IFahrrad | null>} Das vom Server erstellte Objekt (inkl. generierter ID) oder null bei Fehler.
     */
    create: async (data: IFahrrad): Promise<IFahrrad | null> => {
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

        } catch (error)
        {
            console.error('Fehler im Service (create): ', error);
            return null;
        }
    },

    fetchHead: async (): Promise<string[] | null> => {
        try
        {
            const response = await fetch(`${API_URL}/th`);
            if(!response.ok)
            {
                throw new Error('Netzwerk-Fehler (fetchAll)');
            }

            return await response.json();

        } catch (error)
        {
            console.error("Fehler beim Abrufen (fetchHead): " , error);
            return null;  
        }
    },

    /**
     * Ruft **alle** vorhandenen **Fahrräder** aus der Datenbank ab.
     * @returns {Promise<IFahrrad[] | null>} Ein Array aller Fahrräder oder `null` bei Fehler.
     */
    fetchAll: async (): Promise<IFahrrad[] | null> => {
        try
        {
            const response = await fetch(`${API_URL}`);
            if(!response.ok)
            {
                throw new Error('Netzwerk-Fehler (fetchAll)');
            }

            return await response.json();  
    
        } catch (error)
        {
            console.error("Fehler beim Abrufen (fetchAll): " , error);
            return null;
        }
    },

    /**
     * **Sucht** ein spezifisches Fahrrad-Objekt anhand der **ID** aus der Datenbank.
     * @param {number} id Der PK des Fahrrads
     * @returns {Promise<IFahrrad | null>} Das gefundene Fahrrad oder `null` bei Fehler.
     */
    fetchById: async (id: number): Promise<IFahrrad | null> => {
        try {
            const response = await fetch(`${API_URL}/id/${id}`, { method: 'GET' });

            if (!response.ok)
            {
                throw new Error('Netzwerk-Fehler (fetchById)');
            }

            return await response.json();  

        } catch (error)
        {
            console.log('Fehler beim Abrufen (fetchById):', error);
            return null;
        }
    },

    /**
     * **Sucht** nach **einem oder mehreren Fahrrädern** anhand eines **Strings**. 
     * @param {string} col Die Tabellenspalte, in der gesucht wird. (z.B. marke)
     * @param {string} val Der Wert nach dem gesucht wird. (z.B. Canyon)
     * @returns {Promise<IFahrrad | null>} Das gefundene Fahrrad oder `null` bei Fehler.
     */
    fetchByString: async (col: string, val: string): Promise<IFahrrad[] | null> => {

        try
        {
            const response = await fetch(`${API_URL}/string/${col}&${val}`, { method: 'GET' });

            if (!response.ok) 
            {
                throw new Error('Netzwerk-Fehler (fetchByString)');
            }

            return await response.json();    

        } catch (error)
        {
            console.error('Fehler beim Abrufen (fetchByString):', error);
            return null;
        } 
    },

    /**
     * **Sucht** nach **einem oder mehreren Fahrrädern** anhand eines spezifischen Datums.
     * @param {string} col - DIe Spalte in der gesucht werden soll. (z.B. eingangsdatum)
     * @param {Date} val - Das Datum nach dem gesucht werden soll. (z.B. YYYY-MM-DD HH:MM:SS) 
     * @returns {Promise<IFahrrad[] | null>} Gibt das Array mit den gefundenen Fahrrädern oder `null` bei Fehler zurück.
     */
    fetchByDate: async (col: string, val: Date): Promise<IFahrrad[] | null> => {

        try
        {
            const response = await fetch(`${API_URL}/date/${col}&${val}`,{ method: 'GET' });

            if (!response.ok)
            {
                throw new Error('Netzwerk-Fehler (fetchByDate)');
            }

            return await response.json();  

        } catch (error)
        {
            console.error('Fehler beim Abrufen (fetchByDate):', error);
            return null;
        }
    },

    /**
     * **Löscht** ein **Fahrrad** anhand seiner **ID** aus der Datenbank.
     * @param {number} id - Der PK des Fahrrads.
     * @returns {Promise<IFahrrad | null>} Gibt das gelöscht Fahrrad-Objekt oder `null` bei Fehler zurück.
     */
    deleteById: async (id: number): Promise<IFahrrad | null> => {

        try
        {
            const response = await fetch(`${API_URL}/${id}` ,{ method: 'DELETE'});

            if (!response.ok)
            {
                throw new Error('Netzwerk-Fehler (deleteById)');
            }

            return await response.json();  

        } catch (error) 
        {
            console.error('Fehler beim Löschen (deleteById): ', error);
            return null;
        }
    },

    /**
     * **Bearbeitet** ein Fahrrad anhand seines **Primärschlüssels** in der Datenbank.
     *  
     * *Es können nur VARCHAR-Werte bearbeitet werden.*
     * @param {number} id - Der Primary Key des Datensatzes.
     * @param {string} col - Die Spalte, in welcher der Wert geändert werden soll. (z.B. marke)
     * @param {string} val - Das exakte Datenfeld, welches geändert werden soll. (z.B. Canyon -> Cube)
     * @returns {Promise<IFahrrad | null>} Gibt den überarbeiteten Datensatz oder `null` bei Fehler zurück.
     */
    editById: async (id: number, col: string, val: string): Promise<IFahrrad | null> => {

        try 
        {
            const response = await fetch(`${API_URL}/${id}&${col}&${val}`, { method: 'PUT' });

            if (!response.ok)
            {
                throw new Error('Netzwerk-Fehler (editById)');
            }

            return await response.json();

        } catch (error)
        {
            console.error('Fehler beim Bearbeiten (editById): ', error);
            return null;
        }
    }
};