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

const KATEGORIEN = [
    'Holzwerkstatt',
    'Elektronik',
    'Fahrrad',
    'Nähwerkstatt',
    'Möbel',
    'Sonstiges',
];

const STATUS_OPTIONEN = [
    'Angenommen',
    'In Bearbeitung',
    'Abgeschlossen',
    'Herausgegeben',
];

export const DienstleistungErfassenPage: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id?: string }>();
    const isBearbeiten = Boolean(id);

    // Ausgewählter Bezirk aus dem globalen Context
    const { bezirkId, selectedBezirk } = useBezirk();

    // Felder
    const [auftragId, setAuftragId] = useState<string>(''); // read-only, vom Backend generiert
    const [kategorie, setKategorie] = useState('');
    const [beschreibung, setBeschreibung] = useState('');
    const [besonderheiten, setBesonderheiten] = useState('');
    const [tag, setTag] = useState('');
    const [monat, setMonat] = useState('');
    const [jahr, setJahr] = useState('');
    const [status, setStatus] = useState('Angenommen');
    const [kunde, setKunde] = useState('');

    const [loading, setLoading] = useState(isBearbeiten);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const labelStyle: React.CSSProperties = { fontWeight: 500, marginBottom: 4 };
    const inputStyle: React.CSSProperties = { fontSize: '15px' };

    // Wenn eine ID vorhanden ist, lade den Auftrag vom Backend
    useEffect(() => {
        if (!id) return;

        const fetchAuftrag = async () => {
            try {
                const response = await fetch(`http://localhost:3001/api/auftrag/${id}`);
                if (!response.ok) {
                    throw new Error('Auftrag nicht gefunden');
                }
                const data = await response.json();
                setAuftragId(String(data.auftrag_id));

                // JSON-Daten parsen
                const json = data.daten ? JSON.parse(data.daten) : {};
                setKategorie(json.kategorie || '');
                setBeschreibung(json.beschreibung || '');
                setBesonderheiten(json.besonderheiten || '');
                setStatus(json.status || 'Angenommen');
                setKunde(json.kunde || '');

                // Datum aus erstellt_am extrahieren
                if (data.erstellt_am) {
                    const datum = new Date(data.erstellt_am);
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

    const handleSubmit = async () => {
        setSaving(true);
        setError('');
        setSuccess('');

        // JSON-Daten für die daten-Spalte zusammenstellen
        const daten = {
            kategorie,
            beschreibung,
            besonderheiten,
            status,
            kunde,
        };

        // Datum formatieren
        const eingangsdatum = `${jahr}-${monat}-${tag}`;

        try {
            if (isBearbeiten) {
                // PUT - Auftrag aktualisieren
                const response = await fetch(`http://localhost:3001/api/auftrag/${id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        p_id: 1, // TODO: Projekt-ID auswählbar machen
                        bez_id: bezirkId, // Ausgewählter Bezirk aus dem Header-Dropdown
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
                        p_id: 1, // TODO: Projekt-ID auswählbar machen
                        bez_id: bezirkId, // Ausgewählter Bezirk aus dem Header-Dropdown
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

            {/* Kategorie */}
            <Row className="mb-3">
                <Col xs={12} md={4}>
                    <Form.Label style={labelStyle}>Kategorie</Form.Label>
                    <Form.Select
                        value={kategorie}
                        onChange={(e) => setKategorie(e.target.value)}
                        style={{ ...inputStyle, maxWidth: '300px' }}
                    >
                        <option value="">Bitte wählen...</option>
                        {KATEGORIEN.map((k) => (
                            <option key={k}>{k}</option>
                        ))}
                    </Form.Select>
                </Col>
            </Row>

            {/* Beschreibung */}
            <Row className="mb-3">
                <Col xs={12} md={5}>
                    <Form.Label style={labelStyle}>Beschreibung</Form.Label>
                    <Form.Control
                        value={beschreibung}
                        onChange={(e) => setBeschreibung(e.target.value)}
                        placeholder="Kurzbeschreibung des Auftrags"
                        style={inputStyle}
                    />
                </Col>
            </Row>

            {/* Besonderheiten */}
            <Row className="mb-3">
                <Col xs={12} md={5}>
                    <Form.Label style={labelStyle}>Besonderheiten</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={4}
                        value={besonderheiten}
                        onChange={(e) => setBesonderheiten(e.target.value)}
                        style={inputStyle}
                    />
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

            {/* Bearbeitungsstatus */}
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

            {/* Kunde/Einrichtung */}
            <Row className="mb-4">
                <Col xs={12} md={5}>
                    <Form.Label style={labelStyle}>Kunde/Einrichtung</Form.Label>
                    <div className="d-flex align-items-center gap-3">
                        <Form.Select
                            value={kunde}
                            onChange={(e) => setKunde(e.target.value)}
                            style={{ ...inputStyle, maxWidth: '300px' }}
                        >
                            <option value="">Kunden wählen...</option>
                            <option>Max Mustermann</option>
                            <option>Lisa Beispiel</option>
                        </Form.Select>
                        <span>oder</span>
                        <Button
                            variant="secondary"
                            style={{ borderRadius: '6px', whiteSpace: 'nowrap' }}
                            onClick={() => navigate('/kunde/neu')}
                        >
                            neuen Kunden anlegen
                        </Button>
                    </div>
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