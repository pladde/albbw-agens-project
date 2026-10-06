# Datenbank-Setup (Best Practices)

Dieses Projekt nutzt ein **hybrides Datenmodell**:
- **Relationale Daten** (`person`, `projekt`, `rolle`, ...) für fest strukturierte Daten
- **JSON-Spalte** (`auftrag.daten`) für flexible, sich ändernde Felder

## 1. Ausführung (Reihenfolge beachten!)

```bash
# 1) Schema: Datenbank `json_hybrid_db` neu aufbauen
mysql -u root -p < json_hybrid_db_SCHEMA.sql

# 2) Seed: statische Beispieldaten einfügen
mysql -u root -p < json_hybrid_db_SEED.sql
```

> **Achtung:** Der `DROP DATABASE IF EXISTS` in der Schema-Datei
> löscht die bisherige Datenbank vollständig.
> Das ist für die **Erstinstallation** oder einen **kontrollierten Neuaufbau** gedacht.
> Für echte Projekte nutzt man Migrations-Tools (z. B. Flyway), um Änderungen
> schrittweise und ohne Datenverlust einzuspielen.

## 2. Warum Schema und Seed trennen?

| Datei                     | Inhalt                                     | Zweck                          |
|---------------------------|--------------------------------------------|--------------------------------|
| `json_hybrid_db_SCHEMA.sql` | `DROP` + `CREATE DATABASE`, `CREATE TABLE`, Foreign Keys | definiert die **Struktur** |
| `json_hybrid_db_SEED.sql`   | `TRUNCATE`, `INSERT INTO`                  | liefert die **statischen Daten** |

**Vorteile:**
- Struktur und Daten ändern sich aus unterschiedlichen Gründen
- Schema kann neu ausgeführt werden, ohne die Daten anzufassen (und umgekehrt)
- Man kann mehrere Seeds (Testdaten, Produktionsdaten) einfach austauschen

## 3. Best Practices in der Schema-Datei

1. **Alles in `CREATE TABLE`** – Spalten, `PRIMARY KEY`, `UNIQUE KEY`, `KEY` und
   `CONSTRAINT` direkt zusammen. Das ist lesbarer als nachträgliche `ALTER TABLE`-Befehle.
2. **`INT UNSIGNED`** – eine ID kann nie negativ sein, dadurch verdoppelt sich der Wertebereich.
3. **`utf8mb4_unicode_ci`** – sprach- und emoji-fähige Sortierung (besser als `general_ci`).
4. **JSON-Typ** statt `LONGTEXT` + `CHECK` – MariaDB validiert JSON automatisch.
5. **Fremdschlüssel-Verhalten bewusst gewählt:**
   - `ON DELETE RESTRICT` bei `bezirk` und `rolle` – Stammdaten werden geschützt,
     ein versehentliches Löschen wird verhindert.
   - `ON DELETE CASCADE` bei `projekt_x_person` – wenn ein Projekt oder eine Person
     gelöscht wird, verschwinden die Zuordnungen automatisch.

## 4. Best Practices in der Seed-Datei

1. **Idempotent** – `TRUNCATE` vor den `INSERT`s: egal wie oft das Skript läuft,
   das Ergebnis ist immer identisch.
2. **Reihenfolge beachten** – erst Stammdaten (`rolle`, `bezirk`, `projekt`, `person`),
   dann Verknüpfungen (`projekt_x_person`) und `auftrag` (wegen Fremdschlüsseln).
3. **`SET FOREIGN_KEY_CHECKS = 0;`** – damit `TRUNCATE` auch bei verknüpften Tabellen funktioniert.
4. **Explizite Spaltenliste** in `INSERT INTO` – bleibt auch bei Schema-Erweiterungen verständlich.
5. **Kommentare** – pro Tabelle wird der Zusammenhang erklärt.

## 5. JSON-Daten wieder abfragen

```sql
SELECT a.auftrag_id,
       a.daten->'$.prioritaet' AS prioritaet,
       a.daten->'$.budget'     AS budget,
       p.titel                 AS projekt
FROM auftrag a
JOIN projekt p ON p.projekt_id = a.p_id;
```

Über den JSON-Operator `->` lassen sich die flexiblen Felder direkt abfragen.
Das ist der Vorteil des **hybriden Ansatzes**: feste Spalten für stabile
Strukturen, JSON für flexible Attribute.

## 6. Erweiterungsideen für später

- **Migrations-Skripte** mit Versionsnummern (`001_schema.sql`, `002_add_tabelle.sql`)
  und einer Migrationstabelle
- **Zeitstempel** `created_at` / `updated_at` auf allen Business-Tabellen
- **Views** für häufige JOINs
- **Indizes auf JSON-Feldern** über generierte Spalten