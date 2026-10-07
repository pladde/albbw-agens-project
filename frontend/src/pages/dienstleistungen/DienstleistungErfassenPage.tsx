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
import '../../components/custom-style-agens.css';

interface ServiceBereich {
    service_bereich_id: number;
    name: string;
    beschreibung: string | null;
    aktiv: number;
}

interface Mitarbeiter {
    mitarbeiter_id: number;
    vorname: string;
    nachname: string;
    email: string | null;
    telefon: string | null;
}

interface StatusOption {
    status_id: number;
    status: string;
}

export const DienstleistungErfassenPage: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id?: string }>();
    const isBearbeiten = Boolean(id);
    // Ausgewählter Bezirk aus dem globalen Context
    const { bezirkId, selectedBezirk } = useBezirk();

    // Felder
    const [serviceBereichId, setServiceBereichId] = useState<number | ''>('');
    const [mitarbeiterId, setMitarbeiterId] = useState<number | ''>('');
    const [statusId, setStatusId] = useState<number | ''>('');
    const [titel, setTitel] = useState('');
    const [beschreibung, setBeschreibung] = useState('');
    const [auftragId, setAuftragId] = useState<string>(''); // read-only, vom Backend generiert
    const [tag, setTag] = useState('');
    const [monat, setMonat] = useState('');
    const [jahr, setJahr] = useState('');
    const [abschlussTag, setAbschlussTag] = useState('');
    const [abschlussMonat, setAbschlussMonat] = useState('');
    const [abschlussJahr, setAbschlussJahr] = useState('');

    // Dropdown-Daten
    const [serviceBereiche, setServiceBereiche] = useState<ServiceBereich[]>([]);
    const [mitarbeiter, setMitarbeiter] = useState<Mitarbeiter[]>([]);
    const [statusOptionen, setStatusOptionen] = useState<StatusOption[]>([]);

    const [loading, setLoading] = useState(isBearbeiten);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    const labelStyle: React.CSSProperties = { fontWeight: 500, marginBottom: 4 };
    const inputStyle: React.CSSProperties = { fontSize: '15px' };

    // Dropdown-Daten laden (Service-Bereiche, Mitarbeiter, Status)
    useEffect(() => {
        const fetchDropdownDaten = async () => {
            try {
                const [sbRes, mRes, sRes] = await Promise.all([
                    fetch('http://localhost:3001/api/service-bereich'),
                    fetch('http://localhost:3001/api/mitarbeiter'),
                    fetch('http://localhost:3001/api/status'),
                ]);

                if (!sbRes.ok || !mRes.ok || !sRes.ok) {
                    throw new Error('Fehler beim Laden der Auswahllisten');
                }

                const sbData = await sbRes.json();
                const mData = await mRes.json();
                const sData = await sRes.json();

                setServiceBereiche(sbData);
                setMitarbeiter(mData);
                setStatusOptionen(sData);
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Unbekannter Fehler');
            }
        };
        fetchDropdownDaten();
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
                if (!response.ok) {
                    throw new Error('Auftrag nicht gefunden');
                }
                const data = await response.json();
                setAuftragId(String(data.auftrag_id));
                setServiceBereichId(data.service_bereich_id || '');
                setMitarbeiterId(data.mitarbeiter_id || '');
                setStatusId(data.status_id || '');
                setTitel(data.titel || '');
                setBeschreibung(data.beschreibung || '');

                // Datum aus erstellt_am extrahieren
                if (data.erstellt_am) {
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

                // Datum aus abgeschlossen_am extrahieren (falls vorhanden)
                if (data.abgeschlossen_am) {
                    const datum = new Date(data.abgeschlossen_am);
                    setAbschlussTag(String(datum.getDate()).padStart(2, '0'));
                    setAbschlussMonat(String(datum.getMonth() + 1).padStart(2, '0'));
                    setAbschlussJahr(String(datum.getFullYear()));
                }
            } catch (err) {
                setError(err instanceof Error ? err.message : 'Unbekannter Fehler');
            } finally {
                setLoading(false);
            }
        };
        fetchAuftrag();
    }, [id]);

    // Speichern
    const handleSubmit = async () => {
        setSaving(true);
        setError('');
        setSuccess('');

        // Validierung
        if (!serviceBereichId) {
            setError('Bitte wählen Sie einen Service-Bereich aus.');
            setSaving(false);
            return;
        }
        if (!bezirkId) {
            setError('Kein Bezirk ausgewählt. Bitte wählen Sie zuerst einen Bezirk aus.');
            setSaving(false);
            return;
        }
        if (!mitarbeiterId) {
            setError('Bitte wählen Sie einen Mitarbeiter aus.');
            setSaving(false);
            return;
        }
        if (!statusId) {
            setError('Bitte wählen Sie einen Status aus.');
            setSaving(false);
            return;
        }
        if (!titel.trim()) {
            setError('Bitte geben Sie einen Titel ein.');
            setSaving(false);
            return;
        }

        // Datum formatieren
        const erstellt_am = `${jahr}-${monat}-${tag}`;
        const abgeschlossen_am = abschlussJahr ? `${abschlussJahr}-${abschlussMonat}-${abschlussTag}` : null;

        try {
            if (isBearbeiten) {
                // PUT - Auftrag aktualisieren
                const response = await fetch(`http://localhost:3001/api/auftrag/${id}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        service_bereich_id: serviceBereichId,
                        bezirk_id: bezirkId,
                        mitarbeiter_id: mitarbeiterId,
                        status_id: statusId,
                        titel,
                        beschreibung,
                        erstellt_am,
                        abgeschlossen_am,
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
                        service_bereich_id: serviceBereichId,
                        bezirk_id: bezirkId,
                        mitarbeiter_id: mitarbeiterId,
                        status_id: statusId,
                        titel,
                        beschreibung,
                        erstellt_am,
                        abgeschlossen_am,
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

            {/* Titel */}
            <Row className="mb-3">
                <Col xs={12} md={6}>
                    <Form.Label style={labelStyle}>Titel</Form.Label>
                    <Form.Control
                        type="text"
                        value={titel}
                        onChange={(e) => setTitel(e.target.value)}
                        placeholder="Titel des Auftrags"
                        style={{ ...inputStyle, maxWidth: '400px' }}
                    />
                </Col>
            </Row>

            {/* Service-Bereich */}
            <Row className="mb-3">
                <Col xs={12} md={4}>
                    <Form.Label style={labelStyle}>Service-Bereich</Form.Label>
                    <Form.Select
                        value={serviceBereichId}
                        onChange={(e) => setServiceBereichId(e.target.value ? Number(e.target.value) : '')}
                        style={{ ...inputStyle, maxWidth: '300px' }}
                    >
                        <option value="">Bitte wählen...</option>
                        {serviceBereiche.map((sb) => (
                            <option key={sb.service_bereich_id} value={sb.service_bereich_id}>
                                {sb.name}
                            </option>
                        ))}
                    </Form.Select>
                </Col>
            </Row>

            {/* Mitarbeiter */}
            <Row className="mb-3">
                <Col xs={12} md={4}>
                    <Form.Label style={labelStyle}>Mitarbeiter</Form.Label>
                    <Form.Select
                        value={mitarbeiterId}
                        onChange={(e) => setMitarbeiterId(e.target.value ? Number(e.target.value) : '')}
                        style={{ ...inputStyle, maxWidth: '300px' }}
                    >
                        <option value="">Bitte wählen...</option>
                        {mitarbeiter.map((m) => (
                            <option key={m.mitarbeiter_id} value={m.mitarbeiter_id}>
                                {m.vorname} {m.nachname}
                            </option>
                        ))}
                    </Form.Select>
                </Col>
            </Row>

            {/* Status */}
            <Row className="mb-3">
                <Col xs={12} md={3}>
                    <Form.Label style={labelStyle}>Bearbeitungsstatus</Form.Label>
                    <Form.Select
                        value={statusId}
                        onChange={(e) => setStatusId(e.target.value ? Number(e.target.value) : '')}
                        style={inputStyle}
                    >
                        <option value="">Bitte wählen...</option>
                        {statusOptionen.map((s) => (
                            <option key={s.status_id} value={s.status_id}>
                                {s.status}
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

            {/* Abschlussdatum */}
            <Row className="mb-3">
                <Col xs={12}>
                    <Form.Label style={labelStyle}>Abschlussdatum (optional)</Form.Label>
                    <div className="d-flex gap-2">
                        <Form.Control
                            type="number"
                            min={1}
                            max={31}
                            value={abschlussTag}
                            onChange={(e) => setAbschlussTag(e.target.value)}
                            placeholder="TT"
                            style={{ width: '70px', ...inputStyle }}
                        />
                        <Form.Control
                            type="number"
                            min={1}
                            max={12}
                            value={abschlussMonat}
                            onChange={(e) => setAbschlussMonat(e.target.value)}
                            placeholder="MM"
                            style={{ width: '70px', ...inputStyle }}
                        />
                        <Form.Control
                            type="number"
                            value={abschlussJahr}
                            onChange={(e) => setAbschlussJahr(e.target.value)}
                            placeholder="JJJJ"
                            style={{ width: '90px', ...inputStyle }}
                        />
                    </div>
                </Col>
            </Row>

            {/* Beschreibung */}
            <Row className="mb-3">
                <Col xs={12} md={8}>
                    <Form.Label style={labelStyle}>Beschreibung</Form.Label>
                    <Form.Control
                        as="textarea"
                        rows={4}
                        value={beschreibung}
                        onChange={(e) => setBeschreibung(e.target.value)}
                        placeholder="Beschreibung des Auftrags (optional)"
                        style={{ ...inputStyle, maxWidth: '600px' }}
                    />
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