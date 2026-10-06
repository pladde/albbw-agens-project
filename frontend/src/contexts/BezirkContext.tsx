import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

interface Bezirk {
    bezirk_id: number;
    name: string;
    kuerzel: string;
}

interface BezirkContextType {
    bezirke: Bezirk[];
    bezirkId: number | null;
    selectedBezirk: Bezirk | null;
    setBezirkId: (id: number) => void;
    loading: boolean;
    error: string;
    refreshBezirke: () => Promise<void>;
}


const BezirkContext = createContext<BezirkContextType | undefined>(undefined);

export const BezirkProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [bezirke, setBezirke] = useState<Bezirk[]>([]);
    const [bezirkId, setBezirkIdState] = useState<number | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const refreshBezirke = async () => {
        try {
            const response = await fetch('http://localhost:3001/api/bezirk');
            if (!response.ok) {
                throw new Error('Fehler beim Laden der Bezirke');
            }
            const data = await response.json();
            setBezirke(data);
            setBezirkIdState((prev) => {
                if (prev !== null) return prev;
                return data.length > 0 ? data[0].bezirk_id : null;
            });
        } catch (err) {
            setError(err instanceof Error ? err.message : 'unbekannter Fehler');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        refreshBezirke();
    }, []);

    const setBezirkId = (id: number) => {
        setBezirkIdState(id);
    };

    const selectedBezirk = bezirke.find((b) => b.bezirk_id === bezirkId) || null;

    return (
        <BezirkContext.Provider value={{ bezirke, bezirkId, selectedBezirk, setBezirkId, loading, error, refreshBezirke }}>
            {children}
        </BezirkContext.Provider>
    );
};

export const useBezirk = (): BezirkContextType => {
    const context = useContext(BezirkContext);
    if (context === undefined) {
        throw new Error('useBezirk muss innerhalb des BezirkProvider verwendet werden');
    }
    return context;
};