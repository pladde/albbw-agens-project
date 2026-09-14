import { useState, useEffect } from 'react';
import { Container, Form, Row, Table, Button, } from 'react-bootstrap';
import '../assets/css/custom-style.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { fahrradService } from '../services/fahrradService';
import { pdfService } from '../services/pdfService';


export const FahrradTable: React.FC = () => {

    const [columns, setColumns] = useState<string[]>([]);
    const [allFahrraeder, setAllFahrraeder] = useState<Record<string, any>[]>([]);

    const [selectedFahrrad, setSelectedFahrrad] = useState<number | null>(null);
  
    return (
        <Container className='sticky-top' fluid style={{
            background: 'linear-gradient(90deg, #5374a5 0%, #324360 100%)',
            minHeight: '60px',
            display: 'flex',
            alignItems: 'center',
            fontSize: '18px',
            top: 0,
            left: 0,
            right: 0
        }}>
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
            onClick={() => {
              if (selectedFahrrad != null || selectedFahrrad != undefined) {
                fahrradService.deleteById(selectedFahrrad);
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

        </Container>
    );
};