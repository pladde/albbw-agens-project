import { useState, useEffect } from 'react';
import { Container, Form, Row, Col, Table, Button, Modal, Card, Badge } from 'react-bootstrap';
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

  // State für das PDF-Export Modal & Zeitraum
  const [showPdfModal, setShowPdfModal] = useState<boolean>(false);
  const [pdfStartDate, setPdfStartDate] = useState<string>('');
  const [pdfEndDate, setPdfEndDate] = useState<string>('');

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

  // Prüft, ob ein Spaltenname exakt ein Datumsfeld ist
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
    if (selectedFahrrad === null) return;

    const itemToEdit = allFahrraeder.find(f => f.fahrrad_id === selectedFahrrad);

    if (itemToEdit) {
      const formattedFahrrad: Fahrrad = {
        id: itemToEdit.fahrrad_id,
        marke: itemToEdit.marke || '',
        rahmennummer: itemToEdit.rahmennummer || '',
        farbe: itemToEdit.farbe || '',
        bearbeitungsstatus: itemToEdit.bearbeitungsstatus || '',
        kundeId: itemToEdit.kunde_id || ''
      };

      setEditingFahrrad(formattedFahrrad);
    }
  };

  // Speichert die geänderten Daten im Backend & aktualisiert die Tabelle
  const handleSaveFahrrad = async (updatedData: Fahrrad) => {
    if (!selectedFahrrad) return;

    try {
      const success = await fahrradService.update(selectedFahrrad, updatedData);

      if (success) {
        setAllFahrraeder(prev =>
          prev.map(item =>
            item.fahrrad_id === selectedFahrrad
              ? { ...item, ...updatedData }
              : item
          )
        );
        setEditingFahrrad(null);
      } else {
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

  // Führt den PDF-Export mit gefiltertem Zeitraum aus
  const handleConfirmPdfExport = () => {
    let filteredData = [...allFahrraeder];

    if (pdfStartDate || pdfEndDate) {
      filteredData = filteredData.filter(row => {
        // Prüft primär 'erfasst_am' oder verwandte Datumsfelder
        const rawDate = row.erfasst_am || row.datum || row.created_at;
        if (!rawDate) return true;

        const rowTime = new Date(rawDate).getTime();
        const start = pdfStartDate ? new Date(pdfStartDate + 'T00:00:00').getTime() : -Infinity;
        const end = pdfEndDate ? new Date(pdfEndDate + 'T23:59:59').getTime() : Infinity;

        return rowTime >= start && rowTime <= end;
      });
    }

    if (filteredData.length === 0) {
      alert('Keine Einträge im ausgewählten Zeitraum gefunden.');
      return;
    }

    pdfService.exportFahrraederToPdf(columns, filteredData, {
      startDate: pdfStartDate,
      endDate: pdfEndDate
    });

    setShowPdfModal(false);
  };

  if (load) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Laden...</span>
        </div>
      </div>
    );
  }

  return (
    <Container className="py-4 pb-5 mb-4">
      
      {/* Aktions-Buttons oben */}
      <Row className="mb-3">
        <Col className="d-flex flex-wrap gap-2 justify-content-start align-items-center">
          {selectedFahrrad !== null && (
            <>
              <Button 
                className="agens-button-primary flex-grow-1 flex-sm-grow-0"
                onClick={handleEditClick}
              >
                <i className="bi bi-pencil me-1"></i> Bearbeiten
              </Button>
              <Button 
                className="btn-danger flex-grow-1 flex-sm-grow-0"
                onClick={handleDeleteClick}
              >
                <i className="bi bi-trash me-1"></i> Löschen
              </Button>
            </>
          )}
          <Button
            className="agens-button-primary flex-grow-1 flex-sm-grow-0 ms-auto-sm"
            disabled={allFahrraeder.length === 0}
            onClick={() => setShowPdfModal(true)}
          >
            <i className="bi bi-file-earmark-pdf me-1"></i> als PDF exportieren
          </Button>
        </Col>
      </Row>

      {/* DESKTOP-ANSICHT: Tabelle */}
      <Row className="d-none d-md-block">
        <Col>
          <Table responsive striped bordered hover className="my-2 align-middle">
            <thead>
              <tr>
                {columns.map((name) => (
                  <th className="agens-theme-blue text-nowrap" key={name} scope="col">
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
                    onClick={() => setSelectedFahrrad(prev => prev === row.fahrrad_id ? null : row.fahrrad_id)}
                    className={isSelected ? 'table-primary' : ''}
                    style={{ cursor: 'pointer' }}
                  >
                    {columns.map((colName) => {
                      const rawValue = row[colName];
                      const isDateColumn = isDateColumnName(colName);

                      return (
                        <td key={colName} className="text-nowrap">
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
        </Col>
      </Row>

      {/* MOBIL-ANSICHT: Cards */}
      <Row className="d-md-none g-3">
        {allFahrraeder.map((row, rowIndex) => {
          const isSelected = selectedFahrrad === row.fahrrad_id;

          return (
            <Col xs={12} key={rowIndex}>
              <Card 
                className={`shadow-sm border ${isSelected ? 'border-primary bg-light' : ''}`}
                onClick={() => setSelectedFahrrad(prev => prev === row.fahrrad_id ? null : row.fahrrad_id)}
                style={{ cursor: 'pointer' }}
              >
                <Card.Header className="d-flex justify-content-between align-items-center bg-white fw-bold">
                  <span>ID: {row.fahrrad_id || '-'}</span>
                  {isSelected && <Badge bg="primary">Ausgewählt</Badge>}
                </Card.Header>
                <Card.Body className="p-3">
                  <Row className="g-2">
                    {columns.map((colName) => {
                      if (colName === 'fahrrad_id') return null;
                      const rawValue = row[colName];
                      const isDateColumn = isDateColumnName(colName);

                      return (
                        <Col xs={6} key={colName} className="mb-1">
                          <small className="text-muted d-block text-truncate">
                            {formatHeaderName(colName)}
                          </small>
                          <span className="fw-semibold text-break">
                            {rawValue !== null && rawValue !== undefined
                              ? isDateColumn 
                                ? formatDateValue(rawValue) 
                                : String(rawValue)
                              : '-'
                            }
                          </span>
                        </Col>
                      );
                    })}
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          );
        })}
      </Row>

      {/* Button: Mehr laden */}
      {showButton && (
        <Row className="my-4">
          <Col className="text-center">
            <Button 
              className="agens-button-primary px-4"
              onClick={handleShowAllFahrrader}
            >
              {buttonText}
            </Button>
          </Col>
        </Row>
      )}

      {/* Fixierter Zurück-Button */}
      <Button 
        className="agens-button-primary shadow" 
        style={{
          position: 'fixed', 
          bottom: '20px', 
          right: '20px', 
          zIndex: 1050,
          minWidth: '120px'
        }}
        onClick={() => { navigate('/'); }}
      >
        <i className="bi bi-arrow-left me-1"></i> zurück
      </Button>

      {/* MODAL FÜR ZEITRAUM-AUSWAHL BEIM PDF-EXPORT */}
      <Modal show={showPdfModal} onHide={() => setShowPdfModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title><i className="bi bi-calendar-range me-2"></i>PDF-Export Zeitraum wählen</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row className="g-3">
              <Col xs={12} sm={6}>
                <Form.Group controlId="pdfStartDate">
                  <Form.Label className="fw-semibold">Von (Eingangsdatum):</Form.Label>
                  <Form.Control 
                    type="date" 
                    value={pdfStartDate}
                    onChange={(e) => setPdfStartDate(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col xs={12} sm={6}>
                <Form.Group controlId="pdfEndDate">
                  <Form.Label className="fw-semibold">Bis (Eingangsdatum):</Form.Label>
                  <Form.Control 
                    type="date" 
                    value={pdfEndDate}
                    onChange={(e) => setPdfEndDate(e.target.value)}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Text className="text-muted mt-2 d-block">
              Lasse die Felder leer, um alle aktuell geladenen Einträge ohne Datumsfilter zu exportieren.
            </Form.Text>
          </Form>
        </Modal.Body>
        <Modal.Footer className="flex-nowrap">
          <Button variant="secondary" className="w-50" onClick={() => setShowPdfModal(false)}>
            Abbrechen
          </Button>
          <Button className="agens-button-primary w-50" onClick={handleConfirmPdfExport}>
            <i className="bi bi-download me-1"></i> Exportieren
          </Button>
        </Modal.Footer>
      </Modal>

      {/* MODAL FÜR DAS BEARBEITEN */}
      <Modal 
        show={editingFahrrad !== null} 
        onHide={() => setEditingFahrrad(null)} 
        centered
        fullscreen="sm-down"
      >
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
        <Modal.Footer className="flex-nowrap">
          <Button variant="secondary" className="w-50" onClick={() => setDeletingFahrrad(null)}>
            Abbrechen
          </Button>
          <Button variant="danger" className="w-50" onClick={handleConfirmDelete}>
            Endgültig löschen
          </Button>
        </Modal.Footer>
      </Modal>

    </Container>
  );
};