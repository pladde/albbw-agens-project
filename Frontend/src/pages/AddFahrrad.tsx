// Screen 2
import {useState} from 'react';
import { Container, Form, Button, Row, Col } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import '../assets/css/custom-style.css';
import 'bootstrap-icons/font/bootstrap-icons.css';


export const AddFahrrad = () => {
    const navigate = useNavigate();


    const [id, setId] = useState<string>('');
    const [marke, setMarke] = useState<string>('');
    const [rahmennummer, setRahmennummer] = useState<string>('');
    const [besonderheiten, setBesonderheiten] = useState<string>('');
    const [bearbeitungsstatus, setBearbeitungsstatus] = useState<string>('');
    const [date, setDate] = useState<string>('');

    return (
        <Container className='py-4' >
            {/* FahrradID + InfoButton */}
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
            </Form.Group>

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

            {/* Besonderheiten */}
            <Form.Group className='mb-3'>
                <Form.Label>Besonderheiten</Form.Label>
                <Form.Control 
                    as='textarea'
                    rows={5}
                    placeholder='z.B. Aerolenkeraufsatz'
                    style={{ width: '100%', maxWidth: '500px' }}
                    value={besonderheiten}
                    onChange={(e) => setBesonderheiten(e.target.value)}>
                </Form.Control>
            </Form.Group>

            {/* Datum */}
            <Form.Group className='mb-3'>
                <Form.Label>Eingangsdatum</Form.Label>
                <div className="d-flex flex-wrap gap-2">
                    <Form.Control type="number" placeholder='TT' style={{ width: '65px' }} />
                    <Form.Control type="number" placeholder='MM' style={{ width: '65px' }} />
                    <Form.Control type="number" placeholder='YYYY'style={{ width: '100px' }} />
                </div>
            </Form.Group>

            {/* Bearbeitungsstatus */}
            <Form.Group className='mb-3' style={{maxWidth: '200px', width: '100%'}}>
            <Form.Label>Bearbeitungsstatus</Form.Label>
                <Form.Select
                    value={bearbeitungsstatus}
                    onChange={(e) => setBearbeitungsstatus(e.target.value)}>

                    <option value='' disabled hidden>Status wählen...</option>
                    <option value='1'>angenommen</option>
                    <option value='2'>in Bearbeitung</option>
                    <option value='3'>verfügbar</option>
                    <option value='4'>herausgegeben</option>
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
                    className='agens-button-primary' style={{ width: '140px'}}>senden</Button>
            </Form.Group>
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