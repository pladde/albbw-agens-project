import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Table, Spinner, Alert } from 'react-bootstrap';
import { Search } from 'react-bootstrap-icons';
import { useNavigate } from 'react-router-dom';
import { useBezirk } from '../../contexts/BezirkContext';

interface Auftrag {
    auftrag_id: number;
    daten: string | null;
    erstellt_am: string;
    p_id: number;
    bez_id: number;
    titel: string | null;
    bezirk_name: string | null;
}

// Hilfsfunktion: JSON-Daten aus der daten-Spalte parsen
function parseDaten(daten: string | null): any {
    if (!daten) return {};
    try {
        return JSON.parse(daten);
    } catch {
        return {};
    }
}

export const DienstleistungSuchenPage: React.FC = () => {
    const navigate = useNavigate();

    // Ausgewählter Bezirk aus dem globalen Context
    const { bezirkId, selectedBezirk } = useBezirk();

    const [auftraege, setAuftraege] = useState<Auftrag[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');


    // Filter-Felder
    const [auftragId, setAuftragId] = useState('');
    const [titel, setTitel] = useState('');
    const [status, setStatus] = useState('');
    const [tag, setTag] = useState('');
    const [monat, setMonat] = useState('');
    const [jahr, setJahr] = useState('');
    const [selectedId, setSelectedId] = useState<number | null>(null);



    // Daten vom Backend laden – nur Aufträge des ausgewählten Bezirks
    useEffect(() => {
        if (bezirkId === null) {
            setAuftraege([]);
            setLoading(false);
            return;
        }

        setLoading(true);
        setError('');

        const fetchAuftraege = async () => {
            try {
                const response = await fetch(`http://localhost:3001/api/auftrag/bezirk/${bezirkId}`);
                if (!response.ok) {
                    throw new Error('Fehler beim Laden der Aufträge');
                }
                const data = await response.json();
                setAuftraege(data);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Unbekannter Fehler');
            } finally {
                setLoading(false);
            }
        };
        fetchAuftraege();
    }, [bezirkId]);

    // Filtern
    const gefiltert = auftraege.filter((a) => {
        const json = parseDaten(a.daten);

        const auftragTitel = a.titel || '';
        const auftragStatus = json.status || '';

        // Datum-Filter
        const datum = new Date(a.erstellt_am);
        const datumMatch =
            !tag && !monat && !jahr
                ? true
                : String(datum.getDate()).padStart(2, '0') === tag.padStart(2, '0') &&
                  String(datum.getMonth() + 1).padStart(2, '0') === monat.padStart(2, '0') &&
                  String(datum.getFullYear()) === jahr;

        return (
            String(a.auftrag_id).toLowerCase().includes(auftragId.toLowerCase()) &&
            (status === '' || auftragStatus === status) &&
            (titel === '' || auftragTitel.toLowerCase().includes(titel.toLowerCase())) &&
            datumMatch
        );
    });

    const inputStyle: React.CSSProperties = {
        height: '38px',
        fontSize: '15px',
        border: '1px solid #ccc',
        borderRadius: '4px',
    };

    const spinnerStyle: React.CSSProperties = {
        width: '60px',
        ...inputStyle,
    };

    const headerBg = '#5374a5';

    // Löschen-Funktion
    const handleDelete = async (id: number) => {
        if (!window.confirm(`Auftrag ${id} wirklich löschen?`)) return;
        try {
            const response = await fetch(`http://localhost:3001/api/auftrag/${id}`, {
                method: 'DELETE',
            });
            if (!response.ok) {
                throw new Error('Fehler beim Löschen');
            }
            setAuftraege(auftraege.filter((a) => a.auftrag_id !== id));
            setSelectedId(null);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unbekannter Fehler');
        }
    };

    return (
        <Container
            fluid
            style={{ minHeight: 'calc(100vh - 60px)', background: '#e8e8e8', padding: '30px 40px' }}
        >
            {error && <Alert variant="danger">{error}</Alert>}

            {/* Hinweis auf den aktuell ausgewählten Bezirk */}
            <div className="mb-3" style={{ fontWeight: 500, fontSize: '16px', color: '#324360' }}>
                Aktiver Bezirk: <strong>{selectedBezirk?.name || 'Kein Bezirk ausgewählt'}</strong>
            </div>

            {/* Filter-Leiste */}
            <Row className="mb-3 align-items-end g-3">
                <Col xs="auto">
                    <Form.Label style={{ fontWeight: 500, marginBottom: 4 }}>Auftrags-ID</Form.Label>
                    <div className="d-flex align-items-center gap-1">
                        <Form.Control
                            value={auftragId}
                            onChange={(e) => setAuftragId(e.target.value)}
                            placeholder="15"
                            style={{ width: '130px', ...inputStyle }}
                        />
                        <Search />
                    </div>
                </Col>

                <Col xs="auto">
                    <Form.Label style={{ fontWeight: 500, marginBottom: 4 }}>Titel</Form.Label>
                    <div className="d-flex align-items-center gap-1">
                        <Form.Control
                            value={titel}
                            onChange={(e) => setTitel(e.target.value)}
                            style={{ width: '140px', ...inputStyle }}
                        />
                        <Search />
                    </div>
                </Col>


                <Col xs="auto">
                    <Form.Label style={{ fontWeight: 500, marginBottom: 4 }}>
                        status
                    </Form.Label>
                    <Form.Select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        style={{ width: '175px', ...inputStyle }}
                    >
                        <option value="">Bitte wählen...</option>
                        <option>In Bearbeitung</option>
                        <option>Abgeschlossen</option>
                    </Form.Select>
                </Col>

                <Col xs="auto">
                    <Form.Label style={{ fontWeight: 500, marginBottom: 4 }}>Datum</Form.Label>
                    <div className="d-flex gap-1">
                        <Form.Control
                            type="number"
                            placeholder="TT"
                            min={1}
                            max={31}
                            value={tag}
                            onChange={(e) => setTag(e.target.value)}
                            style={spinnerStyle}
                        />
                        <Form.Control
                            type="number"
                            placeholder="MM"
                            min={1}
                            max={12}
                            value={monat}
                            onChange={(e) => setMonat(e.target.value)}
                            style={spinnerStyle}
                        />
                        <Form.Control
                            type="number"
                            placeholder="JJJJ"
                            value={jahr}
                            onChange={(e) => setJahr(e.target.value)}
                            style={{ width: '80px', ...inputStyle }}
                        />
                    </div>
                </Col>
            </Row>

            {/* Ergebnistabelle */}
            <div
                style={{
                    border: '1px solid #bbb',
                    borderRadius: '6px',
                    overflow: 'hidden',
                    minHeight: '300px',
                    background: '#e8e8e8',
                }}
            >
                {loading ? (
                    <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '300px' }}>
                        <Spinner animation="border" variant="primary" />
                    </div>
                ) : (
                    <Table hover style={{ marginBottom: 0 }}>
                        <thead>
                            <tr style={{ background: headerBg, color: 'white' }}>
                                <th style={{ background: headerBg, color: 'white' }}>Auftrags-ID</th>
                                <th style={{ background: headerBg, color: 'white' }}>Titel</th>
                                <th style={{ background: headerBg, color: 'white' }}>Status</th>
                                <th style={{ background: headerBg, color: 'white' }}>Datum</th>
                            </tr>
                        </thead>
                        <tbody>
                            {gefiltert.map((a) => {
                                const json = parseDaten(a.daten);
                                const datum = new Date(a.erstellt_am);
                                return (
                                    <tr
                                        key={a.auftrag_id}
                                        onClick={() => setSelectedId(a.auftrag_id)}
                                        style={{
                                            cursor: 'pointer',
                                            background:
                                                selectedId === a.auftrag_id ? '#d0d8e8' : 'transparent',
                                        }}
                                    >
                                        <td>{a.auftrag_id}</td>
                                        <td>{a.titel || '-'}</td>
                                        <td>{json.status || '-'}</td>
                                        <td>
                                            {datum.toLocaleDateString('de-DE')}
                                        </td>
                                    </tr>
                                );
                            })}
                            {gefiltert.length === 0 && (
                                <tr>
                                    <td colSpan={4} className="text-center py-4">
                                        Keine Aufträge gefunden
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </Table>
                )}
            </div>

            {/* Aktions-Buttons */}
            <div className="mt-3 d-flex gap-2">
                <Button
                    disabled={!selectedId}
                    className="agens-button-primary"
                    onClick={() => navigate(`/dienstleistung/erfassen/${selectedId}`)}
                    style={{ border: 'none', borderRadius: '6px' }}
                >
                    bearbeiten
                </Button>
                <Button
                    disabled={!selectedId}
                    className="agens-button-primary"
                    style={{ border: 'none', borderRadius: '6px' }}
                    onClick={() => selectedId && handleDelete(selectedId)}
                >
                    löschen
                </Button>
            </div>

            {/* Zurück-Button */}
            <div className="d-flex justify-content-end mt-4">
                <Button
                    onClick={() => navigate('/dienstleistung')}
                    className="agens-button-primary"
                    style={{ border: 'none', borderRadius: '6px' }}
                >
                    zurück
                </Button>
            </div>
        </Container>
    );
};