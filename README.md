# Fahrradwerkstatt-Projekt

Diese Branch beinhaltet die komplette Neuentwicklung des Projekts für die Fahrradwerkstatt. Ziel ist es, alle Learnings aus der Abschlussprüfung (AP) anzuwenden und eine saubere, qualitativ hochwertige Architektur umzusetzen. 

Die grundlegenden Funktionen werden im Zuge der Entwicklung hier dokumentiert.


## Installieren der Abhängigkeiten: ##

### 1. Frontend einrichten
Navigiere in den Frontend-Ordner und installiere die Pakete:
```bash
cd frontend
npm install
```

### 2. Backend einrichten
Navigiere in den Backend-Ordner und installiere die Pakete:
```bash
cd backend
npm install
```

### 3. Backend starten
Navigiere zuerst in den Backend-Ordner.
```bash
cd backend
```
Starte dann über die Powershell / das Terminal den Server mit:
```bash
npx tsx server.ts
```

### 4. Frontend starten
Navigiere zuerst in den Frontend-Ordner.
```bash
cd frontend
```
Starte dann über die Powershell / das Terminal das Frontend mit:
```bash
npm run dev
```



## Einrichten der Datenbank: ##

### 1. Installation

1. Stelle sicher, dass dein Datenbankserver läuft.
2. Navigiere in das Backend-Verzeichnis: 
   `...\albbw-agens-project\Backend\`
3. Kopiere die `.env.example` und benenne die Kopie in `.env` um.
4. Öffne die `.env`-Datei mit einem Editor deiner Wahl.
5. Konfiguriere die Einstellungen wie im folgenden Beispiel:

```env
# Allgemeine Einstellungen
NODE_ENV=development
PORT=3000

# Datenbank-Zugangsdaten
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=""
DB_NAME=DEIN_DB_NAME
```

6. Navigiere in das Backend-Verzeichnis: 
   `...\albbw-agens-project\backend\database\`
7. Öffne die `script.sql` um das Schema zu installieren.
8. (OPTIONAL) Wenn du Testdaten benötigst, führe anschließend die `testdaten.sql` aus.

