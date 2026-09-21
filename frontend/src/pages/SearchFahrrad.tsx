import { useState, useEffect } from 'react';
import { Container, Form, Row, Col, Table, Button, Modal } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import '../assets/css/custom-style.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import { fahrradService } from '../services/fahrradService';
import { pdfService } from '../services/pdfService';
import { FahrradForm } from '../components/FahrradForm';
import type { Fahrrad } from '../types/Fahrrad';

export const SearchFahrrad = () => {
  const navigate = useNavigate();
  const [columns, setColumns] = useState<string[]>([]);
  const [load, setLoad] = useState<boolean>(true);
  const [allFahrraeder, setAllFahrraeder] = useState<Record<string, any>[]>([]);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [buttonText, setButtonText] = useState('alle Fahrräder anzeigen');
  const [currentPage, setCurrentPage] = useState(0);
  const [showButton, setShowButton] = useState(true);
  const [selectedFahrrad, setSelectedFahrrad] = useState<number | null>(null);

  // State für das Bearbeiten-Modal
  const [editingFahrrad, setEditingFahrrad] = useState<Fahrrad | null>(null);

  // State für das Löschen-Bestätigungsmodal
  const [deletingFahrrad, setDeletingFahrrad] = useState<Record<string, any> | null>(null);

  const [datumSearch, setDatumSearch] = useState('');
  const [idSearch, setIdSearch] = useState('');
  const [markeSearch, setMarkeSearch] = useState('');
  const [rahmennummerSearch, setRahmennummerSearchSearch] = useState('');
  const [bearbeitungsstatusSearch, setBearbeitungsstatusSearch] = useState('');

  // Formatiert die Spaltenköpfe für eine übersichtlichere Anzeige
  const formatHeaderName = (colName: string): string => {
    const lower = colName.toLowerCase();
    if (lower === 'erfasst_am') return 'Eingangsdatum';
    if (lower === 'ausgang_am') return 'Ausgangsdatum';

    return colName
      .replace('_', '-')
      .replace(colName.charAt(0), colName.charAt(0).toUpperCase())
      .replace('-id', '-ID');
  };

  // Prüft, ob ein Spaltenname exakt ein Datumsfeld ist (z. B. erfasst_am, ausgang_am, datum)
  const isDateColumnName = (colName: string): boolean => {
    const colLower = colName.toLowerCase();
    return (
      colLower.endsWith('_am') ||
      colLower.endsWith('-am') ||
      colLower.includes('datum') ||
      colLower.includes('date') ||
      colLower.includes('created_at') ||
      colLower.includes('updated_at')
    );
  };

  // Formatiert Datumsangaben in das Format "DD.MM.YYYY - HH:mm Uhr"
  const formatDateValue = (val: any): string => {
    if (!val) return '-';

    const dateObj = new Date(val);
    
    // Prüfen, ob es sich um ein gültiges Datum handelt
    if (isNaN(dateObj.getTime())) {
      return String(val);
    }

    const day = String(dateObj.getDate()).padStart(2, '0');
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const year = dateObj.getFullYear();
    const hours = String(dateObj.getHours()).padStart(2, '0');
    const minutes = String(dateObj.getMinutes()).padStart(2, '0');

    return `${day}.${month}.${year} - ${hours}:${minutes} Uhr`;
  };

  const handleShowAllFahrrader = async () => {
    const data = await fahrradService.fetchAllWithAttributes(currentPage);

    if (data && data.length > 0) {
      setAllFahrraeder(prev => [...prev, ...data]);
      
      if (data.length < 100) {
        setShowButton(false);
      }

      setCurrentPage(prev => prev + 1);
      setButtonText('mehr');
      setHasLoaded(true);
    } else {
      setShowButton(false);
    }   
  };

  useEffect(() => {
    const loadHeader = async () => {
      const data = await fahrradService.fetchHead();
      if (data) {
        setColumns(data);
      }
      setLoad(false);
    };
    loadHeader();
  }, []);

  // Öffnet das Modal mit den Daten des ausgewählten Fahrrads
  const handleEditClick = () => {
    console.log('[DEBUG SearchFahrrad] handleEditClick getriggert. Ausgewählte ID:', selectedFahrrad);
    
    if (selectedFahrrad === null) {
      console.warn('[DEBUG SearchFahrrad] Abbruch: selectedFahrrad ist null.');
      return;
    }

    const itemToEdit = allFahrraeder.find(f => f.fahrrad_id === selectedFahrrad);
    console.log('[DEBUG SearchFahrrad] Gefundenes Fahrrad aus Tabelle:', itemToEdit);

    if (itemToEdit) {
      const formattedFahrrad: Fahrrad = {
        id: itemToEdit.fahrrad_id,
        marke: itemToEdit.marke || '',
        rahmennummer: itemToEdit.rahmennummer || '',
        farbe: itemToEdit.farbe || '',
        bearbeitungsstatus: itemToEdit.bearbeitungsstatus || '',
        kundeId: itemToEdit.kunde_id || ''
      };

      console.log('[DEBUG SearchFahrrad] Setze editingFahrrad für Modal auf:', formattedFahrrad);
      setEditingFahrrad(formattedFahrrad);
    } else {
      console.error('[DEBUG SearchFahrrad] Fehler: Kein Eintrag in allFahrraeder mit fahrrad_id ===', selectedFahrrad);
    }
  };

  // Speichert die geänderten Daten im Backend & aktualisiert die Tabelle
  const handleSaveFahrrad = async (updatedData: Fahrrad) => {
    console.log('[DEBUG SearchFahrrad] handleSaveFahrrad gestartet.');
    console.log('[DEBUG SearchFahrrad] Aktuell selectedFahrrad:', selectedFahrrad);
    console.log('[DEBUG SearchFahrrad] Vom Formular übergebene Daten (updatedData):', updatedData);

    if (!selectedFahrrad) {
      console.error('[DEBUG SearchFahrrad] Speichern abgebrochen: Keine selectedFahrrad ID vorhanden!');
      return;
    }

    try {
      console.log(`[DEBUG SearchFahrrad] Sende UPDATE-Request via fahrradService.update(${selectedFahrrad}, ...)`);
      const success = await fahrradService.update(selectedFahrrad, updatedData);
      console.log('[DEBUG SearchFahrrad] Rückgabe fahrradService.update success =', success);

      if (success) {
        console.log('[DEBUG SearchFahrrad] Speichern erfolgreich. Aktualisiere allFahrraeder State...');
        
        setAllFahrraeder(prev =>
          prev.map(item =>
            item.fahrrad_id === selectedFahrrad
              ? { ...item, ...updatedData }
              : item
          )
        );

        console.log('[DEBUG SearchFahrrad] Schließe Modal (editingFahrrad = null).');
        setEditingFahrrad(null);
      } else {
        console.warn('[DEBUG SearchFahrrad] Backend meldete keinen Erfolg beim Speichern (success is falsy).');
        alert('Änderung konnte nicht gespeichert werden.');
      }
    } catch (error) {
      console.error('[DEBUG SearchFahrrad] Fehler beim Aufruf von handleSaveFahrrad:', error);
    }
  };

  // Öffnet das Bestätigungs-Modal zum Löschen
  const handleDeleteClick = () => {
    if (selectedFahrrad === null) return;
    const itemToDelete = allFahrraeder.find(f => f.fahrrad_id === selectedFahrrad);
    if (itemToDelete) {
      setDeletingFahrrad(itemToDelete);
    }
  };

  // Löschen nach der Bestätigung
  const handleConfirmDelete = async () => {
    if (!deletingFahrrad) return;

    const idToDelete = deletingFahrrad.fahrrad_id;
    console.log('[DEBUG SearchFahrrad] Bestätigtes Löschen geklickt für ID:', idToDelete);

    try {
      const success = await fahrradService.deleteById(idToDelete);

      if (success) {
        setAllFahrraeder(prev => prev.filter(f => f.fahrrad_id !== idToDelete));
        setSelectedFahrrad(null);
        setDeletingFahrrad(null);
      } else {
        alert('Fahrrad konnte nicht gelöscht werden.');
      }
    } catch (error) {
      console.error('[DEBUG SearchFahrrad] Fehler beim Löschen:', error);
    }
  };

  if (load) {
    return <div className="spinner-border text-primary"></div>;
  }

  return (
    <Container className='py-4'>

      {/* Tabellen-Bereich */}
      <Row>
        <Table responsive striped bordered hover className='my-4'>
          <thead>
            <tr>
              {columns.map((name) => (
                <th className='agens-theme-blue' key={name} scope='col'>
                  {formatHeaderName(name)}
                </th>
              ))} 
            </tr>
          </thead>
          <tbody>
            {allFahrraeder.map((row, rowIndex) => {
              const isSelected = selectedFahrrad === row.fahrrad_id;

              return (
                <tr
                  key={rowIndex}
                  onClick={() => {
                    console.log('[DEBUG SearchFahrrad] Zeile geklickt. Fahrrad-ID:', row.fahrrad_id);
                    setSelectedFahrrad(prev => prev === row.fahrrad_id ? null : row.fahrrad_id);
                  }}
                  className={isSelected ? 'table-primary' : ''}
                  style={{ cursor: 'pointer' }}
                >
                  {columns.map((colName) => {
                    const rawValue = row[colName];
                    const isDateColumn = isDateColumnName(colName);

                    return (
                      <td key={colName}>
                        {rawValue !== null && rawValue !== undefined
                          ? isDateColumn 
                            ? formatDateValue(rawValue) 
                            : String(rawValue)
                          : '-'
                        }
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </Table>

        {/* Button-Bereich */}
        <Form.Group className='d-flex gap-2'>
          <Button 
            className='agens-button-primary'
            hidden={selectedFahrrad == null}
            onClick={handleEditClick}
          >
            bearbeiten
          </Button>
          <Button 
            className='agens-button-primary'
            hidden={selectedFahrrad == null}
            onClick={handleDeleteClick}
          >
            löschen
          </Button>
          <Button
            className='agens-button-primary'
            disabled={allFahrraeder.length === 0}
            onClick={() => {
              pdfService.exportFahrraederToPdf(columns, allFahrraeder);
            }}
          >
            als PDF exportieren
          </Button>
        </Form.Group>
      </Row>

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
        onClick={() => { navigate('/'); }}
      >
        zurück
      </Button>

      {/* MODAL FÜR DAS BEARBEITEN */}
      <Modal show={editingFahrrad !== null} onHide={() => setEditingFahrrad(null)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Fahrrad ID {editingFahrrad?.id} bearbeiten</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {editingFahrrad && (
            <FahrradForm
              initialData={editingFahrrad}
              onSubmit={handleSaveFahrrad}
              onCancel={() => setEditingFahrrad(null)}
            />
          )}
        </Modal.Body>
      </Modal>

      {/* MODAL FÜR DAS LÖSCHEN-BESTÄTIGEN */}
      <Modal 
        show={deletingFahrrad !== null} 
        onHide={() => setDeletingFahrrad(null)} 
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Fahrrad löschen</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {deletingFahrrad && (
            <p>
              Möchtest du das Fahrrad mit der ID <strong>{deletingFahrrad.fahrrad_id}</strong>
              {deletingFahrrad.marke ? ` (${deletingFahrrad.marke})` : ''} wirklich löschen?
            </p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setDeletingFahrrad(null)}>
            Abbrechen
          </Button>
          <Button variant="danger" onClick={handleConfirmDelete}>
            Endgültig löschen
          </Button>
        </Modal.Footer>
      </Modal>

    </Container>
  );
};