import { Container, Row, Col, Button } from 'react-bootstrap';

export const Home = () => {
  return (
    <Container 
      fluid 
      className="d-flex align-items-center justify-content-center"
      style={{ minWidth: "100vw", minHeight: "100vh", background: '#e7e7e7' }}
    >
      <Row>
        <Col className="d-flex flex-column align-items-center gap-3">
          <Button style={{ width: '280px', height: '150px', background: '#5a70a1', border: '#5a70a1', fontSize: '28px'}}>
            Fahrrad erfassen
          </Button>

          <Button style={{ width: '280px', height: '150px', background: '#5a70a1', border: '#5a70a1', fontSize: '28px'}}>
            Fahrrad suchen
          </Button>
        </Col>
      </Row>
    </Container>
  );
};
