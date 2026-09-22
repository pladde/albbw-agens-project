import { Container, Row, Col, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

export const FahrradMain = () => {
  const navigate = useNavigate();

  return (
    <Container 
      fluid 
      className="d-flex align-items-center justify-content-center"
      style={{ minWidth: "100%", minHeight: "80vh"}}
      >
        {/* Standard bereich */}
      <Row>
        <Col className="d-flex flex-column align-items-center gap-3">
          {/* Erfassen-Button */}
          <Button variant='none'
            className='agens-button-primary'
            style={{ width: '280px', height: '150px', fontSize: '28px'}}
            onClick={() => navigate('/erfassen')}
            >
            Fahrrad erfassen
          </Button>

          {/* Suchen-Button */}
          <Button variant='none'
            className='agens-button-primary'
            style={{ width: '280px', height: '150px', fontSize: '28px'}}
            onClick={() => navigate('suchen')}
            >
            Fahrrad suchen
          </Button>
        </Col>
      </Row>
    </Container>
  );
};
