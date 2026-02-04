import { useState, useEffect } from 'react';
import { Container, Card, Form, Row, Col, InputGroup, Table, Button, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import '../assets/css/custom-style.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

export const SearchFahrrad = () => {
  const navigate = useNavigate();

  return (
    <Container className='py-4'>

      {/* // #region Suchfilter-Bereich */}
      <Row>
        <Col>
        <Form.Group>
          <Form.Label>
            Fahrrad-ID
          </Form.Label>
          <Form.Control placeholder='z.B. NK-001'>
          </Form.Control>
        </Form.Group>
        </Col>

        <Col>
          <Form.Group>
            <Form.Label>
              Marke
            </Form.Label>
            <Form.Control placeholder='z.B. Canyon'>
            </Form.Control>
          </Form.Group>
        </Col>

        <Col>
          <Form.Group>
            <Form.Label>
              Rahmennummer
            </Form.Label>
            <Form.Control>
            </Form.Control>
          </Form.Group>
        </Col>

        <Col>
          <Form.Group>
            <Form.Label>
              Bearbeitungsstatus
            </Form.Label>
            <Form.Select>
              <option value={0} hidden >Bitte wählen...</option>
              <option value={1}>platzhalter1</option>
            </Form.Select>
          </Form.Group>
        </Col>

        <Col>
          <Form.Group>
            <Form.Label>
              Datum
            </Form.Label>
            <Row>
              <Form.Control type='number' placeholder='TT' style={{width: '65px'}}></Form.Control>
              <Form.Control type='number' placeholder='MM' style={{width: '65px'}}></Form.Control>
              <Form.Control type='number' placeholder='YYYY' style={{width: '100px'}}></Form.Control>
            </Row>
          </Form.Group>
        </Col>
      </Row>
      {/* // #endregion */}

      {/* // #region Tabellen-Bereich (Inhalt der Datenbank) */}
      <Row>
        <Table striped bordered hover className='my-4'>
          <thead>
            <tr>
              <th className='agens-theme-blue'>Fahrrad-ID</th>
              <th className='agens-theme-blue'>Marke</th>
              <th className='agens-theme-blue'>Rahmennummer</th>
              <th className='agens-theme-blue'>Bearbeitungsstatus</th>
              <th className='agens-theme-blue'>Datum</th>
            </tr>
          </thead>
        </Table>
      </Row>
      {/* // #endregion */}

      {/* // #region Tabellen-Bereich (Inhalt der Datenbank) */}
      <Form.Group className=''>
        <Button className='agens-button-primary'>
          bearbeiten
        </Button>
        <Button className='agens-button-primary'>
          löschen
        </Button>
      </Form.Group>
      {/* // #endregion */}

      <Button 
        className='agens-button-primary' 
        style={{
          position: 'fixed', 
          bottom: '20px', 
          right: '20px', 
          width: '140px'
        }}
        onClick={() => {navigate('/')}}
        >zurück
      </Button>
    </Container>
  );
};