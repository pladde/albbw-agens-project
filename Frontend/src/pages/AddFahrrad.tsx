// Screen 2

import {useState} from 'react';
import { Container, Form, Button } from 'react-bootstrap';

export const AddFahrrad = () => {

    const [marke, setMarke] = useState<string>('');
    const [rahmennummer, setRahmennummer] = useState<string>('');
    const [besonderheiten, setBesonderheiten] = useState<string>('');
    const [bearbeitungsstatus, setBearbeitungsstatus] = useState<string>('');

    return (
        <Container className='mt-4'>
            <Form className='mb-3'>
                <Form.Label>Marke:</Form.Label>
                <Form.Control 
                    type='text' 
                    placeholder='z.B. Canyon'
                    value={marke}
                    onChange={(e) => setMarke(e.target.value)} />
            </Form>

            <Form className='mb-3'>
                <Form.Label>Rahmenummer:</Form.Label>
                <Form.Control 
                    type='text' 
                    placeholder='z.B. RH-0815'
                    value={rahmennummer}
                    onChange={(e) => setRahmennummer(e.target.value)} />
            </Form>

            <Form className='mb-3'>
                <Form.Label>Besonderheiten:</Form.Label>
                <Form.Control 
                    type='text'
                    placeholder='z.B. Aerolenkeraufsatz'
                    value={besonderheiten}
                    onChange={(e) => setBesonderheiten(e.target.value)} /> 
            </Form>

            <Form.Group className='mb-3'>
            <Form.Label>Bearbeitungsstatus:</Form.Label>
                <Form.Select
                    value={bearbeitungsstatus}
                    onChange={(e) => setBearbeitungsstatus(e.target.value)}>

                    <option value="" disabled hidden>Status wählen...</option>
                    <option value='1'>angenommen</option>
                    <option value='2'>in Bearbeitung</option>
                    <option value='3'>verfügbar</option>
                    <option value='4'>herausgegeben</option>
                </Form.Select>
            </Form.Group>

            <Form className='mb-3'>
                <Button>senden</Button>
            </Form>
        </Container>
    );
}
// Später werde ich noch den Kunden hinzufügen, an dem das Fahrrad geht. Zu Testzwecken wird das noch nicht implementiert.