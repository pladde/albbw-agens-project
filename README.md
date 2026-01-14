# 🌐 agens-fahrrad-projekt
### *von Michel Poerschke*  

---

## 📘 Projektbeschreibung

Folgt...

---

## 📬 Schnittstellen (API-Dokumentation)

Die Basis-URL für alle Endpunkte ist:  
`http://localhost:3000/api/fahrrad`


### 1. Fahrrad erstellen
Legt einen neuen Datensatz in der Datenbank an.

* **URL:** `api/fahrrad/`
* **Methode:** `POST`

***Request:***
```json
{
    "marke": "BEISPIELMARKE",
    "rahmennummer": "RHNr-0815",
    "besonderheiten": "Beispieltext",
    "bearbeitungsstatus": "angenommen",
    "erfasstAm": "2026-01-14T13:00:00Z",
    "erfasstVon": "MITARBEITER_ID",
    "herausgegebenAn": "KUNDEN_ID",
    "qrCode": "123456789QWERTZ"
}
```
***Response-Body: (200 OK)***
```json
{
    "fahrrad_id" : 0815,
    "marke": "BEISPIELMARKE",
    "rahmennummer": "RHNr-0815",
    "besonderheiten": "Beispieltext",
    "bearbeitungsstatus": "angenommen",
    "erfasstAm": "2026-01-14T13:00:00Z",
    "erfasstVon": "MITARBEITER_ID",
    "herausgegebenAn": "KUNDEN_ID",
    "qrCode": "123456789QWERTZ"
}
```


### 2. Alle Fahrräder abfragen
Legt einen neuen Datensatz in der Datenbank an.

* **URL:** `api/fahrrad/`
* **Methode:** `GET`

***Response-Body: (200 OK)***
```json
[
    {
        "fahrrad_id" : 0815,
        "marke" : "BEISPIELMARKE",
        "rahmennummer" : "RHNr-0815",
        "besonderheiten" : "HIER KÖNNEN BESONDERHEITEN STEHEN",
        "bearbeitungsstatus" : "angenommen",
        "erfasstAm" : "YYYY-MM-DD HH:MM:SS",
        "erfasstVon" : "MITARBEITER_ID",
        "herausgegebenAn" : "KUNDEN_ID",
        "qrCode" : "123456789QWERTZ" 
    },
    {
        "fahrrad_id" : 1815,
        "marke" : "BEISPIELMARKE",
        "rahmennummer" : "RHNr-0816",
        "besonderheiten" : "HIER KÖNNEN BESONDERHEITEN STEHEN",
        "bearbeitungsstatus" : "angenommen",
        "erfasstAm" : "YYYY-MM-DD HH:MM:SS",
        "erfasstVon" : "MITARBEITER_ID",
        "herausgegebenAn" : "KUNDEN_ID",
        "qrCode" : "QWERTZ123456789" 
    }
]
```


### 3. Fahrrad anhand einer spzifischen ID abfragen


* **URL:** `api/fahrrad/id/:id`
* **Methode:** `GET`
* **Parameter:** `id` (Ganzzahl)
* **Beispiel-URL:** `GET /api/fahrrad/id/0815`

***Response-Body: (200 OK)***
```json
{
    "fahrrad_id" : 0815,
    "marke" : "BEISPIELMARKE",
    "rahmennummer" : "RHNr-0815",
    "besonderheiten" : "HIER KÖNNEN BESONDERHEITEN STEHEN",
    "bearbeitungsstatus" : "angenommen",
    "erfasstAm" : "YYYY-MM-DD HH:MM:SS",
    "erfasstVon" : "MITARBEITER_ID",
    "herausgegebenAn" : "KUNDEN_ID",
    "qrCode" : "123456789QWERTZ" 
}
```


### 4. Fahrräder anhand eines Strings abfragen


* **URL:** `api/fahrrad/string/:col/:val`
* **Methode:** `GET`
* **Parameter:** `col`, `val`
* **Beispiel-URL:** `GET /api/fahrrad/string/rahmennummer&RHNr-0815`

***Response-Body: (200 OK)***
```json
{
    "fahrrad_id" : 0815,
    "marke" : "BEISPIELMARKE",
    "rahmennummer" : "RHNr-0815",
    "besonderheiten" : "HIER KÖNNEN BESONDERHEITEN STEHEN",
    "bearbeitungsstatus" : "angenommen",
    "erfasstAm" : "YYYY-MM-DD HH:MM:SS",
    "erfasstVon" : "MITARBEITER_ID",
    "herausgegebenAn" : "KUNDEN_ID",
    "qrCode" : "123456789QWERTZ" 
}
```


### 5. Fahrräder anhand eines Datums abfragen


* **URL:** `api/fahrrad/date/:col/:val`
* **Methode:** `GET`
* **Parameter:** `col`, `val`
* **Beispiel-URL:** `GET /api/fahrrad/date/erfasstAm&2026-01-14`

***Response-Body: (200 OK)***
```json
{
    "fahrrad_id" : 0815,
    "marke" : "BEISPIELMARKE",
    "rahmennummer" : "RHNr-0815",
    "besonderheiten" : "HIER KÖNNEN BESONDERHEITEN STEHEN",
    "bearbeitungsstatus" : "angenommen",
    "erfasstAm" : "YYYY-MM-DD HH:MM:SS",
    "erfasstVon" : "MITARBEITER_ID",
    "herausgegebenAn" : "KUNDEN_ID",
    "qrCode" : "123456789QWERTZ" 
}
```


### 6. Ein Fahrrad anhand seiner ID löschen


* **URL:** `api/fahrrad/`
* **Methode:** `DELETE`
* **Parameter:** `id`
* **Beispiel-URL:** `DELETE /api/fahrrad/0815`

***Response-Body: (200 OK)***
```json
{
    "fahrrad_id" : 0815,
    "marke" : "BEISPIELMARKE",
    "rahmennummer" : "RHNr-0815",
    "besonderheiten" : "HIER KÖNNEN BESONDERHEITEN STEHEN",
    "bearbeitungsstatus" : "angenommen",
    "erfasstAm" : "YYYY-MM-DD HH:MM:SS",
    "erfasstVon" : "MITARBEITER_ID",
    "herausgegebenAn" : "KUNDEN_ID",
    "qrCode" : "123456789QWERTZ" 
}
```


### 7. Ein Fahrrad anhand seiner ID bearbeiten


* **URL:** `api/fahrrad/:id/:col/:val`
* **Methode:** `PUT`
* **Parameter:** `id`, `col`, `val`
* **Beispiel-URL:** `PUT /api/fahrrad/0815&marke&Cube`

***Response-Body: (200 OK)***
```json
{
    "fahrrad_id" : 0815,
    "marke" : "Cube",
    "rahmennummer" : "RHNr-0815",
    "besonderheiten" : "HIER KÖNNEN BESONDERHEITEN STEHEN",
    "bearbeitungsstatus" : "angenommen",
    "erfasstAm" : "YYYY-MM-DD HH:MM:SS",
    "erfasstVon" : "MITARBEITER_ID",
    "herausgegebenAn" : "KUNDEN_ID",
    "qrCode" : "123456789QWERTZ" 
}
```



---

## 🚀 Kernfunktion

- Verwalten von Fahrrädern.

---

## 🛠️ Geplanter Tech-Stack

#### **Backend**
- Node.js(@Typescript), Express, body-parser
#### **Frontend**
- React
#### **Stylesheet**
- Bootstrap
#### **Datenbank**
- MariaDB
#### **Testverfahren**
- jest

---

## ⚙️ Installation

Anleitung um das Projekt lauffähig zu bekommen.

1. Installation aller Dependencies:
```plaintext
npm install
```

2. Einstellungen:
```plaintext
.env einfügen
.env konfigurieren
```

3. Um diesen Branch zu aktivieren:

```plaintext
git pull https://github.com/pladde/albbw-agens-project/tree/agens_fahrrad
git checkout agens_fahrrad
```
4. Server starten
```plaintext
npx tsx server.ts
```

**Troubleshooting:**

Folgender Fehler kann bei der Installation aufretten:

```plaintext
npm : Die Datei "C:\Program Files\nodejs\npm.ps1" kann nicht geladen werden, da die Ausführung von Skripts auf diesem System deaktiviert ist. Weitere Informationen 
finden Sie unter "about_Execution_Policies" (https:/go.microsoft.com/fwlink/?LinkID=135170).
In Zeile:1 Zeichen:1
+ npm i
+ ~~~
    + CategoryInfo          : Sicherheitsfehler: (:) [], PSSecurityException
    + FullyQualifiedErrorId : UnauthorizedAccess
```


Das ist ein sehr klassisches Problem unter Windows. Die Fehlermeldung bedeutet, dass die PowerShell-Ausführungsrichtlinie (Execution Policy) verhindert, dass Skripte (wie npm.ps1) ausgeführt werden. Das ist eine Sicherheitsmaßnahme von Windows, die standardmäßig recht streng eingestellt ist.
Die Richtlinien des aktuellen Benutzers können mit folgendem Befehl geändert werden.
```plaintext
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser
```

##### IN DIESE BRANCH DARF NUR NACH ABSPRACHE GEPUSHT WERDEN!

---

## 👥 Michel Poerschke

Dieses Teilprojekt wird vom Auszubildenden `Michel Poerschke` 
des Annedore-Leber-Berufsbildungswerkes (ALBBW) ausgeführt.

Kontakt: m.poerschke@albbw.de
