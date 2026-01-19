import { useState } from 'react';
import { Container, Card, Form, Row, Col, InputGroup, Table, Button, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import 'bootstrap-icons/font/bootstrap-icons.css'; // Lupenicons noch klickbar machen

export const SearchFahrrad = () => {
  const navigate = useNavigate();

  // State, um zu steuern, ob das Lösch-Fenster sichtbar ist oder nicht
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Funktionen zum Öffnen und Schließen des Modals
  const handleCloseModal = () => setShowDeleteModal(false);
  const handleShowModal = () => setShowDeleteModal(true);

  return (
    <Container className="mt-5">
      <Card className="p-4 shadow-sm">
        {/* --- Kopfzeile --- */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h3>Fahrrad suchen</h3>
          <div>
            {/* Buttons für refresh und schließen */}
            <Button variant="outline-secondary" className="me-2"><i className="bi bi-arrow-clockwise"></i></Button>
            <Button variant="close" onClick={() => navigate('/')} />
          </div>
        </div>

        {/* --- Filter --- */}
        <Form className="mb-4">
          <h5 className="mb-3">Filter:</h5>
          <Row className="g-2"> {/* abstand zwischen den cols*/}
            
            {/* Fahrrad-ID */}
            <Col md={3}>
              <InputGroup>
                <Form.Control placeholder="Fahrrad-ID" />
                <InputGroup.Text><i className="bi bi-search"></i></InputGroup.Text>
              </InputGroup>
            </Col>

            {/* Marke */}
            <Col md={3}>
              <InputGroup>
                <Form.Control placeholder="Marke" />
                <InputGroup.Text><i className="bi bi-search"></i></InputGroup.Text>
              </InputGroup>
            </Col>
            
             {/* Rahmennummer */}
             <Col md={3}>
              <InputGroup>
                <Form.Control placeholder="Rahmennummer" />
                <InputGroup.Text><i className="bi bi-search"></i></InputGroup.Text>
              </InputGroup>
            </Col>

            {/* Bearbeitungsstatus */}
            <Col md={3}>
              <Form.Select>
                <option>Bearbeitungsstatus</option>
                <option value="angenommen">angenommen</option>
                <option value="in_bearbeitung">in Bearbeitung</option>
                 <option value="fertig">fertig</option>
              </Form.Select>
            </Col>

            {/* Datum */}
             <Col md={3} className="mt-2">
              <Form.Control type="date" />
            </Col>
          </Row>
        </Form>

        {/* --- Ergebnistabelle --- */}
        <Table striped bordered hover responsive>
          <thead>
            <tr>
              <th>Fahrrad-ID</th>
              <th>Marke</th>
              <th>Rahmennummer</th>
              <th>Bearbeitungsstatus</th>
              <th>Datum</th>
              <th>Aktionen</th>
            </tr>
          </thead>
          <tbody>
            {/* nur eine beispielzeile. Hier werden später die gefundenen Daten eingetragen */}
            <tr>
              <td>0815</td>
              <td>Mustermarke</td>
              <td>RH-12345</td>
              <td>angenommen</td>
              <td>01.01.2026</td>
              <td>
                <Button variant="outline-primary" size="sm" className="me-1">bearbeiten</Button>
                {/* bei klick auf löschen öffnet sich das Dialogfenster */}
                <Button variant="outline-danger" size="sm" onClick={handleShowModal}>löschen</Button>
              </td>
            </tr>
             {/* weitere Ergebnisse */}
             <tr>
                <td colSpan={6} className="text-center text-muted p-5" style={{backgroundImage: 'linear-gradient(45deg, #f3f3f3 25%, transparent 25%, transparent 50%, #f3f3f3 50%, #f3f3f3 75%, transparent 75%, transparent)', backgroundSize: '20px 20px'}}>
                   Weitere Suchergebnisse...
                </td>
             </tr>
          </tbody>
        </Table>

        {/* --- zurück --- */}
        <div className="d-flex justify-content-end mt-4">
          <Button variant="outline-secondary" onClick={() => navigate('/')}>
            zurück
          </Button>
        </div>
      </Card>

      {/* --- Das Lösch-Dialogfenster --- */}
      {/* 'show' steuert die Sichtbarkeit, 'onHide' wird beim Schließen aufgerufen */}
      <Modal show={showDeleteModal} onHide={handleCloseModal} centered>
        <Modal.Header closeButton>
          <Modal.Title>Löschen bestätigen</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Das Fahrrad mit der ID 0815 wird unwiderruflich gelöscht. Sind Sie sicher?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleCloseModal}>
            Cancel
          </Button>
          {/* lösch-aufruf an das backend */}
          <Button variant="danger" onClick={handleCloseModal}>
            Ok
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};