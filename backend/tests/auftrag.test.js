const router = require('../src/routes/auftragRoutes.js');

test('')



// - __T-01:__ POST /api/auftrag – Speichern eines validen JSON-Auftragsdatensatzes → HTTP 201

// - __T-02:__ POST /api/auftrag – Speichern mit fehlerhafter JSON-Syntax → HTTP 400, Exception-Handling

// - __T-03:__ GET /api/auftrag – Abrufen der gesamten Auftragsliste → HTTP 200

// - __T-04:__ PUT /api/auftrag/:id – Bearbeiten eines vorhandenen Datensatzes → HTTP 200

// - __T-05:__ DELETE /auftrag/:id – Löschen eines existierenden Datensatzes → HTTP 200

// - __T-06:__ Löschen einer nichtexistierenden ID → HTTP 404, Error-Log
