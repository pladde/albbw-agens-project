import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';

interface DateRange {
  startDate?: string;
  endDate?: string;
}

export const pdfService = {
  /**
   * Exportiert die Tabellendaten als A4-PDF im Querformat.
   * @param columns Array der Spaltennamen aus der Datenbank (z.B. ['fahrrad_id', 'marke', ...])
   * @param data Array der geladenen/gefilterten Fahrrad-Objekte
   * @param dateRange Optionaler Datumsfilter für die Überschrift
   */
  exportFahrraederToPdf: (
    columns: string[], 
    data: Record<string, any>[], 
    dateRange?: DateRange
  ) => {
    if (!data || data.length === 0) {
      alert('Keine Daten zum Exportieren vorhanden.');
      return;
    }

    // DIN A4 (Querformat bzw. Landscape) initialisieren
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4',
    });

    // Header (Titel & Metadaten)
    const title = 'Fahrrad-Bestandsübersicht';
    let dateStr = `Erstellt am: ${new Date().toLocaleDateString('de-DE')} um ${new Date().toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })} Uhr`;

    // Zeitraum hinzufügen, falls einer gewählt wurde
    if (dateRange?.startDate || dateRange?.endDate) {
      const startFormatted = dateRange.startDate 
        ? new Date(dateRange.startDate).toLocaleDateString('de-DE') 
        : 'Anfang';
      const endFormatted = dateRange.endDate 
        ? new Date(dateRange.endDate).toLocaleDateString('de-DE') 
        : 'Heute';
      dateStr += ` | Zeitraum: ${startFormatted} - ${endFormatted}`;
    }

    // Titel
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(16);
    doc.setTextColor(33, 37, 41);
    doc.text(title, 14, 15);

    // Erstellungsdatum & Anzahl Einträge
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(108, 117, 125); // Muted Gray
    doc.text(`${dateStr} | Einträge: ${data.length}`, 14, 21);

    // Spaltenüberschriften formatieren
    const formattedHeaders = columns.map((col) =>
      col
        .replace('_', ' ')
        .replace(/\b\w/g, (char) => char.toUpperCase())
        .replace('Id', 'ID')
    );

    // Tabelleninhalt aufbereiten
    const tableBody = data.map((row) =>
      columns.map((col) => (row[col] !== null && row[col] !== undefined ? String(row[col]) : '-'))
    );

    // Rendern mit jspdf-autotable
    autoTable(doc, {
      startY: 26,
      head: [formattedHeaders],
      body: tableBody,
      theme: 'striped',
      styles: {
        font: 'helvetica',
        fontSize: 8,
        cellPadding: 2.5,
        valign: 'middle',
        overflow: 'linebreak',
      },
      headStyles: {
        fillColor: [13, 110, 253],
        textColor: [255, 255, 255],
        fontStyle: 'bold',
        halign: 'left',
      },
      alternateRowStyles: {
        fillColor: [248, 249, 250], 
      },
      margin: { top: 25, right: 14, bottom: 15, left: 14 },
      didDrawPage: (dataArg) => {
        // Fußzeile mit Seitennummerierung
        const pageCount = doc.getNumberOfPages();
        const pageHeight = doc.internal.pageSize.height || doc.internal.pageSize.getHeight();
        const pageWidth = doc.internal.pageSize.width || doc.internal.pageSize.getWidth();

        doc.setFontSize(8);
        doc.setTextColor(150);
        
        // Trennlinie
        doc.setDrawColor(220);
        doc.line(14, pageHeight - 12, pageWidth - 14, pageHeight - 12);

        doc.text(
          `Seite ${dataArg.pageNumber} von ${pageCount}`,
          pageWidth - 14,
          pageHeight - 6,
          { align: 'right' }
        );
      },
    });

    // PDF erstellen und herunterladen
    const formattedDate = new Date().toISOString().slice(0, 10);
    doc.save(`fahrrad_bestand_${formattedDate}.pdf`);
  },
};