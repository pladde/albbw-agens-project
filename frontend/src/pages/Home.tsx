import { Container, Row, Col, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { User } from '../Models/User';

export const Home = () => {
  const navigate = useNavigate();

  /*
  !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  // HARDCODE! Später durch echtes Json ersetzen!
  !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  !!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
  */


  User.berechtigungsstufe = 2;
  User.projektnummer = "Projekt-0815";

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

      {/* Standortleiter bereich */}
      <Row className="m-2">
        <Col className="d-flex flex-column align-items-center gap-3">
          {/* Mitarbieter hinzufügen */}
          <Button variant='none'
            className='agens-button-primary'
            hidden={User.berechtigungsstufe != 2}
            style={{ width: '280px', height: '150px', fontSize: '28px'}}
            onClick={() => console.log('REFERENZIERT AUF ROUTE: MA HINZUFÜGEN')}  // HARDCODE
            >
            Mitarbeiter hinzufügen
          </Button>

          {/* Mitarbieter hinzufügen */}
          <Button variant='none'
            className='agens-button-primary'
            hidden={User.berechtigungsstufe != 2}
            style={{ width: '280px', height: '150px', fontSize: '28px'}}
            onClick={() => console.log('REFERENZIERT AUF ROUTE: MA SUCHEN')}     // HARDCODE
            >
            Mitarbeiter suchen
          </Button>
        </Col>
      </Row>
    </Container>
  );
};
