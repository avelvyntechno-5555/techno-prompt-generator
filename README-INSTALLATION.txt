# TECHNO PROMPT GENERATOR

Eine kostenlose, statische Progressive Web App (PWA) für iMac und iPhone. Die App erstellt englische SUNO-Style-Prompts aus deinen deutschen Auswahlfeldern. Sie verwendet keine kostenpflichtigen APIs und benötigt kein Benutzerkonto.

## Dateien
- `index.html` – Oberfläche
- `app.js` – Prompt-Logik, Smart Random, Favoriten und Verlauf
- `manifest.webmanifest` – Installationsdaten
- `sw.js` – Offline-Cache
- `icons/` – App-Icon

## Wichtig
Für die Installation als PWA muss die App über eine HTTPS-Adresse erreichbar sein. Ein Öffnen von `index.html` per Doppelklick reicht für die PWA-Installation nicht aus. Die App lässt sich kostenlos z. B. mit GitHub Pages hosten.

## Kostenlos mit GitHub Pages veröffentlichen
1. Bei https://github.com anmelden oder kostenloses Konto erstellen.
2. Ein neues Repository erstellen, z. B. `techno-prompt-generator`. Für die einfachste Einrichtung kann es öffentlich sein.
3. Alle Dateien und den Ordner `icons` aus diesem ZIP in das Repository hochladen. `index.html` muss direkt im Hauptverzeichnis liegen.
4. Im Repository **Settings → Pages** öffnen.
5. Unter **Build and deployment** `Deploy from a branch` wählen.
6. Branch `main`, Ordner `/ (root)` auswählen und speichern.
7. Nach der Veröffentlichung zeigt GitHub Pages eine HTTPS-Adresse an, etwa `https://BENUTZERNAME.github.io/techno-prompt-generator/`.
8. Diese Adresse auf iMac und iPhone öffnen.

GitHub-Oberflächen können sich ändern; die Menünamen können geringfügig abweichen. Die App selbst und GitHub Pages sind kostenlos. Ein eigener Domainname ist optional und kann kostenpflichtig sein.

## Installation auf dem iMac (Safari)
1. Die veröffentlichte HTTPS-Adresse in Safari öffnen.
2. Menü **Ablage → Zum Dock hinzufügen** wählen (bei aktuellen macOS-Versionen).
3. Namen bestätigen und **Hinzufügen** wählen.
4. Die App erscheint im Dock und lässt sich wie eine eigenständige Web-App öffnen.

Falls „Zum Dock hinzufügen“ nicht angezeigt wird: Safari aktualisieren oder die Seite zunächst in Safari öffnen. Alternativ kann die Seite als Lesezeichen gespeichert werden; das ist dann keine eigenständige Web-App.

## Installation auf dem iPhone
1. Die HTTPS-Adresse in **Safari** öffnen (nicht in einem In-App-Browser).
2. Auf **Teilen** tippen.
3. **Zum Home-Bildschirm** wählen.
4. Falls vorhanden, **Als Web-App öffnen** aktivieren.
5. **Hinzufügen** tippen.

## Nutzung
1. Genre, BPM, Style, Exclude, Dauer, Titel, Vocals und optionale Klangmodule wählen.
2. **Generate Prompt** drücken.
3. **Copy Style Prompt** in SUNOs Style-Feld einfügen.
4. **Copy Exclude** in SUNOs Exclude-Feld einfügen.
5. **Copy Title** für den Tracktitel verwenden.

## Datenschutz und Grenzen
- Einstellungen, Favoriten und Verlauf werden im lokalen Browser-Speicher des jeweiligen Geräts abgelegt. Sie werden nicht automatisch zwischen iMac und iPhone synchronisiert.
- Die App sendet keine Prompts an einen Server und enthält keine Tracking- oder Werbefunktionen.
- Die App generiert Textbausteine regelbasiert. Sie ruft keine KI auf. Smart Random erzeugt passende Zufallskombinationen, aber keine Garantie für musikalische Ergebnisse.
- SUNO kann gewünschte BPM und Dauer interpretieren, aber nicht immer exakt einhalten.
- Die App wurde als statisches PWA-Projekt vorbereitet. Vor dem produktiven Einsatz bitte auf beiden Geräten testen.

## Eigenes Icon
Das mitgelieferte Icon ist ein eigens für dieses Projekt gestaltetes Neon-grünes Audio-Waveform-Symbol. Wenn du ein eigenes Logo lieferst, kann es später eingesetzt werden.
