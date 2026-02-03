import { Container, Row, Col, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

export const Home = () => {
  const navigate = useNavigate();

  return (
    <Container 
      fluid 
      className="d-flex align-items-center justify-content-center"
      style={{ minWidth: "100vw", minHeight: "100vh", background: '#e7e7e7' }}
    >
      <Row>
        <Col className="d-flex flex-column align-items-center gap-3">
          <Button style={{ width: '280px', height: '150px', background: '#5374a5', border: '#5374a5', fontSize: '28px'}}
                  onClick={() => navigate('/erfassen')}>
            Fahrrad erfassen
          </Button>

          <Button style={{ width: '280px', height: '150px', background: '#5374a5', border: '#5374a5', fontSize: '28px'}}
                  onClick={() => navigate('suchen')}>
            Fahrrad suchen
          </Button>
        </Col>
      </Row>
    </Container>
  );
};
