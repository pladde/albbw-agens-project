# 🌐 agens-fahrrad-projekt
### *von Michel Poerschke*  

---

## 📘 Projektbeschreibung

Folgt...

---

## 📬 Schnittstellen

Die API für dieses Projekt liegt unter:
```plaintext
/api/fahrrad
```

Folgende Schnittstellen sind verfügbar:

Erstellen eines neues Fahrrads.
/create 
liefert das erstellte Objekt mit der ID zurück.
Hier ein Beispiel:
```plaintext
JSON
{
    "fahrrad_id" : 0,
    "marke" : "Canyon",
    "rahmennummer" : "0815-123ABC",
    "besonderheiten" : "Aerolenekr-Aufsatz",
    "bearbeitungsstatus" : "gespendet",
    "erfasstAm" : "YYYY-MM-DD HH:MI:SS",
    "erfasstVon" : "Mustermann, Max",
    "herausgegebenAn:" : "Musterfrau, Maria"
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
