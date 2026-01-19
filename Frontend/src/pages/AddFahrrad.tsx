// Screen 2 Fahrrad hinzufügen

import { useState } from "react";
import { Container, Form, Button } from 'react-bootstrap';

export const AddFahrrad = () => {
    const [marke, setMarke] = useState<string>('');
    const [rahmennummer, setRahmennummer] = useState<string>('');
    const [besonderheiten, setBesonderheiten] = useState<string>('');

    const handeSubmit = (e:React.FormEvent) => {
        e.preventDefault();
        console.log("Gespeichert wird: ", marke, rahmennummer, besonderheiten);
        // BACKENDAUFRUF FOLGT
    };

    return (
        <Container className="mt-4">
            <h3>Fahrrad erfassen</h3>

            <Form onSubmit={handeSubmit}>
                <Form.Group className="mb-3">
                    <Form.Label>Marke:</Form.Label>
                    <Form.Control type="text" placeholder="z.B. Canyon" value={marke} onChange={(e) => setMarke(e.target.value)}/>
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Rahmennummer:</Form.Label>
                    <Form.Control type="text" placeholder="z.B. RH-0815" value={rahmennummer} onChange={(e) => setRahmennummer(e.target.value)}/>
                </Form.Group>

                <Form.Group className="mb-3">
                    <Form.Label>Besonderheiten:</Form.Label>
                    <Form.Control type="text" placeholder="z.B. Narbendynamo" value={besonderheiten} onChange={(e) => setBesonderheiten(e.target.value)}/>
                </Form.Group>

                <Button variant="primary" type="submit">senden</Button>
            </Form>
        </Container>
    );
}