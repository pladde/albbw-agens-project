import React, { useState, useEffect } from 'react';
import {
    Container,
    Row,
    Col,
    Form,
    Button,
    OverlayTrigger,
    Tooltip,
    Alert,
    Spinner,
} from 'react-bootstrap';
import { InfoCircle } from 'react-bootstrap-icons';
import { useNavigate, useParams } from 'react-router-dom';
import { useBezirk } from '../../contexts/BezirkContext';

interface Projekt {
    projekt_id: number;
    titel: string;
}

const STATUS_OPTIONEN = [
    'Angenommen',
    'Abgeschlossen'
];

export const DienstleistungErfassenPage: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id?: string }>();
    const isBearbeiten = Boolean(id);
    // Ausgewählter Bezirk aus dem globalen Context
    const { bezirkId, selectedBezirk } = useBezirk();
    // Felder
    const [projektId, setProjektId] = useState<number | ''>('');
    const [projekte, setProjekte] = useState<Projekt[]>([]);
    const [auftragId, setAuftragId] = useState<string>(''); // read-only, vom Backend generiert
    const [tag, setTag] = useState('');
    const [monat, setMonat] = useState('');
    const [jahr, setJahr] = useState('');
    const [status, setStatus] = useState('Angenommen');
    const [zusatzInfos, setZusatzInfos] = useState<{ key: string; value: string }[]>([
        { key: '', value: '' },
    ]);
    const [loading, setLoading] = useState(isBearbeiten);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const labelStyle: React.CSSProperties = { fontWeight: 500, marginBottom: 4 };
    const inputStyle: React.CSSProperties = { fontSize: '15px' };

    // Projekte immer laden (für Neu und Bearbeiten)
    useEffect(() => {

        const fetchProjekte = async () => {
            try {
                const response = await fetch('http://localhost:3001/api/projekt');
                if (!response.ok) {
                    throw new Error('Fehler beim Laden der Projekte');
                }
                const data = await response.json();
                // console.log(data);
                setProjekte(data);

            } catch (err) {
                setError(err instanceof Error ? err.message : 'Unbekannter Fehler');
            }
        };
        fetchProjekte();
    }, []);

    // Wenn eine ID vorhanden ist, lade den Auftrag vom Backend
    useEffect(() => {
        if (!id) {
            setLoading(false);
            // Bei einem neuen Auftrag das heutige Datum automatisch vorbelegen
            const datum = new Date();
            setTag(String(datum.getDate()).padStart(2, '0'));
            setMonat(String(datum.getMonth() + 1).padStart(2, '0'));
            setJahr(String(datum.getFullYear()));
            return;
        }

        const fetchAuftrag = async () => {
            try {
                const response = await fetch(`http://localhost:3001/api/auftrag/${id}`);
                console.log(response)
                if (!response.ok) {
                    throw new Error('Auftrag nicht gefunden');
                }
                const data = await response.json();
                setAuftragId(String(data.auftrag_id));
                setProjektId(data.p_id || '');

                // JSON-Daten parsen
                const json = data.daten ? JSON.parse(data.daten) : {};
                setStatus(json.status || 'Angenommen');

                // Zusatz-Infos aus JSON laden
                if (Array.isArray(json.zusatz_infos) && json.zusatz_infos.length > 0) {
                    setZusatzInfos(json.zusatz_infos);
                }

                // Datum aus erstellt_am extrahieren
                if (data.erstellt_am) {
                    console.log(data.erstellt_am)
                    const datum = new Date(data.erstellt_am);
                    setTag(String(datum.getDate()).padStart(2, '0'));
                    setMonat(String(datum.getMonth() + 1).padStart(2, '0'));
                    setJahr(String(datum.getFullYear()));
                } else {
                    const datum = new Date();
                    setTag(String(datum.getDate()).padStart(2, '0'));
                    setMonat(String(datum.getMonth() + 1).padStart(2, '0'));
                    setJahr(String(datum.getFullYear()));
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Unbekannter Fehler');
            } finally {
                setLoading(false);
            }
        };
        fetchAuftrag();
    }, [id]);



    // Zusatz-Infos (Key-Value) verwalten
    const handleZusatzInfoChange = (index: number, field: 'key' | 'value', value: string) => {
        setZusatzInfos((prev) =>
            prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
        );
    };

    const handleAddZusatzInfo = () => {
        setZusatzInfos((prev) => [...prev, { key: '', value: '' }]);
    };

    const handleRemoveZusatzInfo = (index: number) => {
        setZusatzInfos((prev) => prev.filter((_, i) => i !== index));
    };

    // Speichern
    const handleSubmit = async () => {
        setSaving(true);
        setError('');
        setSuccess('');

        // Validierung
        if (!projektId) {
            setError('Bitte wählen Sie ein Projekt aus.');
            setSaving(false);
            return;
        }
        if (!bezirkId) {
            setError('Kein Bezirk ausgewählt. Bitte wählen Sie zuerst einen Bezirk aus.');
            setSaving(false);
            return;
        }

        // Datum formatieren
        const erstellt_am = `${jahr}-${monat}-${tag}`;
        // console.log(erstellt_am)


        // JSON-Daten für die daten-Spalte zusammenstellen
        const daten = {
            status,
            erstellt_am,
            zusatz_infos: zusatzInfos.filter((zi) => zi.key.trim() !== '' || zi.value.trim() !== ''),
        };
        console.log(daten)

        try {
            if (isBearbeiten) {
                // PUT - Auftrag aktualisieren
                const response = await fetch(`http://localhost:3001/api/auftrag/${id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        p_id: projektId,
                        bez_id: bezirkId,
                        daten: JSON.stringify(daten),
                    }),
                });
                if (!response.ok) {
                    const errData = await response.json();
                    throw new Error(errData.message || 'Fehler beim Aktualisieren');
                }
                setSuccess('Auftrag erfolgreich aktualisiert!');
            } else {
                // POST - Neuen Auftrag erstellen
                const response = await fetch('http://localhost:3001/api/auftrag', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        p_id: projektId,
                        bez_id: bezirkId,
                        daten: JSON.stringify(daten),
                    }),
                });
                if (!response.ok) {
                    const errData = await response.json();
                    throw new Error(errData.message || 'Fehler beim Erstellen');
                }
                setSuccess('Auftrag erfolgreich erstellt!');
            }

            // Nach kurzer Verzögerung zur Suchen-Seite navigieren
            setTimeout(() => navigate('/dienstleistung/suchen'), 1500);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Unbekannter Fehler');
        } finally {
            setSaving(false);
        }
    };

    // Spinner
    if (loading) {
        return (
            <Container
                fluid
                className="d-flex justify-content-center align-items-center"
                style={{ minHeight: 'calc(100vh - 60px)', background: '#e8e8e8' }}
            >
                <Spinner animation="border" variant="primary" />
            </Container>
        );
    }

    return (
        <Container
            fluid
            style={{ minHeight: 'calc(100vh - 60px)', background: '#e8e8e8', padding: '30px 40px' }}
        >
            {error && <Alert variant="danger">{error}</Alert>}
            {success && <Alert variant="success">{success}</Alert>}

            {/* Hinweis auf den aktuell ausgewählten Bezirk */}
            <div className="mb-3" style={{ fontWeight: 500, fontSize: '16px', color: '#324360' }}>
                Aktiver Bezirk: <strong>{selectedBezirk?.name || 'Kein Bezirk ausgewählt'}</strong>
            </div>

            {/* Auftrags-ID (read-only) */}
            <Row className="mb-3">
                <Col xs={12} md={4}>
                    <Form.Label style={labelStyle}>
                        Auftrags-ID{' '}
                        <OverlayTrigger
                            placement="right"
                            overlay={<Tooltip>Wird automatisch vom System vergeben.</Tooltip>}
                        >
                            <InfoCircle style={{ color: '#5374a5', cursor: 'pointer' }} />
                        </OverlayTrigger>
                    </Form.Label>
                    <Form.Control
                        value={auftragId || (isBearbeiten ? id : 'Wird automatisch vergeben')}
                        readOnly
                        style={{ background: '#c8c8c8', ...inputStyle, width: '160px' }}
                    />
                </Col>
            </Row>

            {/* Projekt */}
            <Row className="mb-3">
                <Col xs={12} md={4}>
                    <Form.Label style={labelStyle}>Projekt</Form.Label>
                    <Form.Select
                        value={projektId}
                        onChange={(e) => setProjektId(e.target.value ? Number(e.target.value) : '')}
                        style={{ ...inputStyle, maxWidth: '300px' }}
                    >
                        <option value="">Bitte wählen...</option>
                        {projekte.map((p) => (
                            <option key={p.projekt_id} value={p.projekt_id}>
                                {p.titel}
                            </option>
                        ))}
                    </Form.Select>
                </Col>
            </Row>


            {/* Eingangsdatum */}
            <Row className="mb-3">
                <Col xs={12}>
                    <Form.Label style={labelStyle}>Eingangsdatum</Form.Label>
                    <div className="d-flex gap-2">
                        <Form.Control
                            type="number"
                            min={1}
                            max={31}
                            value={tag}
                            onChange={(e) => setTag(e.target.value)}
                            style={{ width: '70px', ...inputStyle }}
                        />
                        <Form.Control
                            type="number"
                            min={1}
                            max={12}
                            value={monat}
                            onChange={(e) => setMonat(e.target.value)}
                            style={{ width: '70px', ...inputStyle }}
                        />
                        <Form.Control
                            type="number"
                            value={jahr}
                            onChange={(e) => setJahr(e.target.value)}
                            style={{ width: '90px', ...inputStyle }}
                        />
                    </div>
                </Col>
            </Row>

            {/* Status (Aktiv) */}
            <Row className="mb-3">
                <Col xs={12} md={3}>
                    <Form.Label style={labelStyle}>Bearbeitungsstatus</Form.Label>
                    <Form.Select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        style={inputStyle}
                    >
                        {STATUS_OPTIONEN.map((s) => (
                            <option key={s}>{s}</option>
                        ))}
                    </Form.Select>
                </Col>
            </Row>

            {/* Weitere Informationen (Key-Value) */}
            <Row className="mb-3">
                <Col xs={12} md={6}>
                    <Form.Label style={labelStyle}>Weitere Informationen</Form.Label>
                    {zusatzInfos.map((info, index) => (
                        <div key={index} className="d-flex gap-2 mb-2 align-items-center">
                            <Form.Control
                                type="text"
                                placeholder="Schlüssel"
                                value={info.key}
                                onChange={(e) => handleZusatzInfoChange(index, 'key', e.target.value)}
                                style={{ ...inputStyle, maxWidth: '200px' }}
                            />
                            <Form.Control
                                type="text"
                                placeholder="Wert"
                                value={info.value}
                                onChange={(e) => handleZusatzInfoChange(index, 'value', e.target.value)}
                                style={{ ...inputStyle, maxWidth: '300px' }}
                            />
                            {zusatzInfos.length > 1 && (
                                <Button
                                    variant="link"
                                    onClick={() => handleRemoveZusatzInfo(index)}
                                    style={{ padding: 0, fontSize: '20px', color: '#dc3545', textDecoration: 'none', lineHeight: 1 }}
                                    title="Zeile entfernen"
                                >
                                    ×
                                </Button>
                            )}
                        </div>
                    ))}
                    <Button
                        variant="link"
                        onClick={handleAddZusatzInfo}
                        style={{ padding: 0, fontSize: '22px', color: '#5374a5', textDecoration: 'none', lineHeight: 1 }}
                        title="Weitere Information hinzufügen"
                    >
                        +
                    </Button>
                </Col>
            </Row>






            {/* Senden */}
            <Button
                onClick={handleSubmit}
                disabled={saving}
                className="agens-button-primary"
                style={{
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '16px',
                    padding: '10px 30px',
                }}
            >
                {saving ? 'Wird gespeichert...' : 'senden'}
            </Button>

            {/* Zurück */}
            <div className="d-flex justify-content-end mt-4">
                <Button
                    onClick={() => navigate(-1)}
                    className="agens-button-primary"
                    style={{
                        border: 'none',
                        borderRadius: '6px'
                    }}
                >
                    zurück
                </Button>
            </div>
        </Container>
    );
};