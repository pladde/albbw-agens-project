import { useState, useEffect } from 'react';
import { Container, Form, Row, Col, Table, Button} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import '../services/fahrradService';
import '../assets/css/custom-style.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { fahrradService } from '../services/fahrradService';
import { pdfService } from '../services/pdfService';

export const SearchFahrrad = () => {
  const navigate = useNavigate();
  const [columns, setColumns] = useState<string[]>([]);
  const [load, setLoad] = useState<boolean>(true);
  const [allFahrraeder, setAllFahrraeder] = useState<Record<string, any>[]>([]);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [buttonText, setButtonText] = useState('alle Fahrräder anzeigen')
  const [currentPage, setCurrentPage] = useState(0);
  const [showButton, setShowButton] = useState(true);
  const [selectedFahrrad, setSelectedFahrrad] = useState<number | null>(null);

  const [datumSearch, setDatumSearch] = useState('');
  const [idSearch, setIdSearch] = useState('');
  const [markeSearch, setMarkeSearch] = useState('');
  const [rahmennummerSearch, setRahmennummerSearchSearch] = useState('');
  const [bearbeitungsstatusSearch, setBearbeitungsstatusSearch] = useState('');

  const handleShowAllFahrrader = async () => {

    const data = await fahrradService.fetchAllWithAttributes(currentPage);

    if (data && data.length > 0) {
      setAllFahrraeder(prev => [...prev, ...data]);
      
      // Blendet den Button aus wenn weniger als 100 Einträge zurückkamen
      if (data.length < 100) {
        setShowButton(false);
      }

      setCurrentPage(prev => prev + 1); // Seite für das nächste Mal erhöhen
      
      setButtonText('mehr');
      setHasLoaded(true);
    }
    else {
      setShowButton(false);
    }   
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
              <Form.Control 
                type="date"
                value={datumSearch}
                onChange={(e) => setDatumSearch(e.target.value)}
              >
              </Form.Control>
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
            {allFahrraeder.map((row, rowIndex) => {
              // Prüfen, ob diese Zeile die aktuell ausgewählte ist
              const isSelected = selectedFahrrad === row.fahrrad_id;
              console.log(selectedFahrrad + ' ausgewählt.');

              return (
                <tr
                  key={rowIndex}
                  onClick={
                    () => setSelectedFahrrad(prev => prev === row.fahrrad_id ? null : row.fahrrad_id)
                  }
                  className={isSelected ? 'table-primary' : ''}
                  style={{ cursor: 'pointer' }}
                >
                  {columns.map((colName) => (
                    <td key={colName}>
                      {row[colName] !== null ? String(row[colName]) : '-'}
                    </td>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </Table>

        {/* // #region Button-Bereich */}
        <Form.Group className=''>
          <Button 
            className='agens-button-primary'
            hidden={selectedFahrrad == null}
            onClick={() => console.log('bearbeiten bla bla')}
            >
            bearbeiten
          </Button>
          <Button 
            className='agens-button-primary'
            hidden={selectedFahrrad == null}
            onClick={async () => {
              if (selectedFahrrad != null) {
                const success = await fahrradService.deleteById(selectedFahrrad);
                
                if (success) {
                  setAllFahrraeder(prev => prev.filter(f => f.fahrrad_id !== selectedFahrrad));
                  setSelectedFahrrad(null);
                }
              }
            }}
            >
            löschen
          </Button>
          <Button
          className='agens-button-primary'
          //hidden={selectedFahrrad != null}
          onClick={() => {
            pdfService.createPdf();
          }}
          > als PDF exportieren
          </Button>
        </Form.Group>
        {/* // #endregion */}
      </Row>
      {/* // #endregion */}

      {showButton && (
      <div id='btn-showAll' className='text-center'>
        <Button 
          className='my-4 agens-button-primary'
          onClick={handleShowAllFahrrader}
        >
          {buttonText}
        </Button>
      </div>
      )}

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