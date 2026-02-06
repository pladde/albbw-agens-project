import { useState, useEffect } from 'react';
import { Container, Card, Form, Row, Col, InputGroup, Table, Button, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import '../services/fahrradService';
import '../assets/css/custom-style.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { fahrradService } from '../services/fahrradService';

export const SearchFahrrad = () => {
  const navigate = useNavigate();
  const [columns, setColumns] = useState<string[]>([]);
  const [load, setLoad] = useState<boolean>(true);
  const [allFahrraeder, setAllFahrraeder] = useState<Record<string, any>[]>([]);
  const [fahrraeder, setfahrraeder] = useState<Record<string, any>>([]);
  const [hasLoaded, setHasLoaded] = useState(false);

  const [searchTerm, setSearchTerm] = useState('');
  const [idSearch, setIdSearch] = useState('');
  const [markeSearch, setMarkeSearch] = useState('');
  const [rahmennummerSearch, setRahmennummerSearchSearch] = useState('');
  const [bearbeitungsstatusSearch, setBearbeitungsstatusSearch] = useState('');

  const handleShowAllFahrrader = async () => {
    const data = await fahrradService.fetchAll();
    if (data) {
      setAllFahrraeder(data);
    }
    setHasLoaded(true)
  };

  useEffect(() => {
    const loadHeader = async () => {
      const data = await fahrradService.fetchHead();
      if (data) {
        setColumns(data)
      }
      setLoad(false)
    };
    loadHeader();
  }, []);
  
  if (load) {
    return <div className="spinner-border text-primary"></div>;
  };

  return (
    <Container className='py-4'>

      {/* // #region Suchfilter-Bereich */}
      <Row>
        <Col>
        <Form.Group>
          <Form.Label>
            Fahrrad-ID
          </Form.Label>
          <Form.Control 
            placeholder='z.B. NK-001'
            value={idSearch}
            onChange={(e) => setIdSearch(e.target.value)}
            >
          </Form.Control>
        </Form.Group>
        </Col>

        <Col>
          <Form.Group>
            <Form.Label>
              Marke
            </Form.Label>
            <Form.Control placeholder='z.B. Canyon'
              value={markeSearch}
              onChange={(e) => setMarkeSearch(e.target.value)}
              >
            </Form.Control>
          </Form.Group>
        </Col>

        <Col>
          <Form.Group>
            <Form.Label>
              Rahmennummer
            </Form.Label>
            <Form.Control
              value={rahmennummerSearch}
              onChange={(e) => setRahmennummerSearchSearch(e.target.value)}
            >
            </Form.Control>
          </Form.Group>
        </Col>

        <Col>
          <Form.Group>
            <Form.Label>
              Bearbeitungsstatus
            </Form.Label>
            <Form.Select
              value={bearbeitungsstatusSearch}
              onChange={(e) => setBearbeitungsstatusSearch(e.target.value)}
            >
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
        <Table responsive striped bordered hover className='my-4'>
          <thead>
            <tr>
              {/* Erstellt den Tabellen-Header */}
              {columns.map((name) => (
                <th className='agens-theme-blue' key={name} scope='col'>
                  {name
                    .replace('_', '-')
                    .replace(name.charAt(0), name.charAt(0).toUpperCase())
                    .replace('-id', '-ID')
                    }
                </th>
              ))}
            </tr>
          </thead>
          { /* Erstellt und befüllt den Tabellen-Body mit den Fahrrädern aus der Datenbank */}
          <tbody>
            {allFahrraeder.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {columns.map((colName) => (
                  <td key={colName}>
                    {row[colName] !== null ? String(row[colName]): '-'}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </Table>
        {/* // #region Button-Berreich */}
        <Form.Group className=''>
          <Button className='agens-button-primary'>
            bearbeiten
          </Button>
          <Button className='agens-button-primary'>
            löschen
          </Button>
        </Form.Group>
        {/* // #endregion */}
      </Row>
      {/* // #endregion */}

      <div id='btn-showAll' className='text-center'>
        {allFahrraeder.length === 0 && (
          <Button className='my-4 agens-button-primary'
          onClick={handleShowAllFahrrader}
          >alle Fahrräder anzeigen</Button>
        )}
      </div>

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