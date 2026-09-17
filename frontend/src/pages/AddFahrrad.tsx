// Screen 2
import {useState} from 'react';
import { Container, Form, Button, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import '../assets/css/custom-style.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import * as service from '../services/fahrradService';
import { User } from '../Models/User';

export const AddFahrrad = () => {
    const navigate = useNavigate();

    //const [id, setId] = useState<string>('');
    const [marke, setMarke] = useState<string>('');
    const [rahmennummer, setRahmennummer] = useState<string>('');
    const [farbe, setFarbe] = useState<string>('');
    const [erfasstVon, setErfasstVon] = useState<string>('Max Mustermann'); // TODO: User ist hier hardgecodet und muss später duruch das ausglesene Token ersetzt werden
    const [bearbeitungsstatus, setBearbeitungsstatus] = useState<string>('');
    //const [date, setDate] = useState<string>('');

    // Handler-Funktion zum Speichern des Fahrrads
    const handleSenden = async () => {
        try {
            
            const neuesFahrrad = {
                marke : marke,
                farbe : farbe,
                rahmennummer : rahmennummer,
                erfasstVon : erfasstVon,
                bearbeitungsstatus : bearbeitungsstatus
            };

            await service.fahrradService.create(neuesFahrrad as any);

            // TODO: Navigate muss in der Praxis geprüft werden (Besser einen neuen Screen hinzufügen, der das gespeicherte Rad anzeigt + auswahl
            // ob noch eins gespeichert werden soll oder zurück zum home navigiert werden soll)
            // Nach erfolgreichem Speichern z.B. zur Startseite / Übersicht navigieren
            // navigate('/');
        } catch (error) {
            console.error("Fehler beim Speichern des Fahrrads:", error);
        }
    };

    return (
        <Container className='py-4' >
            {/* FahrradID + InfoButton entfernt
            <Form.Group className='mb-3'>
                <Form.Label>
                    Fahrrad-ID
                    <i 
                    style={{
                    fontSize: '12px',
                    marginLeft: '2px',
                    verticalAlign: 'super',
                    color: '#5374a5'
                    }}
                    className='bi bi-info-circle-fill'
                    > 
                    </i>
                </Form.Label>
                <Form.Control
                    type='text'
                    value={id}
                    disabled
                    style={{ 
                        width: '140px', // Fest, da klein genug für alle Handys
                        backgroundColor: '#b3b3b3', 
                        border: 'none'
                    }}
                    >
                </Form.Control>
            </Form.Group> */}

            {/* Marke */}
            <Form.Group className='mb-3'>
                <Form.Label>Marke</Form.Label>
                <Form.Control 
                    type='text' 
                    placeholder='z.B. Canyon'
                    style={{ width: '100%', maxWidth: '300px' }}
                    value={marke}
                    onChange={(e) => setMarke(e.target.value)} />
            </Form.Group>

            {/* Rahmennummer */}
            <Form.Group className='mb-3'>
                <Form.Label>Rahmennummer</Form.Label>
                <Form.Control 
                    type='text' 
                    placeholder='z.B. RH-0815'
                    style={{ width: '100%', maxWidth: '300px' }}
                    value={rahmennummer}
                    onChange={(e) => setRahmennummer(e.target.value)} />
            </Form.Group>

            {/* Farbe */}
            <Form.Group className='mb-3'>
                <Form.Label>Farbe</Form.Label>
                <Form.Control 
                    type='text' 
                    placeholder='z.B. rot'
                    style={{ width: '100%', maxWidth: '300px' }}
                    value={farbe}
                    onChange={(e) => setFarbe(e.target.value)}>
                </Form.Control>
            </Form.Group>

            {/* Bearbeitungsstatus */}
            <Form.Group className='mb-3' style={{maxWidth: '200px', width: '100%'}}>
            <Form.Label>Bearbeitungsstatus</Form.Label>
                <Form.Select
                    value={bearbeitungsstatus}
                    onChange={(e) => setBearbeitungsstatus(e.target.value)}>

                    <option value='' disabled hidden>Status wählen...</option>
                    <option value='1'>angenommen</option>
                    <option value='2'>verschrottet</option>
                    {/* Bearbeitungsstatus
                    <option value='3'>verfügbar</option>
                    <option value='4'>herausgegeben</option>
                     */}
                </Form.Select>
            </Form.Group>

            {/* Kunde/Einrichtung */}
            <Form.Group className='mb-3'>
                <Form.Label>Kunde/Einrichtung</Form.Label>
                <Row style={{maxWidth: '600px', width: '100%'}}>
                    <Col xs={12} md={12} lg={5}>
                        <Form.Select>
                            <option value='' disabled hidden>Kunden wählen...</option>
                            <option value='Musterkunde'>Musterkunde</option>
                            <option value='Mustereinrichtunng'>Mustereinrichtunng</option>
                        </Form.Select>
                    </Col>

                    <Col xs={12} md={2} lg={2}>
                        <Form.Label>oder</Form.Label>
                    </Col>

                    <Col xs={12} md={12} lg={5}>
                        <Button variant='none' className='agens-button-secondary' style={{ maxWidth: '200px', width: '100%' }}>
                            neuen Kunden anlegen
                        </Button>
                    </Col>
                </Row>
            </Form.Group>

            {/* Senden-Button */}
            <Form.Group className='mt-4'>
                <Button
                    variant='none'
                    className='agens-button-primary' 
                    style={{ width: '140px'}}
                    onClick={() => {handleSenden()}}>senden</Button>
            </Form.Group>

            {/* zurück-Button */}
            <Button 
                className='agens-button-primary' 
                style={{ position: 'fixed', bottom: '20px', right: '20px', width: '140px'
                }}
                onClick={() => {navigate('/')}}
                >zurück
            </Button>
        </Container>
    );
}