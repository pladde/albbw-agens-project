import { Container, Row, Col, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { User } from '../Models/User'; // Hier muss das Token bzw die Daten des Tokens implementiert werden

export const Home = () => {
  const navigate = useNavigate();

  /* Token:
  //FIXME: HARDCODE! Später durch echtes Json ersetzen!
  */
  const berechtigungsstufe : number = 2;
  const projektnummer : string = "Projekt-0815";

  return (
    <Container 
      fluid 
      className="d-flex align-items-center justify-content-center"
      style={{ minWidth: "100%", minHeight: "80vh"}}
      >
        {/* Standard bereich */}
      <Row>
        <Col className="d-flex flex-column align-items-center gap-3">
          {/* Fahrradwerkkstatt-Button */}
          <Button variant='none'
            className='agens-button-primary'
            style={{ width: '280px', height: '150px', fontSize: '28px'}}
            onClick={() => navigate('/fahrrad')}
            >
            Fahrradwerkstatt
          </Button>

          {/* Kleiderwerkstatt-Button */}
          <Button variant='none'
            className='agens-button-primary'
            style={{ width: '280px', height: '150px', fontSize: '28px'}}
            onClick={() => navigate('kleiderwerkstatt')} // FIXME: Kleiderwerkstatt-Route Klasse aufrufen
            >
            Kleiderwerkstatt
          </Button>

                    {/* Suchen-Button */}
          <Button variant='none'
            className='agens-button-primary'
            style={{ width: '280px', height: '150px', fontSize: '28px'}}
            onClick={() => navigate('holz')} // FIXME: Holzwerkstatt-Route aufrufen
            >
            Holzwerkstatt
          </Button>
        </Col>
      </Row>
    </Container>
  );
};