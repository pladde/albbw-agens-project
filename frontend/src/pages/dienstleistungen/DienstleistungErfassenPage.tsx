import React, { useState } from 'react';
import {
    Container,
    Row,
    Col,
    Form,
    Button,
    OverlayTrigger,
    Tooltip,
} from 'react-bootstrap';
import { InfoCircle } from 'react-bootstrap-icons';
import { useNavigate, useParams } from 'react-router-dom';

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

    // Felder
    const [auftragId] = useState(id ?? 'NK-003'); // read-only, vom Backend generiert
    const [kategorie, setKategorie] = useState('');
    const [beschreibung, setBeschreibung] = useState('');
    const [besonderheiten, setBesonderheiten] = useState('');
    const [tag, setTag] = useState('10');
    const [monat, setMonat] = useState('05');
    const [jahr, setJahr] = useState('2026');
    const [status, setStatus] = useState('Angenommen');
    const [kunde, setKunde] = useState('');

    const labelStyle: React.CSSProperties = { fontWeight: 500, marginBottom: 4 };
    const inputStyle: React.CSSProperties = { fontSize: '15px' };

    const handleSubmit = () => {
        // TODO: POST/PUT an Backend
        console.log({ auftragId, kategorie, beschreibung, besonderheiten, tag, monat, jahr, status, kunde });
        navigate('/dienstleistung/suchen');
    };

    return (
        <Container
            fluid
            style={{ minHeight: 'calc(100vh - 60px)', background: '#e8e8e8', padding: '30px 40px' }}
        >
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
                        value={auftragId}
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
                className="agens-button-primary"
                style={{
                    border: 'none',
                    borderRadius: '6px',
                    fontSize: '16px',
                    padding: '10px 30px',
                }}
            >
                senden
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
