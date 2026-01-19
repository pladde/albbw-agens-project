import { Container, Row, Col, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

export const Home = () => {
  // Der "Navigator" ist wie ein Navi im Auto..
  // er sagt dem Browser, welche URL er ansteuern soll.
  const navigate = useNavigate();

  return (

    <Container className="vh-100 d-flex align-items-center justify-content-center">
      <Row className="w-100 text-center">
        <Col md={12} className="mb-4">
          <h1>agens-Fahrrad</h1>
          <p className="text-muted">Bitte wählen Sie eine Aktion aus.</p>
        </Col>

        {/* erster Button */}
        <Col md={6} className="d-grid gap-2">
          <Button 
            variant="secondary" 
            size="lg" 
            className="py-5" // buttonhöhe
            onClick={() => navigate('/erfassen')}
          >
            <div className="h2">Fahrrad erfassen</div>
          </Button>
        </Col>

        {/* zweiter Button */}
        <Col md={6} className="d-grid gap-2">
          <Button 
            variant="secondary" 
            size="lg" 
            className="py-5"
            onClick={() => navigate('/suchen')}
          >
            <div className="h2">Fahrrad suchen</div>
          </Button>
        </Col>
      </Row>
    </Container>
  );
};