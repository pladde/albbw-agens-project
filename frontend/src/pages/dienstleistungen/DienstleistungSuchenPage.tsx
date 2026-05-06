import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Table } from 'react-bootstrap';
import { Search } from 'react-bootstrap-icons';
import { useNavigate } from 'react-router-dom';

interface Auftrag {
    auftragId: string;
    kategorie: string;
    kundenname: string;
    status: string;
    datum: string;
}

// Mock-Daten – später durch API-Call ersetzen
const mockDaten: Auftrag[] = [
    {
        auftragId: 'NK-001',
        kategorie: 'Holzwerkstatt',
        kundenname: 'Max Mustermann',
        status: 'Angenommen',
        datum: '20.01.2026',
    },
    {
        auftragId: 'NK-002',
        kategorie: 'Elektronik',
        kundenname: 'Lisa Beispiel',
        status: 'In Bearbeitung',
        datum: '05.03.2026',
    },
];

export const DienstleistungSuchenPage: React.FC = () => {
    const navigate = useNavigate();

    const [auftragId, setAuftragId] = useState('');
    const [kategorie, setKategorie] = useState('');
    const [kundenname, setKundenname] = useState('');
    const [status, setStatus] = useState('');
    const [tag, setTag] = useState('');
    const [monat, setMonat] = useState('');
    const [jahr, setJahr] = useState('');
    const [selectedId, setSelectedId] = useState<string | null>(null);

    const gefiltert = mockDaten.filter((a) => {
        const datumMatch =
            !tag && !monat && !jahr
                ? true
                : a.datum === `${tag.padStart(2, '0')}.${monat.padStart(2, '0')}.${jahr}`;
        return (
            a.auftragId.toLowerCase().includes(auftragId.toLowerCase()) &&
            a.kategorie.toLowerCase().includes(kategorie.toLowerCase()) &&
            a.kundenname.toLowerCase().includes(kundenname.toLowerCase()) &&
            (status === '' || a.status === status) &&
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

    return (
        <Container
            fluid
            style={{ minHeight: 'calc(100vh - 60px)', background: '#e8e8e8', padding: '30px 40px' }}
        >
            {/* Filter-Leiste */}
            <Row className="mb-3 align-items-end g-3">
                <Col xs="auto">
                    <Form.Label style={{ fontWeight: 500, marginBottom: 4 }}>Auftrags-ID</Form.Label>
                    <div className="d-flex align-items-center gap-1">
                        <Form.Control
                            value={auftragId}
                            onChange={(e) => setAuftragId(e.target.value)}
                            placeholder="NK-001"
                            style={{ width: '130px', ...inputStyle }}
                        />
                        <Search />
                    </div>
                </Col>

                <Col xs="auto">
                    <Form.Label style={{ fontWeight: 500, marginBottom: 4 }}>Kategorie</Form.Label>
                    <div className="d-flex align-items-center gap-1">
                        <Form.Control
                            value={kategorie}
                            onChange={(e) => setKategorie(e.target.value)}
                            style={{ width: '140px', ...inputStyle }}
                        />
                        <Search />
                    </div>
                </Col>

                <Col xs="auto">
                    <Form.Label style={{ fontWeight: 500, marginBottom: 4 }}>Kundenname</Form.Label>
                    <div className="d-flex align-items-center gap-1">
                        <Form.Control
                            value={kundenname}
                            onChange={(e) => setKundenname(e.target.value)}
                            style={{ width: '160px', ...inputStyle }}
                        />
                        <Search />
                    </div>
                </Col>

                <Col xs="auto">
                    <Form.Label style={{ fontWeight: 500, marginBottom: 4 }}>
                        Bearbeitungsstatus
                    </Form.Label>
                    <Form.Select
                        value={status}
                        onChange={(e) => setStatus(e.target.value)}
                        style={{ width: '175px', ...inputStyle }}
                    >
                        <option value="">Bitte wählen...</option>
                        <option>Angenommen</option>
                        <option>In Bearbeitung</option>
                        <option>Abgeschlossen</option>
                        <option>Herausgegeben</option>
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
                <Table hover style={{ marginBottom: 0 }}>
                    <thead>
                        <tr style={{ background: headerBg, color: 'white' }}>
                            <th style={{ background: headerBg, color: 'white' }}>Auftrags-ID</th>
                            <th style={{ background: headerBg, color: 'white' }}>Kategorie</th>
                            <th style={{ background: headerBg, color: 'white' }}>Kundenname</th>
                            <th style={{ background: headerBg, color: 'white' }}>
                                Bearbeitungsstatus
                            </th>
                            <th style={{ background: headerBg, color: 'white' }}>Datum</th>
                        </tr>
                    </thead>
                    <tbody>
                        {gefiltert.map((a) => (
                            <tr
                                key={a.auftragId}
                                onClick={() => setSelectedId(a.auftragId)}
                                style={{
                                    cursor: 'pointer',
                                    background:
                                        selectedId === a.auftragId ? '#d0d8e8' : 'transparent',
                                }}
                            >
                                <td>{a.auftragId}</td>
                                <td>{a.kategorie}</td>
                                <td>{a.kundenname}</td>
                                <td>{a.status}</td>
                                <td>{a.datum}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </div>

            {/* Aktions-Buttons */}
            <div className="mt-3 d-flex gap-2">
                <Button
                    disabled={!selectedId}
                    onClick={() => navigate(`/dienstleistung/erfassen/${selectedId}`)}
                    style={{ background: '#5374a5', border: 'none', borderRadius: '6px' }}
                >
                    bearbeiten
                </Button>
                <Button
                    disabled={!selectedId}
                    style={{ background: '#5374a5', border: 'none', borderRadius: '6px' }}
                    onClick={() => {
                        if (window.confirm(`Auftrag ${selectedId} wirklich löschen?`)) {
                            // TODO: DELETE-Anfrage an Backend
                            setSelectedId(null);
                        }
                    }}
                >
                    löschen
                </Button>
            </div>

            {/* Zurück-Button */}
            <div className="d-flex justify-content-end mt-4">
                <Button
                    onClick={() => navigate('/dienstleistung')}
                    style={{ background: '#5374a5', border: 'none', borderRadius: '6px' }}
                >
                    zurück
                </Button>
            </div>
        </Container>
    );
};
